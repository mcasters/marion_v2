"use server";

import { AdminCategory, Work } from "@/lib/type.ts";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { painting, paintingCategory, TYPE } from "@/db/schema.ts";
import {
  handleAddAndRemoveFiles,
  handleRemoveFiles,
} from "@/app/admin/utils/adminActionHelper.ts";
import {
  createAdminCategoryObjects,
  createCategoryData,
  createPaintingData,
  createWorkObject,
} from "@/lib/utils/actionUtils.ts";

export async function createPainting(initialState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = TYPE.PAINTING;

  try {
    if (await db.query.painting.findFirst({ where: { title } }))
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };

    const fileInfos = await handleAddAndRemoveFiles(type, formData);
    const data = createPaintingData(formData, fileInfos);
    await db.insert(painting).values(data);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Peinture ajoutée`, isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function updatePainting(initialState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const type = TYPE.PAINTING;
  const id = Number(rawFormData.id as string);
  const title = rawFormData.title as string;

  try {
    const itemToUpdate = await db.query.painting.findFirst({ where: { id } });
    if (!itemToUpdate)
      return { message: `Peinture introuvable`, isError: true };

    if (itemToUpdate.title !== title) {
      const titleAlreadyExists = await db.query.painting.findFirst({
        where: { title },
      });
      if (titleAlreadyExists)
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };
    }

    if (!!formData.get("oldCategoryId"))
      await db
        .update(paintingCategory)
        .set({
          imageFilename: "",
        })
        .where(eq(paintingCategory.imageFilename, itemToUpdate.imageFilename));

    const fileInfos = await handleAddAndRemoveFiles(type, formData);
    const data = createPaintingData(formData, fileInfos);
    await db.update(painting).set(data).where(eq(painting.id, id));

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Peinture modifiée", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function deletePainting(id: number) {
  try {
    const itemToDelete = await db.query.painting.findFirst({
      where: { id },
    });

    if (!itemToDelete)
      return { message: `Peinture introuvable`, isError: true };

    await db.delete(painting).where(eq(painting.id, id));
    await handleRemoveFiles(TYPE.PAINTING, [itemToDelete.imageFilename]);

    revalidatePath(`/admin/${TYPE.PAINTING}s`);
    revalidatePath(`/${TYPE.PAINTING}s`);
    return { message: `Peinture supprimée`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export const getPaintingWorks = async (): Promise<Work[]> => {
  const paintings = await db.query.painting.findMany({
    orderBy: { date: "desc" },
  });
  return paintings.map((painting) => {
    return { ...createWorkObject(painting, TYPE.PAINTING) };
  });
};

export const getPaintingAdminCategories = async (
  works: Work[],
): Promise<AdminCategory[]> => {
  const categories = await db.query.paintingCategory.findMany({
    orderBy: { value: "desc" },
  });
  return createAdminCategoryObjects(categories, works, TYPE.PAINTING);
};

export async function createPaintingCategory(formData: FormData) {
  const value = formData.get("value") as string;
  const data = createCategoryData(formData);

  try {
    const alreadyExists = await db.query.paintingCategory.findFirst({
      where: { value },
    });
    if (alreadyExists)
      return {
        message: "Erreur : nom de catégorie déjà existant",
        isError: true,
      };
    await db.insert(paintingCategory).values(data);

    revalidatePath(`/admin/${TYPE.PAINTING}s`);
    revalidatePath(`/${TYPE.PAINTING}s`);
    return { message: "Catégorie ajoutée", isError: false };
  } catch (e) {
    return { message: "Erreur à la création", isError: true };
  }
}

export async function updatePaintingCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const data = createCategoryData(formData);

  try {
    const catToUpdate = await db.query.paintingCategory.findFirst({
      where: { id },
    });
    if (catToUpdate) {
      await db
        .update(paintingCategory)
        .set(data)
        .where(eq(paintingCategory.id, id));
    }

    revalidatePath(`/admin/${TYPE.PAINTING}s`);
    revalidatePath(`/${TYPE.PAINTING}s`);
    return { message: "Catégorie modifiée", isError: false };
  } catch (e) {
    return { message: "Erreur à la modification", isError: true };
  }
}

export async function deletePaintingCategory(id: number) {
  try {
    const catToDelete = await db.query.paintingCategory.findFirst({
      where: { id },
    });
    if (catToDelete) {
      await db.delete(paintingCategory).where(eq(paintingCategory.id, id));
    }

    revalidatePath(`/admin/${TYPE.PAINTING}s`);
    revalidatePath(`/${TYPE.PAINTING}s`);
    return { message: "Catégorie supprimée", isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression : ${e}`, isError: true };
  }
}
