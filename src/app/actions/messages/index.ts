"use server";
import { revalidatePath } from "next/cache";
import { Message } from "@/lib/type";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { message, user } from "@/db/schema.ts";

export const getMessages = async (): Promise<Message[]> =>
  await db
    .select({
      id: message.id,
      date: message.date,
      dateUpdated: message.dateUpdated,
      text: message.text,
      author: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
    .from(message)
    .innerJoin(user, eq(user.id, message.userId))
    .orderBy(desc(message.date));

export const addMessage = async (initialState: any, formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const text = rawFormData.text as string;
  const userId = Number(rawFormData.userId as string);
  try {
    await db.insert(message).values({
      date: new Date(),
      text,
      userId,
    });

    revalidatePath(`/admin`);
    return { message: "Message ajouté", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
};

export const updateMessage = async (initialState: any, formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);
  const id = Number(rawFormData.id as string);
  const text = rawFormData.text as string;
  try {
    await db
      .update(message)
      .set({
        text,
        dateUpdated: new Date(),
      })
      .where(eq(message.id, id));

    revalidatePath(`/admin`);
    return { message: "Message modifié", isError: false };
  } catch (e) {
    return { message: `Erreur à l'enregistrement`, isError: true };
  }
};

export const deleteMessage = async (id: number) => {
  try {
    await db.delete(message).where(eq(message.id, id));
    revalidatePath(`/admin`);
  } catch (e) {}
};
