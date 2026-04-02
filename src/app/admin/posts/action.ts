"use server";

import { AdminCategory, Type, Work } from "@/lib/type.ts";
import {
  createAdminCategoryObjects,
  createPaintingData,
  createSculptureData,
  createWorkObjectFromSculpture,
} from "@/app/actions/item-post/utils.ts";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  categoryContent,
  sculpture,
  sculptureCategory,
  sculptureImage,
} from "@/db/schema.ts";
import {
  handleAddAndRemoveFiles,
  handleImagesInCategory,
  handleRemoveFiles,
} from "@/app/admin/utils/workActionUtils.ts";

export async function createSculpture(initialState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = Type.SCULPTURE;

  try {
    if (await db.query.sculpture.findFirst({ where: { title } }))
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };

    const data = createSculptureData(formData);
    const newId = (await db.insert(sculpture).values(data))[0].insertId;

    const fileInfos = await handleAddAndRemoveFiles(type, formData);
    if (fileInfos) {
      const images = fileInfos.map((fileInfo) => {
        return { ...fileInfo, sculptureId: newId };
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
  const type = Type.SCULPTURE;
  const id = Number(rawFormData.id as string);
  const title = rawFormData.title as string;

  try {
    const sculptureToUpdate = await db.query.sculpture.findFirst({
      where: { id },
      with: { sculptureImage: true },
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

    const isChangingCategory = !!formData.get("oldCategoryId");
    if (isChangingCategory) {
      for await (const image of sculptureToUpdate.sculptureImage) {
        await handleImagesInCategory(image.filename);
      }
    }

    const fileInfos = await handleAddAndRemoveFiles(type, formData);
    const data = createPaintingData(formData, fileInfos);
    await db.update(sculpture).set(data).where(eq(sculpture.id, id));

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Sculpture modifiée", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function deleteSculpture(id: number) {
  const type = Type.SCULPTURE;

  try {
    const itemToDelete = await db.query.sculpture.findFirst({
      where: { id },
      with: { sculptureImage: true },
    });

    if (!itemToDelete)
      return { message: `Sculpture introuvable`, isError: true };

    const images = await db.query.sculptureImage.findMany({
      where: { sculptureId: id },
    });
    await db.delete(sculpture).where(eq(sculpture.id, id));
    await handleRemoveFiles(type, [itemToDelete.imageFilename]);

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Sculpture supprimée`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export const getSculptureCategories = async (): Promise<AdminCategory[]> => {
  const categories = await db
    .select({
      id: sculptureCategory.id,
      key: sculptureCategory.key,
      value: sculptureCategory.value,
      categoryContentId: sculptureCategory.categoryContentId,
      content: {
        id: categoryContent.id,
        title: categoryContent.title,
        text: categoryContent.text,
        imageFilename: categoryContent.imageFilename,
        imageWidth: categoryContent.imageWidth,
        imageHeight: categoryContent.imageHeight,
      },
    })
    .from(sculptureCategory)
    .innerJoin(
      categoryContent,
      eq(sculptureCategory.categoryContentId, categoryContent.id),
    )
    .orderBy(desc(sculptureCategory.value));

  const sculptures = await db
    .select({
      id: sculpture.id,
      title: sculpture.title,
      date: sculpture.date,
      technique: sculpture.technique,
      description: sculpture.description,
      height: sculpture.height,
      width: sculpture.width,
      length: sculpture.length,
      createdAt: sculpture.createdAt,
      categoryId: sculpture.categoryId,
      isToSell: sculpture.isToSell,
      price: sculpture.price,
      sold: sculpture.sold,
      type: sculpture.type,
      isOut: sculpture.isOut,
      outInformation: sculpture.outInformation,
      images: {
        id: sculptureImage.id,
        filename: sculptureImage.filename,
        width: sculptureImage.width,
        height: sculptureImage.height,
        isMain: sculptureImage.isMain,
        sculptureId: sculpture.id,
      },
    })
    .from(sculpture)
    .innerJoin(sculptureImage, eq(sculpture.id, sculptureImage.sculptureId));

  return createAdminCategoryObjects(categories, sculptures, Type.SCULPTURE);
};

export const getSculptureWorks = async (): Promise<Work[]> => {
  const sculptures = await db
    .select()
    .from(sculpture)
    .orderBy(desc(sculpture.date));
  return sculptures.map((sculpture) => {
    return { ...createWorkObjectFromSculpture(sculpture) };
  });
};
