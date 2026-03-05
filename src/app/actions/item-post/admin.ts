"use server";

import { revalidatePath } from "next/cache";
import { AdminCategory, AdminPost, AdminWork, Type } from "@/lib/type";
import prisma from "@/lib/prisma.ts";
import { Drawing, Painting, Prisma } from "@@/prisma/generated/client.ts";
import { deleteFile, getDir } from "@/lib/utils/serverUtils.ts";
import {
  createAdminCategoryObjects,
  createPaintingData,
  createPostData,
  createPostObject,
  createSculptureData,
  createWorkObject,
  createWorkObjectFromSculpture,
  saveFiles,
} from "@/app/actions/item-post/utils.ts";
import { getEmptyPost } from "@/lib/utils/commonUtils.ts";

export async function createItem(formData: FormData) {
  const type = formData.get("type") as
    | Type.PAINTING
    | Type.SCULPTURE
    | Type.DRAWING
    | Type.POST;
  const title = formData.get("title") as string;

  try {
    const fileInfos = await saveFiles(formData, type, getDir(type));

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

export async function updateItem(formData: FormData) {
  const id = Number(formData.get("id"));
  const type = formData.get("type") as
    | Type.PAINTING
    | Type.SCULPTURE
    | Type.DRAWING
    | Type.POST;
  const title = formData.get("title") as string;
  const filenamesToDelete = formData.get("filenamesToDelete") as string;
  const dir = getDir(type);

  try {
    if (filenamesToDelete && filenamesToDelete !== "") {
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
      }
    }
    const fileInfos = await saveFiles(formData, type, dir);

    switch (type) {
      case Type.PAINTING: {
        const existingItem = await prisma.painting.findFirst({
          where: { title },
        });
        if (existingItem && existingItem.id !== id)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createPaintingData(formData, fileInfos);
        await prisma.painting.update({
          where: { id },
          data,
        });
        break;
      }
      case Type.SCULPTURE: {
        const existingItem = await prisma.sculpture.findFirst({
          where: { title },
        });
        if (existingItem && existingItem.id !== id)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createSculptureData(formData, fileInfos);
        await prisma.sculpture.update({
          where: { id },
          data,
        });
        break;
      }
      case Type.DRAWING: {
        const existingItem = await prisma.drawing.findFirst({
          where: { title },
        });
        if (existingItem && existingItem.id !== id)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createPaintingData(formData, fileInfos);
        await prisma.drawing.update({
          where: { id },
          data,
        });
        break;
      }
      case Type.POST: {
        const existingItem = await prisma.post.findFirst({
          where: { title },
        });
        if (existingItem && existingItem.id !== id)
          return {
            message: `Erreur : le titre "${title}" existe déjà`,
            isError: true,
          };
        const data = await createPostData(formData, fileInfos);
        await prisma.post.update({
          where: { id },
          data,
        });
        break;
      }
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Item modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
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
          await prisma.sculptureImage.deleteMany({
            where: { sculptureId: id },
          });
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
          await prisma.postImage.deleteMany({ where: { postId: id } });
          await prisma.post.delete({ where: { id } });
        }
        break;
      }
    }

    filenamesToDelete.forEach((filename) => {
      deleteFile(getDir(type), filename);
      if (type !== Type.POST) deleteImagesInCategory(filename);
    });

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

  const posts: AdminPost[] = dbData.map((data) => {
    return {
      ...createPostObject(data),
      modifiable: true,
    };
  });
  return posts.length === 0 ? [{ ...getEmptyPost() }] : posts;
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
      return createAdminCategoryObjects(dbData, items);
    }
    case Type.SCULPTURE: {
      dbData = await prisma.sculptureCategory.findMany({
        include: { content: true },
        orderBy: { value: "desc" },
      });
      items = await prisma.sculpture.findMany({ include: { images: true } });
      return createAdminCategoryObjects(dbData, items);
    }
    case Type.DRAWING: {
      dbData = await prisma.drawingCategory.findMany({
        include: { content: true },
        orderBy: { value: "desc" },
      });
      items = await prisma.drawing.findMany();
      return createAdminCategoryObjects(dbData, items);
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

const deleteImagesInCategory = async (filename: string) => {
  const categoryContent = await prisma.categoryContent.findFirst({
    where: {
      imageFilename: filename,
    },
  });
  if (categoryContent)
    await prisma.categoryContent.update({
      where: { id: categoryContent.id },
      data: {
        imageFilename: "",
        imageWidth: 0,
        imageHeight: 0,
      },
    });
};
