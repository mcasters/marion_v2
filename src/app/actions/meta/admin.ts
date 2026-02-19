"use server";

import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";

export async function updateMeta(
  prevState: { message: string; isError: boolean } | null,
  formData: FormData,
) {
  try {
    const label = formData.get("label") as string;
    let text;

    if (
      label === "paintingLayout" ||
      label === "sculptureLayout" ||
      label === "drawingLayout"
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
    revalidatePath("/admin/meta");
    return { message: "Modification enregistrée", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}
