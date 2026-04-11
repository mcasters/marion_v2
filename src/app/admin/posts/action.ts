"use server";

import { Post } from "@/lib/type.ts";
import { db } from "@/db";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { post, postImage, TYPE } from "@/db/schema.ts";
import {
  handleAddFiles,
  handleRemoveFiles,
} from "@/app/admin/utils/adminActionHelper.ts";
import {
  aggregatePostRows,
  createPostData,
  createPostObject,
} from "@/lib/utils/actionUtils.ts";

export async function createPost(initialState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const type = TYPE.POST;

  try {
    if (await db.query.post.findFirst({ where: { title } }))
      return {
        message: `Erreur : le titre "${title}" existe déjà`,
        isError: true,
      };
    const data = createPostData(formData);
    const newId = await db.insert(post).values(data).$returningId();

    const fileInfos = await handleAddFiles(type, formData);
    if (fileInfos) {
      const images = fileInfos.map((fileInfo) => {
        return { ...fileInfo, postId: newId[0].id };
      });
      await db.insert(postImage).values(images);
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Post ajouté`, isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement : ${e}`, isError: true };
  }
}

export async function updatePost(initialState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const type = TYPE.POST;
  const id = Number(rawFormData.id as string);
  const title = rawFormData.title as string;

  try {
    const postToUpdate = await db.query.post.findFirst({
      where: { id },
    });
    if (!postToUpdate) return { message: `Post introuvable`, isError: true };

    if (postToUpdate.title !== title) {
      const titleAlreadyExists = await db.query.post.findFirst({
        where: { title },
      });
      if (titleAlreadyExists)
        return {
          message: `Erreur : le titre "${title}" existe déjà`,
          isError: true,
        };
    }

    const data = createPostData(formData);
    await db.update(post).set(data).where(eq(post.id, id));

    const fileInfos = await handleAddFiles(type, formData);
    if (fileInfos) {
      const images = fileInfos.map((fileInfo) => {
        return { ...fileInfo, postId: id };
      });
      await db.insert(postImage).values(images);
    }

    const filenamesDeleted = await handleRemoveFiles(type, formData);
    if (filenamesDeleted) {
      for (const filename of filenamesDeleted) {
        await db.delete(postImage).where(eq(postImage.filename, filename));
      }
    }

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: "Post modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
}

export async function deletePost(id: number) {
  const type = TYPE.POST;

  try {
    const postToDelete = await db.query.post.findFirst({
      where: { id },
    });
    if (!postToDelete) return { message: `Post introuvable`, isError: true };

    const images = await db.query.postImage.findMany({
      where: { postId: postToDelete.id },
    });

    await db.delete(post).where(eq(post.id, id));
    await handleRemoveFiles(
      type,
      undefined,
      images.map((image) => image.filename),
    );

    revalidatePath(`/admin/${type}s`);
    revalidatePath(`/${type}s`);
    return { message: `Post supprimé`, isError: false };
  } catch (e) {
    return { message: `Erreur à la suppression`, isError: true };
  }
}

export const getPosts = async (): Promise<Post[]> => {
  const rows = await db
    .select({
      post: post,
      postImage: postImage,
    })
    .from(post)
    .innerJoin(postImage, eq(postImage.postId, post.id))
    .orderBy(asc(post.date));

  const result = aggregatePostRows(rows);
  return createPostObject(result);
};
