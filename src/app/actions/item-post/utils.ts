import { AdminCategory, Category, Image, Post, Type, Work } from "@/lib/type";
import { resizeAndSaveImage } from "@/lib/utils/serverUtils";
import { Drawing, Painting, Prisma } from "@@/prisma/generated/client";
import { getNoCategory, transformValueToKey } from "@/lib/utils/commonUtils.ts";

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

export const createCategoryData = (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const value = rawFormData.value as string;
  const isUpdate = rawFormData.id !== "0";
  const contentData = {
    title: rawFormData.title as string,
    text: rawFormData.text as string,
    imageFilename: rawFormData.filename as string,
    imageWidth: Number(rawFormData.width),
    imageHeight: Number(rawFormData.height),
  };

  const content = isUpdate
    ? {
        update: contentData,
      }
    : {
        create: contentData,
      };

  return {
    key: transformValueToKey(value),
    value,
    content,
  };
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
  data: Painting | Drawing,
  type: Type.PAINTING | Type.DRAWING,
): Work => {
  return {
    id: data.id,
    type,
    title: data.title,
    date: new Date(data.date),
    technique: data.technique,
    description: data.description,
    height: data.height,
    width: data.width,
    length: 0,
    isToSell: data.isToSell,
    price: data.price,
    sold: data.sold,
    isOut: data.isOut,
    outInformation: data.outInformation,
    categoryId: data.categoryId,
    images: [
      {
        filename: data.imageFilename,
        width: data.imageWidth,
        height: data.imageHeight,
        isMain: true,
      },
    ],
  };
};

export const createWorkObjectFromSculpture = (
  data: Prisma.SculptureGetPayload<{
    include: { images: true };
  }>,
): Work => {
  const images = [] as Image[];
  data.images.forEach((image) => {
    images.push({
      filename: image.filename,
      width: image.width,
      height: image.height,
      isMain: image.isMain,
    });
  });
  return {
    id: data.id,
    type: Type.SCULPTURE,
    title: data.title,
    date: new Date(data.date),
    technique: data.technique,
    description: data.description,
    height: data.height,
    width: data.width,
    length: data.length,
    isToSell: data.isToSell,
    price: data.price,
    sold: data.sold,
    isOut: data.isOut,
    outInformation: data.outInformation,
    categoryId: data.categoryId,
    images: data.images,
  };
};

export const createPostObject = (
  data: Prisma.PostGetPayload<{
    include: { images: true };
  }>,
): Post => {
  const images = [] as Image[];
  data.images.forEach((image) => {
    images.push({
      filename: image.filename,
      width: image.width,
      height: image.height,
      isMain: image.isMain,
    });
  });
  return {
    id: data.id,
    type: Type.POST,
    title: data.title,
    date: new Date(data.date),
    text: data.text,
    published: data.published,
    viewCount: data.viewCount,
    images: data.images,
  };
};

export const createCategoryObject = (
  data:
    | Prisma.PaintingCategoryGetPayload<{
        include: { content: true };
      }>
    | Prisma.SculptureCategoryGetPayload<{
        include: { content: true };
      }>
    | Prisma.DrawingCategoryGetPayload<{
        include: { content: true };
      }>,
): Category => {
  return {
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
  };
};

export const createAdminCategoryObjects = (
  categories:
    | Prisma.PaintingCategoryGetPayload<{
        include: { content: true };
      }>[]
    | Prisma.SculptureCategoryGetPayload<{
        include: { content: true };
      }>[]
    | Prisma.DrawingCategoryGetPayload<{
        include: { content: true };
      }>[],
  items:
    | Painting[]
    | Drawing[]
    | Prisma.SculptureGetPayload<{
        include: { images: true };
      }>[],
): AdminCategory[] => {
  const map = new Map();

  categories.forEach((category) => {
    map.set(category.id, {
      ...createCategoryObject(category),
      type: Type.CATEGORY,
      workType: items[0].type,
      images: [],
      count: 0,
      modifiable: true,
    });
  });
  map.set(0, {
    ...getNoCategory(),
    type: Type.CATEGORY,
    workType: items[0].type,
    images: [],
    count: 0,
    modifiable: false,
  });
  items.forEach((item) => {
    if (item.id === 0) return [...map.values()];
    const category =
      item.categoryId === null ? map.get(0) : map.get(item.categoryId);
    category.images.concat(
      "images" in item
        ? item.images
        : [
            {
              filename: item.imageFilename,
              width: item.width,
              height: item.height,
              isMain: true,
            },
          ],
    );
    category.count += 1;
  });
  return [...map.values()];
};
