// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use server";

import { Type } from "@/lib/type";
import { revalidatePath } from "next/cache";
import {
  getCategoryData,
  getCategoryModel,
} from "@/app/actions/item-post/categories/utils";
import prisma from "@/lib/prisma.ts";

export async function createCategory(
  prevState: { message: string; isError: boolean } | null,
  formData: FormData,
) {
  const type = formData.get("type") as Type;
  const value = formData.get("value") as string;
  const data = getCategoryData(formData);
  const model = getCategoryModel(type);

  try {
    if (type === Type.PAINTING) {
      const alreadyExists = await model.findUnique({
        where: { value },
      });
      if (alreadyExists)
        return {
          message: "Erreur : nom de catégorie déjà existant",
          isError: true,
        };
      await prisma.paintingCategory.create({ data });
    }
    if (type === Type.SCULPTURE) {
      const alreadyExists = await model.findUnique({
        where: { value },
      });
      if (alreadyExists)
        return {
          message: "Erreur : nom de catégorie déjà existant",
          isError: true,
        };
      await prisma.sculptureCategory.create({ data });
    }
    if (type === Type.DRAWING) {
      const alreadyExists = await model.findUnique({
        where: { value },
      });
      if (alreadyExists)
        return {
          message: "Erreur : nom de catégorie déjà existant",
          isError: true,
        };
      await prisma.drawingCategory.create({ data });
    }

    revalidatePath(`/admin/${type}s`);
    return { message: "Catégorie ajoutée", isError: false };
  } catch (e) {
    return { message: "Erreur à la création", isError: true };
  }
}

export async function updateCategory(
  prevState: { message: string; isError: boolean } | null,
  formData: FormData,
) {
  const type = formData.get("type") as Type;
  const id = Number(formData.get("id"));
  const model = getCategoryModel(type);

  try {
    const data = getCategoryData(formData);
    await model.update({
      where: { id },
      data,
    });

    revalidatePath(`/admin/${type}s`);
    return { message: "Catégorie modifiée", isError: false };
  } catch (e) {
    return { message: "Erreur à la modification", isError: true };
  }
}

export async function deleteCategory(
  id: number,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
) {
  const model = getCategoryModel(type);

  try {
    const category = await model.findUnique({
      where: { id },
    });
    await model.delete({
      where: { id },
    });
    await prisma.categoryContent.delete({
      where: { id: category.categoryContentId },
    });

    revalidatePath(`/admin/${type}s`);
    return { message: "Catégorie supprimée", isError: false };
  } catch (e) {
    return { message: "Erreur à la suppression", isError: true };
  }
}
