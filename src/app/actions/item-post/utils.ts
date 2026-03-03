import { Category, Image, Post, Type, Work } from "@/lib/type";
import { resizeAndSaveImage } from "@/lib/utils/serverUtils";
import { Drawing, Painting, Prisma } from "@@/prisma/generated/client";
import {
  getEmptyPost,
  getEmptyWork,
  getNoCategory,
} from "@/lib/utils/commonUtils.ts";

export const createPaintingData = async (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => {
  const rawFormData = Object.fromEntries(formData);
  const id = Number(formData.get("categoryId"));
  const oldId = Number(formData.get("oldCategoryId"));

  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    technique: rawFormData.technique as string,
    description: rawFormData.description as string,
    height: Number(rawFormData.height as string),
    width: Number(rawFormData.width as string),
    isToSell: rawFormData.isToSell === "on",
    price: Number(rawFormData.price),
    isOut: rawFormData.isOut === "on",
    outInformation: rawFormData.outInformation as string,
    category:
      id !== 0
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
          : {},
    imageFilename: fileInfos ? fileInfos[0].filename : undefined,
    imageWidth: fileInfos ? fileInfos[0].width : undefined,
    imageHeight: fileInfos ? fileInfos[0].height : undefined,
  };
};

export const createSculptureData = async (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => {
  const rawFormData = Object.fromEntries(formData);

  const id = Number(formData.get("categoryId"));
  const oldId = Number(formData.get("oldCategoryId"));

  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    technique: rawFormData.technique as string,
    description: rawFormData.description as string,
    height: Number(rawFormData.height as string),
    width: Number(rawFormData.width as string),
    length: Number(rawFormData.length as string),
    isToSell: rawFormData.isToSell === "on",
    price: Number(rawFormData.price),
    isOut: rawFormData.isOut === "on",
    outInformation: rawFormData.outInformation as string,
    category:
      id !== 0
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
          : {},
    images: fileInfos
      ? {
          create: fileInfos,
        }
      : undefined,
  };
};

export const createPostData = async (
  formData: FormData,
  fileInfos: FileInfo[] | null,
) => {
  const rawFormData = Object.fromEntries(formData);

  return {
    title: rawFormData.title as string,
    date: new Date(rawFormData.date as string),
    text: rawFormData.text as string,
    images: fileInfos
      ? {
          create: fileInfos,
        }
      : undefined,
  };
};

type FileInfo = {
  filename: string;
  width: number;
  height: number;
  isMain: boolean;
};

export const saveFiles = async (
  formData: FormData,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING | Type.POST,
  dir: string,
): Promise<FileInfo[] | null> => {
  const tab: FileInfo[] = [];
  const title = formData.get("title") as string;
  const mainFile = formData.get("mainFile") as File;
  const files = formData.getAll("files") as File[];

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
export const createWorkObject = (
  data: Painting[] | Drawing[],
  type: Type.PAINTING | Type.DRAWING,
  noEmpty: boolean = false,
): Work[] => {
  const works = [] as Work[];

  data.forEach((item) => {
    works.push({
      id: item.id,
      type,
      title: item.title,
      date: new Date(item.date),
      technique: item.technique,
      description: item.description,
      height: item.height,
      width: item.width,
      length: 0,
      isToSell: item.isToSell,
      price: item.price,
      sold: item.sold,
      isOut: item.isOut,
      outInformation: item.outInformation,
      categoryId: item.categoryId,
      images: [
        {
          filename: item.imageFilename,
          width: item.imageWidth,
          height: item.imageHeight,
          isMain: true,
        },
      ],
    });
  });
  if (works.length === 0 && noEmpty) {
    works.push(getEmptyWork(type));
  }
  return works;
};

export const createWorkObjectFromSculpture = (
  data: Prisma.SculptureGetPayload<{
    include: { images: true };
  }>[],
  noEmpty: boolean = false,
): Work[] => {
  const works = [] as Work[];

  data.forEach((item) => {
    const images = [] as Image[];
    item.images.forEach((image) => {
      images.push({
        filename: image.filename,
        width: image.width,
        height: image.height,
        isMain: image.isMain,
      });
    });

    works.push({
      id: item.id,
      type: Type.SCULPTURE,
      title: item.title,
      date: new Date(item.date),
      technique: item.technique,
      description: item.description,
      height: item.height,
      width: item.width,
      length: item.length,
      isToSell: item.isToSell,
      price: item.price,
      sold: item.sold,
      isOut: item.isOut,
      outInformation: item.outInformation,
      categoryId: item.categoryId,
      images: item.images,
    });
  });

  if (works.length === 0 && noEmpty) {
    works.push(getEmptyWork(Type.SCULPTURE));
  }
  return works;
};

export const createPostObject = (
  data: Prisma.PostGetPayload<{
    include: { images: true };
  }>[],
  noEmpty: boolean = false,
): Post[] => {
  const posts = [] as Post[];

  data.forEach((item) => {
    const images = [] as Image[];
    item.images.forEach((image) => {
      images.push({
        filename: image.filename,
        width: image.width,
        height: image.height,
        isMain: image.isMain,
      });
    });

    posts.push({
      id: item.id,
      type: Type.POST,
      title: item.title,
      date: new Date(item.date),
      text: item.text,
      published: item.published,
      viewCount: item.viewCount,
      images: item.images,
    });
  });

  if (posts.length === 0 && noEmpty) {
    posts.push(getEmptyPost());
  }
  return posts;
};

export const createCategoryObject = (
  dbData:
    | Prisma.PaintingCategoryGetPayload<{
        include: { content: true };
      }>[]
    | Prisma.SculptureCategoryGetPayload<{
        include: { content: true };
      }>[]
    | Prisma.DrawingCategoryGetPayload<{
        include: { content: true };
      }>[],
  noCategory: boolean,
) => {
  const categories = [] as Category[];
  dbData.forEach((data) => {
    categories.push({
      id: data.id,
      key: data.key,
      value: data.value,
      content: {
        title: data.content.title,
        text: data.content.text,
        image: {
          filename: data.content.imageFilename,
          width: data.content.imageWidth,
          height: data.content.imageHeight,
          isMain: true,
        },
      },
    });
  });

  if (noCategory) categories.push(getNoCategory());
  return categories;
};
