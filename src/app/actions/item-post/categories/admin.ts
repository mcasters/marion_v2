// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use server";

import { Type } from "@/lib/type";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma.ts";
import { createCategoryData } from "@/app/actions/item-post/utils.ts";

export async function createCategory(
  prevState: { message: string; isError: boolean } | null,
  formData: FormData,
) {
  const type = formData.get("type") as Type;
  const value = formData.get("value") as string;
  const data = createCategoryData(formData);

  try {
    if (type === Type.PAINTING) {
      const alreadyExists = await prisma.paintingCategory.findUnique({
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
      const alreadyExists = await prisma.sculptureCategory.findUnique({
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
      const alreadyExists = await prisma.drawingCategory.findUnique({
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
    revalidatePath(`/${type}s`);
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
  const data = createCategoryData(formData);

  try {
    if (type === Type.PAINTING) {
      await prisma.paintingCategory.update({
        where: { key: id },
        data,
      });
    }
    if (type === Type.SCULPTURE) {
      await prisma.sculptureCategory.update({
        where: { key: id },
        data,
      });
    }
    if (type === Type.DRAWING) {
      await prisma.drawingCategory.update({
        where: { key: id },
        data,
      });
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Catégorie modifiée", isError: false };
  } catch (e) {
    return { message: "Erreur à la modification", isError: true };
  }
}

export async function deleteCategory(
  id: number,
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING,
) {
  try {
    if (type === Type.PAINTING) {
      const category = await prisma.paintingCategory.delete({
        where: { id },
      });
      await prisma.categoryContent.delete({
        where: { id: category.categoryContentId },
      });
    }
    if (type === Type.SCULPTURE) {
      const category = await prisma.sculptureCategory.delete({
        where: { id },
      });
      await prisma.categoryContent.delete({
        where: { id: category.categoryContentId },
      });
    }
    if (type === Type.DRAWING) {
      const category = await prisma.drawingCategory.delete({
        where: { id },
      });
      await prisma.categoryContent.delete({
        where: { id: category.categoryContentId },
      });
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Catégorie supprimée", isError: false };
  } catch (e) {
    return { message: "Erreur à la suppression", isError: true };
  }
}
