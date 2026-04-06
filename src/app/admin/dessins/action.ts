"use server";

import { AdminCategory, Work } from "@/lib/type.ts";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { drawing, drawingCategory, TYPE } from "@/db/schema.ts";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "@/app/admin/utils/adminActionHelper.ts";
import {
  createAdminCategoryObjects,
  createCategoryData,
  createDrawingData,
  createWorkObject,
} from "@/lib/utils/actionUtils.ts";

export async function createDrawing(initialState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = TYPE.DRAWING;

  try {
    if (await db.query.drawing.findFirst({ where: { title } }))
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };

    const fileInfos = await handleAddFiles(type, formData);
    const data = createDrawingData(formData, fileInfos);
    await db.insert(drawing).values(data);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Dessin ajouté`, isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function updateDrawing(initialState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const type = TYPE.DRAWING;
  const id = Number(rawFormData.id as string);
  const title = rawFormData.title as string;

  try {
    const itemToUpdate = await db.query.drawing.findFirst({ where: { id } });
    if (!itemToUpdate) return { message: `Dessin introuvable`, isError: true };

    if (itemToUpdate.title !== title) {
      const titleAlreadyExists = await db.query.drawing.findFirst({
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
        .update(drawingCategory)
        .set({
          imageFilename: "",
        })
        .where(eq(drawingCategory.imageFilename, itemToUpdate.imageFilename));

    const fileInfos = await handleAddFiles(type, formData);
    const data = createDrawingData(formData, fileInfos);
    await db.update(drawing).set(data).where(eq(drawing.id, id));

    const filenamesDeleted = await handleRemoveFiles(type, formData);
    if (filenamesDeleted) {
      for (const filename of filenamesDeleted)
        await db
          .update(drawingCategory)
          .set({ imageFilename: "" })
          .where(eq(drawingCategory.imageFilename, filename));
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Dessin modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function deleteDrawing(id: number) {
  const type = TYPE.DRAWING;

  try {
    const itemToDelete = await db.query.drawing.findFirst({
      where: { id },
    });

    if (!itemToDelete) return { message: `Dessin introuvable`, isError: true };

    await db.delete(drawing).where(eq(drawing.id, id));
    await handleRemoveFiles(type, undefined, [itemToDelete.imageFilename]);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Dessin supprimé`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export async function createDrawingCategory(formData: FormData) {
  const value = formData.get("value") as string;
  const data = createCategoryData(formData);

  try {
    const alreadyExists = await db.query.drawingCategory.findFirst({
      where: { value },
    });
    if (alreadyExists)
      return {
        message: "Erreur : nom de catégorie déjà existant",
        isError: true,
      };
    await db.insert(drawingCategory).values(data);

    revalidatePath(`/admin/${TYPE.DRAWING}s`);
    revalidatePath(`/${TYPE.DRAWING}s`);
    return { message: "Catégorie ajoutée", isError: false };
  } catch (e) {
    return { message: "Erreur à la création", isError: true };
  }
}

export async function updateDrawingCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const data = createCategoryData(formData);

  try {
    const catToUpdate = await db.query.drawingCategory.findFirst({
      where: { id },
    });
    if (catToUpdate) {
      await db
        .update(drawingCategory)
        .set(data)
        .where(eq(drawingCategory.id, id));
    }

    revalidatePath(`/admin/${TYPE.DRAWING}s`);
    revalidatePath(`/${TYPE.DRAWING}s`);
    return { message: "Catégorie modifiée", isError: false };
  } catch (e) {
    return { message: "Erreur à la modification", isError: true };
  }
}

export async function deleteDrawingCategory(id: number) {
  try {
    const catToDelete = await db.query.drawingCategory.findFirst({
      where: { id },
    });
    if (catToDelete) {
      await db.delete(drawingCategory).where(eq(drawingCategory.id, id));
    }

    revalidatePath(`/admin/${TYPE.DRAWING}s`);
    revalidatePath(`/${TYPE.DRAWING}s`);
    return { message: "Catégorie supprimée", isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression : ${e}`, isError: true };
  }
}

export const getDrawingWorks = async (): Promise<Work[]> => {
  const drawings = await db.query.drawing.findMany({
    columns: {
      createdAt: false,
    },
    orderBy: { date: "desc" },
  });
  return drawings.map((drawing) => {
    return { ...createWorkObject(drawing) };
  });
};

export const getDrawingAdminCategories = async (
  works: Work[],
): Promise<AdminCategory[]> => {
  const categories = await db.query.drawingCategory.findMany({
    orderBy: { value: "desc" },
  });
  return createAdminCategoryObjects(categories, works, TYPE.DRAWING);
};
