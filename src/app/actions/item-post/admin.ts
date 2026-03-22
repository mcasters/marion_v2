"use server";

import { revalidatePath } from "next/cache";
import {
  AdminCategory,
  AdminPost,
  AdminWork,
  FileInfo,
  Type,
} from "@/lib/type";
import prisma from "@/lib/prisma.ts";
import { Drawing, Painting, Prisma } from "@@/prisma/generated/client.ts";
import {
  deleteFile,
  getDir,
  resizeAndSaveImage,
} from "@/lib/utils/serverUtils.ts";
import {
  createAdminCategoryObjects,
  createPaintingData,
  createPostData,
  createPostObject,
  createSculptureData,
  createWorkObject,
  createWorkObjectFromSculpture,
} from "@/app/actions/item-post/utils.ts";

export async function createItem(initialState: any, formData: FormData) {
  const type = formData.get("type") as
    | Type.PAINTING
    | Type.SCULPTURE
    | Type.DRAWING
    | Type.POST;
  const title = formData.get("title") as string;

  try {
    const fileInfos = await handleAddAndRemoveImages(type, formData);

    switch (type) {
      case Type.PAINTING: {
        if (await prisma.painting.findFirst({ where: { title } }))
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createPaintingData(formData, fileInfos);
        await prisma.painting.create({ data });
        break;
      }
      case Type.SCULPTURE: {
        if (await prisma.sculpture.findFirst({ where: { title } }))
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createSculptureData(formData, fileInfos);
        await prisma.sculpture.create({ data });
        break;
      }
      case Type.DRAWING: {
        if (await prisma.drawing.findFirst({ where: { title } }))
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createPaintingData(formData, fileInfos);
        await prisma.drawing.create({ data });
        break;
      }
      case Type.POST: {
        if (await prisma.post.findFirst({ where: { title } }))
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createPostData(formData, fileInfos);
        await prisma.post.create({ data });
        break;
      }
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Item ajouté`, isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
}

export async function updateItem(initialState: any, formData: FormData) {
  const id = Number(formData.get("id"));
  const type = formData.get("type") as
    | Type.PAINTING
    | Type.SCULPTURE
    | Type.DRAWING
    | Type.POST;
  const title = formData.get("title") as string;
  const isChangingCategory = !!formData.get("oldCategoryId");

  try {
    const fileInfos = await handleAddAndRemoveImages(type, formData);

    switch (type) {
      case Type.PAINTING: {
        const existingItem = await prisma.painting.findFirst({
          where: { title },
        });
        if (existingItem) {
          if (existingItem.id !== id)
            return {
              message: `Erreur : le titre "${title}" existe déjà`,
              isError: true,
            };
          const data = await createPaintingData(formData, fileInfos);
          await prisma.painting.update({
            where: { id },
            data,
          });
          if (isChangingCategory)
            await handleImagesInCategory(existingItem.imageFilename);
        }
        break;
      }
      case Type.SCULPTURE: {
        const existingItem = await prisma.sculpture.findFirst({
          where: { title },
          include: { images: true },
        });
        if (existingItem) {
          if (existingItem.id !== id)
            return {
              message: `Erreur : le titre "${title}" existe déjà`,
              isError: true,
            };
          const data = await createSculptureData(formData, fileInfos);
          await prisma.sculpture.update({
            where: { id },
            data,
          });
          if (isChangingCategory)
            for await (const image of existingItem.images)
              await handleImagesInCategory(image.filename);
        }
        break;
      }
      case Type.DRAWING: {
        const existingItem = await prisma.drawing.findFirst({
          where: { title },
        });
        if (existingItem) {
          if (existingItem.id !== id)
            return {
              message: `Erreur : le titre "${title}" existe déjà`,
              isError: true,
            };
          const data = await createPaintingData(formData, fileInfos);
          await prisma.drawing.update({
            where: { id },
            data,
          });
          if (isChangingCategory)
            await handleImagesInCategory(existingItem.imageFilename);
        }
        break;
      }
      case Type.POST: {
        const existingItem = await prisma.post.findFirst({
          where: { title },
        });
        if (existingItem) {
          if (existingItem.id !== id)
            return {
              message: `Erreur : le titre "${title}" existe déjà`,
              isError: true,
            };
          const data = await createPostData(formData, fileInfos);
          await prisma.post.update({
            where: { id },
            data,
          });
        }
        break;
      }
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Item modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function deleteItem(
  id: number,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING | Type.POST,
) {
  const filenamesToDelete: string[] = [];

  try {
    switch (type) {
      case Type.PAINTING: {
        const item = await prisma.painting.findUnique({
          where: { id },
        });

        if (item) {
          filenamesToDelete.push(item.imageFilename);
          await prisma.painting.delete({ where: { id } });
        }
        break;
      }
      case Type.SCULPTURE: {
        const item = await prisma.sculpture.findUnique({
          where: { id },
          include: { images: { select: { filename: true } } },
        });

        if (item) {
          item.images.forEach((image) =>
            filenamesToDelete.push(image.filename),
          );
          await prisma.sculpture.delete({ where: { id } });
        }
        break;
      }
      case Type.DRAWING: {
        const item = await prisma.drawing.findUnique({
          where: { id },
        });

        if (item) {
          filenamesToDelete.push(item.imageFilename);
          await prisma.drawing.delete({ where: { id } });
        }
        break;
      }
      case Type.POST: {
        const item = await prisma.post.findUnique({
          where: { id },
          include: { images: { select: { filename: true } } },
        });

        if (item) {
          item.images.forEach((image) =>
            filenamesToDelete.push(image.filename),
          );
          await prisma.post.delete({ where: { id } });
        }
        break;
      }
    }
    await handleAddAndRemoveImages(type, undefined, filenamesToDelete);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Item supprimé`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export const getAdminPosts = async (): Promise<AdminPost[]> => {
  const dbData = await prisma.post.findMany({
    include: { images: true },
    orderBy: { title: "desc" },
  });

  return dbData.map((data) => {
    return {
      ...createPostObject(data),
      modifiable: true,
    };
  });
};

export const getAdminCategories = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<AdminCategory[]> => {
  let dbData, items;

  switch (type) {
    case Type.PAINTING: {
      dbData = await prisma.paintingCategory.findMany({
        include: { content: true },
        orderBy: { value: "desc" },
      });
      items = await prisma.painting.findMany();
      return createAdminCategoryObjects(dbData, items, type);
    }
    case Type.SCULPTURE: {
      dbData = await prisma.sculptureCategory.findMany({
        include: { content: true },
        orderBy: { value: "desc" },
      });
      items = await prisma.sculpture.findMany({ include: { images: true } });
      return createAdminCategoryObjects(dbData, items, type);
    }
    case Type.DRAWING: {
      dbData = await prisma.drawingCategory.findMany({
        include: { content: true },
        orderBy: { value: "desc" },
      });
      items = await prisma.drawing.findMany();
      return createAdminCategoryObjects(dbData, items, type);
    }
  }
};

export const getAdminWorks = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
): Promise<AdminWork[]> => {
  switch (type) {
    case Type.PAINTING: {
      const dbData: Painting[] = await prisma.painting.findMany({
        orderBy: { date: "desc" },
      });
      return dbData.map((data) => {
        return {
          ...createWorkObject(data, Type.PAINTING),
          modifiable: true,
        };
      });
    }
    case Type.SCULPTURE: {
      const dbData: Prisma.SculptureGetPayload<{
        include: { images: true };
      }>[] = await prisma.sculpture.findMany({
        include: { images: true },
        orderBy: { date: "desc" },
      });
      return dbData.map((data) => {
        return {
          ...createWorkObjectFromSculpture(data),
          modifiable: true,
        };
      });
    }
    case Type.DRAWING: {
      const dbData: Drawing[] = await prisma.drawing.findMany({
        orderBy: { date: "desc" },
      });
      return dbData.map((data) => {
        return {
          ...createWorkObject(data, Type.DRAWING),
          modifiable: true,
        };
      });
    }
  }
};

const handleAddAndRemoveImages = async (
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING | Type.POST,
  formData?: FormData,
  filenamesToDelete?: string[],
): Promise<FileInfo[] | null> => {
  let _filenamesToDelete = filenamesToDelete ?? [];

  if (formData) {
    const filenamesToDelete = formData.get("filenamesToDelete") as string;
    if (filenamesToDelete !== "")
      _filenamesToDelete = filenamesToDelete.split(",");
  }

  for await (const filename of _filenamesToDelete) {
    deleteFile(getDir(type), filename);

    if (type === Type.POST) {
      await prisma.postImage.delete({
        where: { filename },
      });
    } else {
      await handleImagesInCategory(filename);
      if (type === Type.SCULPTURE) {
        await prisma.sculptureImage.delete({
          where: { filename },
        });
      }
    }
  }
  if (!formData) return null;

  const tab: FileInfo[] = [];
  const dir = getDir(type);
  const title = formData.get("title") as string;
  const mainFileToAdd = formData.getAll("mainFile") as File[];
  const filesToAdd = formData.getAll("filesToAdd") as File[];

  if (type === Type.POST && mainFileToAdd.length)
    tab.push(
      <FileInfo>await resizeAndSaveImage(mainFileToAdd[0], title, dir, true),
    );

  if (filesToAdd.length) {
    for await (const file of filesToAdd) {
      if (file.size > 0)
        tab.push(<FileInfo>await resizeAndSaveImage(file, title, dir, false));
    }
  }
  return tab.length > 0 ? tab : null;
};

const handleImagesInCategory = async (filename: string) => {
  await prisma.categoryContent.updateMany({
    where: { imageFilename: filename },
    data: {
      imageFilename: "",
      imageWidth: 0,
      imageHeight: 0,
    },
  });
};
