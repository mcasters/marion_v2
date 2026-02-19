"use server";
import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import { Message } from "@/lib/type";

export async function getMessages(): Promise<Message[]> {
  const res = await prisma.message.findMany({
    include: { author: true },
    orderBy: { date: "desc" },
  });
  return JSON.parse(JSON.stringify(res));
}

export async function addMessage(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  if (rawFormData.id === "0") {
    const text = rawFormData.text as string;
    const userEmail = rawFormData.userEmail as string;

    try {
      await prisma.message.create({
        data: {
          date: new Date(),
          text,
          author: { connect: { email: userEmail } },
        },
      });
      revalidatePath(`/admin`);
      return { message: "Message ajouté", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  }
}

export async function updateMessage(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const id = Number(rawFormData.id);
  const text = rawFormData.text as string;

  const messageToUpdate = await prisma.message.findUnique({
    where: { id },
  });

  if (messageToUpdate) {
    const date = new Date();
    const dateUpdated =
      messageToUpdate.date.getFullYear() === date.getFullYear() &&
      messageToUpdate.date.getMonth() === date.getMonth() &&
      messageToUpdate.date.getDay() === date.getDay()
        ? null
        : date;

    try {
      await prisma.message.update({
        where: { id },
        data: {
          text,
          dateUpdated,
        },
      });
      revalidatePath(`/admin`);
      return { message: "Message modifié", isError: false };
    } catch (e) {
      return { message: `Erreur à l'enregistrement`, isError: true };
    }
  }
  return { message: `Erreur à l'enregistrement`, isError: true };
}

export async function deleteMessage(id: number) {
  try {
    await prisma.message.delete({
      where: { id },
    });
    revalidatePath(`/admin`);
  } catch (e) {}
}
