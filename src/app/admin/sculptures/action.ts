"use server";

import { AdminCategory, Work } from "@/lib/type.ts";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  sculpture,
  sculptureCategory,
  sculptureImage,
  TYPE,
} from "@/db/schema.ts";
import {
  handleAddAndRemoveFiles,
  handleImagesInCategory,
  handleRemoveFiles,
} from "@/app/admin/utils/itemActionUtils.ts";
import {
  createAdminCategoryObjects,
  createCategoryData,
  createSculptureData,
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

    const fileInfos = await handleAddAndRemoveFiles(type, formData);
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
      with: { images: true },
    });

    if (!sculptureToUpdate)
      return { message: `Sculpture introuvable`, isError: true };

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

    if (!!formData.get("oldCategoryId")) {
      for await (const image of sculptureToUpdate.images) {
        await handleImagesInCategory(image.filename);
      }
    }

    await handleAddAndRemoveFiles(type, formData);
    const data = createSculptureData(formData);
    await db.update(sculpture).set(data).where(eq(sculpture.id, id));

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
      with: { images: true },
    });

    if (!sculptureToDelete)
      return { message: `Sculpture introuvable`, isError: true };

    await db.delete(sculpture).where(eq(sculpture.id, id));
    await handleRemoveFiles(
      type,
      sculptureToDelete.images.map((image) => image.filename),
    );

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Sculpture supprimée`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export const getSculptureWorks = async (): Promise<Work[]> => {
  return await db.query.sculpture.findMany({
    with: { images: true },
    orderBy: { date: "desc" },
  });
};

export const getSculptureCategories = async (
  works: Work[],
): Promise<AdminCategory[]> => {
  const categories = await db.query.sculptureCategory.findMany({
    orderBy: { value: "desc" },
  });
  return createAdminCategoryObjects(categories, works, TYPE.SCULPTURE);
};

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
