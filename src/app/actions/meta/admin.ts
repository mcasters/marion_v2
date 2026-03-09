"use server";

import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import { META } from "@/constants/admin.ts";

export async function updateMeta(
  formData: FormData,
): Promise<{ message: string; isError: boolean }> {
  try {
    const label = formData.get("label") as string;
    let text;

    if (
      label === META.PAINTING_LAYOUT ||
      label === META.SCULPTURE_LAYOUT ||
      label === META.DRAWING_LAYOUT
    ) {
      const layout = formData.get("layout") as string;
      const darkBackground = formData.get("darkBackground") as string;
      text = `${layout},${darkBackground}`;
    } else text = formData.get("text") as string;

    const meta = await prisma.meta.findUnique({
      where: { label },
    });
    if (!meta) {
      await prisma.meta.create({
        data: {
          label,
          text,
        },
      });
    } else {
      await prisma.meta.update({
        where: { label },
        data: { text },
      });
    }
    revalidatePath("/admin");
    return { message: "Modification enregistrée", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}
