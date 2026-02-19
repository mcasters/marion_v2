// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";
import {
  createDataAndHandleFiles,
  deleteImages,
  getFilenameList,
  getItemModel,
} from "@/app/actions/item-post/utils";
import { Type } from "@/lib/type";

export async function createItem(formData: FormData) {
  const type = formData.get("type") as Type;
  const title = formData.get("title") as string;
  const model = getItemModel(type);

  try {
    if (await model.findFirst({ where: { title } }))
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };
  } catch (e) {
    return { message: `Erreur à la vérification`, isError: true };
  }

  try {
    const data = await createDataAndHandleFiles(type, formData);
    await model.create({
      data,
    });

    revalidatePath(`/admin/${type}s`);
    return { message: `Item ajouté`, isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
}

export async function updateItem(formData: FormData) {
  const id = Number(formData.get("id"));
  const type = formData.get("type") as Type;
  const title = formData.get("title") as string;
  const model = getItemModel(type);

  try {
    const existingItem = await model.findFirst({
      where: { title },
    });
    if (existingItem && existingItem.id !== id)
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };
  } catch (e) {
    return { message: `Erreur à la vérification`, isError: true };
  }

  try {
    const data = await createDataAndHandleFiles(type, formData);
    await model.update({
      where: { id },
      data,
    });

    revalidatePath(`/admin/${type}s`);
    return { message: "Item modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
}

export async function deleteItem(id: number, type: Type) {
  const model = getItemModel(type);

  try {
    const item = await model.findUnique({
      where: { id },
      include:
        type === Type.SCULPTURE || type === Type.POST
          ? {
              images: {
                select: {
                  filename: true,
                },
              },
            }
          : undefined,
    });
    await deleteImages(getFilenameList(item.images), type);
    await model.delete({
      where: { id },
    });

    revalidatePath(`/admin/${type}s`);
    return { message: `Item supprimé`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}
