import { Type } from "@/lib/type";
import prisma from "@/lib/prisma.ts";
import {
  deleteFile,
  getDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils";
import { Prisma } from "@@/prisma/generated/client";

export const getItemModel = (type: Type) => {
  switch (type) {
    case Type.PAINTING:
      return prisma.painting;
    case Type.SCULPTURE:
      return prisma.sculpture;
    case Type.DRAWING:
      return prisma.drawing;
    case Type.POST:
      return prisma.post;
  }
};

export const deleteImages = async (filenamesToDelete: string, type: Type) => {
  const dir = getDir(type);

  if (!filenamesToDelete || filenamesToDelete === "") return;

  for await (const filename of filenamesToDelete.split(",")) {
    deleteFile(dir, filename);
    if (type === Type.SCULPTURE)
      await prisma.sculptureImage.delete({
        where: { filename },
      });
    if (type === Type.POST)
      await prisma.postImage.delete({
        where: { filename },
      });
    const categoryContents = await prisma.categoryContent.findMany({
      where: {
        imageFilename: filename,
      },
    });
    for await (const categoryContent of categoryContents) {
      await prisma.categoryContent.update({
        where: { id: categoryContent.id },
        data: {
          imageFilename: "",
          imageWidth: 0,
          imageHeight: 0,
        },
      });
    }
  }
};

export const getFilenameList = (images: [{ filename: string }]): string => {
  let string = "";
  images.forEach((image, i) => {
    if (i === 0) string = image.filename;
    else string += `,${image.filename}`;
  });
  return string;
};

export const createDataAndHandleFiles = async (
  type: Type,
  formData: FormData,
) => {
  const rawFormData = Object.fromEntries(formData);

  await deleteImages(rawFormData.filenamesToDelete as string, type);
  const newImages = await addImages(formData, type);

  if (type === Type.POST)
    return {
      title: rawFormData.title as string,
      date: new Date(rawFormData.date as string),
      text: rawFormData.text as string,
      images: newImages
        ? {
            create: newImages,
          }
        : undefined,
    };
  else {
    const isSculpture = type === Type.SCULPTURE;
    return {
      title: rawFormData.title as string,
      date: new Date(rawFormData.date as string),
      technique: rawFormData.technique as string,
      description: rawFormData.description as string,
      height: new Prisma.Decimal(rawFormData.height as string),
      width: new Prisma.Decimal(rawFormData.width as string),
      length: isSculpture
        ? new Prisma.Decimal(rawFormData.length as string)
        : undefined,
      isToSell: rawFormData.isToSell === "on",
      price: Number(rawFormData.price),
      isOut: rawFormData.isOut === "on",
      outInformation: rawFormData.outInformation as string,
      category: getCategory(formData),
      imageFilename:
        !isSculpture && newImages ? newImages[0].filename : undefined,
      imageWidth: !isSculpture && newImages ? newImages[0].width : undefined,
      imageHeight: !isSculpture && newImages ? newImages[0].height : undefined,
      images:
        isSculpture && newImages
          ? {
              create: newImages,
            }
          : undefined,
    };
  }
};

type FileInfo = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

const addImages = async (
  formData: FormData,
  type: Type,
): Promise<FileInfo[] | null> => {
  const tab: FileInfo[] = [];
  const title = formData.get("title") as string;
  const mainFile = formData.get("mainFile") as File;
  const files = formData.getAll("files") as File[];
  const dir = getDir(type);

  if (type === Type.POST && mainFile && mainFile.size > 0)
    tab.push(<FileInfo>await resizeAndSaveImage(mainFile, title, dir, true));
  if (files.length > 0) {
    for await (const file of files) {
      if (file.size > 0) {
        tab.push(
          <FileInfo>(
            await resizeAndSaveImage(
              file,
              title,
              dir,
              type === Type.POST && files.length === 1,
            )
          ),
        );
      }
    }
  }
  return tab.length > 0 ? tab : null;
};

const getCategory = (formData: FormData) => {
  const id = Number(formData.get("categoryId"));
  const oldId = Number(formData.get("oldCategoryId"));

  return id !== 0
    ? {
        connect: {
          id,
        },
      }
    : oldId
      ? {
          disconnect: {
            id: oldId,
          },
        }
      : {};
};
