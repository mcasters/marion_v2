"use server";
import prisma from "@/lib/prisma.ts";
import { Meta } from "@@/prisma/generated/client";
import { KEY_META } from "@/constants/admin.ts";
import { revalidatePath } from "next/cache";

export const getMetas = async (): Promise<Meta[]> =>
  await prisma.meta.findMany();

export async function updateMeta(
  formData: FormData,
): Promise<{ message: string; isError: boolean }> {
  try {
    const key = formData.get("key") as string;
    let text;

    if (
      key === KEY_META.PAINTING_LAYOUT ||
      key === KEY_META.SCULPTURE_LAYOUT ||
      key === KEY_META.DRAWING_LAYOUT
    ) {
      const layout = formData.get("layout") as string;
      const darkBackground = formData.get("darkBackground") as string;
      text = `${layout},${darkBackground}`;
    } else text = formData.get("text") as string;

    const meta = await prisma.meta.findUnique({
      where: { key },
    });
    if (!meta) {
      await prisma.meta.create({
        data: {
          key,
          text,
        },
      });
    } else {
      await prisma.meta.update({
        where: { key },
        data: { text },
      });
    }
    revalidatePath("/admin");
    return { message: "Modification enregistrée", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}
