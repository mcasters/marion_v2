"use server";

import { AdminCategory, Type, Work } from "@/lib/type.ts";
import {
  createAdminCategoryObjects,
  createPaintingData,
  createWorkObject,
} from "@/app/actions/item-post/utils.ts";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { categoryContent, painting, paintingCategory } from "@/db/schema.ts";
import {
  handleAddAndRemoveFiles,
  handleImagesInCategory,
  handleRemoveFiles,
} from "@/app/admin/utils/workActionUtils.ts";

export async function createPainting(initialState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = Type.PAINTING;

  try {
    if ((await db.select().from(painting).where(eq(painting.title, title)))[0])
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
  const type = Type.PAINTING;
  const id = Number(rawFormData.id as string);
  const title = rawFormData.title as string;

  try {
    const itemToUpdate = (
      await db.select().from(painting).where(eq(painting.id, id))
    )[0];
    if (!itemToUpdate)
      return { message: `Peinture introuvable`, isError: true };

    if (itemToUpdate.title !== title) {
      const titleAlreadyExists = (
        await db.select().from(painting).where(eq(painting.title, title))
      )[0];
      if (titleAlreadyExists)
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };
    }

    const isChangingCategory = !!formData.get("oldCategoryId");
    if (isChangingCategory)
      await handleImagesInCategory(itemToUpdate.imageFilename);

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
  const type = Type.PAINTING;

  try {
    const itemToDelete = (
      await db.select().from(painting).where(eq(painting.id, id))
    )[0];

    if (!itemToDelete)
      return { message: `Peinture introuvable`, isError: true };

    await db.delete(painting).where(eq(painting.id, id));
    await handleRemoveFiles(type, [itemToDelete.imageFilename]);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Peinture supprimée`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export const getPaintingCategories = async (): Promise<AdminCategory[]> => {
  const categories = await db
    .select({
      id: paintingCategory.id,
      key: paintingCategory.key,
      value: paintingCategory.value,
      content: {
        title: categoryContent.title,
        text: categoryContent.text,
        image: categoryContent.imageFilename,
      },
    })
    .from(paintingCategory)
    .innerJoin(
      categoryContent,
      eq(paintingCategory.categoryContentId, categoryContent.id),
    )
    .orderBy(desc(paintingCategory.value));

  const paintings = await db.select().from(painting);
  return createAdminCategoryObjects(categories, paintings, Type.PAINTING);
};

export const getPaintingWorks = async (): Promise<Work[]> => {
  const paintings = await db
    .select()
    .from(painting)
    .orderBy(desc(painting.date));
  return paintings.map((painting) => {
    return { ...createWorkObject(painting, Type.PAINTING) };
  });
};
