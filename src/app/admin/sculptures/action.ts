"use server";

import { AdminCategory, Work } from "@/lib/type.ts";
import { db } from "@/db";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  sculpture,
  sculptureCategory,
  sculptureImage,
  TYPE,
} from "@/db/schema.ts";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "@/app/admin/utils/adminActionHelper.ts";
import {
  aggregateSculptureRows,
  createAdminCategoryObjects,
  createCategoryData,
  createSculptureData,
  createSculptureWorkObject,
} from "@/lib/utils/actionUtils.ts";

export async function createSculpture(initialState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = TYPE.SCULPTURE;

  try {
    if (await db.query.sculpture.findFirst({ where: { title } }))
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };

    const data = createSculptureData(formData);
    const newId = await db.insert(sculpture).values(data).$returningId();

    const fileInfos = await handleAddFiles(type, formData);
    if (fileInfos) {
      const images = fileInfos.map((fileInfo) => {
        return { ...fileInfo, sculptureId: newId[0].id };
      });
      await db.insert(sculptureImage).values(images);
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Sculpture ajoutée`, isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function updateSculpture(initialState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const type = TYPE.SCULPTURE;
  const id = Number(rawFormData.id as string);
  const title = rawFormData.title as string;

  try {
    const sculptureToUpdate = await db.query.sculpture.findFirst({
      where: { id },
    });
    if (!sculptureToUpdate)
      return { message: `Sculpture introuvable`, isError: true };

    const images = await db.query.sculptureImage.findMany({
      where: { sculptureId: sculptureToUpdate.id },
    });

    if (sculptureToUpdate.title !== title) {
      const titleAlreadyExists = await db.query.sculpture.findFirst({
        where: { title },
      });
      if (titleAlreadyExists)
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };
    }

    if (!!formData.get("oldCategoryId"))
      for await (const image of images) {
        await db
          .update(sculptureCategory)
          .set({
            imageFilename: "",
          })
          .where(eq(sculptureCategory.imageFilename, image.filename));
      }

    const data = createSculptureData(formData);
    await db.update(sculpture).set(data).where(eq(sculpture.id, id));

    const fileInfos = await handleAddFiles(type, formData);
    if (fileInfos) {
      const images = fileInfos.map((fileInfo) => {
        return { ...fileInfo, sculptureId: id };
      });
      await db.insert(sculptureImage).values(images);
    }

    const filenamesDeleted = await handleRemoveFiles(type, formData);
    if (filenamesDeleted) {
      for (const filename of filenamesDeleted) {
        await db
          .update(sculptureCategory)
          .set({ imageFilename: "" })
          .where(eq(sculptureCategory.imageFilename, filename));
        await db
          .delete(sculptureImage)
          .where(eq(sculptureImage.filename, filename));
      }
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Sculpture modifiée", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function deleteSculpture(id: number) {
  const type = TYPE.SCULPTURE;

  try {
    const sculptureToDelete = await db.query.sculpture.findFirst({
      where: { id },
    });

    if (!sculptureToDelete)
      return { message: `Sculpture introuvable`, isError: true };

    const images = await db.query.sculptureImage.findMany({
      where: { sculptureId: sculptureToDelete.id },
    });

    await db.delete(sculpture).where(eq(sculpture.id, id));

    const filenamesToDelete = images.map((image) => image.filename);
    await handleRemoveFiles(type, undefined, filenamesToDelete);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Sculpture supprimée`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export async function createSculptureCategory(formData: FormData) {
  const value = formData.get("value") as string;
  const data = createCategoryData(formData);

  try {
    const alreadyExists = await db.query.sculptureCategory.findFirst({
      where: { value },
    });
    if (alreadyExists)
      return {
        message: "Erreur : nom de catégorie déjà existant",
        isError: true,
      };
    await db.insert(sculptureCategory).values(data);

    revalidatePath(`/admin/${TYPE.SCULPTURE}s`);
    revalidatePath(`/${TYPE.SCULPTURE}s`);
    return { message: "Catégorie ajoutée", isError: false };
  } catch (e) {
    return { message: "Erreur à la création", isError: true };
  }
}

export async function updateSculptureCategory(formData: FormData) {
  const id = Number(formData.get("id"));
  const data = createCategoryData(formData);

  try {
    const catToUpdate = await db.query.sculptureCategory.findFirst({
      where: { id },
    });
    if (catToUpdate) {
      await db
        .update(sculptureCategory)
        .set(data)
        .where(eq(sculptureCategory.id, id));
    }

    revalidatePath(`/admin/${TYPE.SCULPTURE}s`);
    revalidatePath(`/${TYPE.SCULPTURE}s`);
    return { message: "Catégorie modifiée", isError: false };
  } catch (e) {
    return { message: "Erreur à la modification", isError: true };
  }
}

export async function deleteSculptureCategory(id: number) {
  try {
    const catToDelete = await db.query.sculptureCategory.findFirst({
      where: { id },
    });
    if (catToDelete) {
      await db.delete(sculptureCategory).where(eq(sculptureCategory.id, id));
    }

    revalidatePath(`/admin/${TYPE.SCULPTURE}s`);
    revalidatePath(`/${TYPE.SCULPTURE}s`);
    return { message: "Catégorie supprimée", isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression : ${e}`, isError: true };
  }
}

export const getSculptureWorks = async (): Promise<Work[]> => {
  const rows = await db
    .select({
      sculpture: sculpture,
      sculptureImage: sculptureImage,
    })
    .from(sculpture)
    .innerJoin(sculptureImage, eq(sculptureImage.sculptureId, sculpture.id))
    .orderBy(asc(sculpture.date));

  const result = aggregateSculptureRows(rows);
  return createSculptureWorkObject(result);
};

export const getAdminSculptureCategories = async (
  works: Work[],
): Promise<AdminCategory[]> => {
  const categories = await db.query.sculptureCategory.findMany({
    orderBy: { value: "desc" },
  });
  return createAdminCategoryObjects(categories, works, TYPE.SCULPTURE);
};
