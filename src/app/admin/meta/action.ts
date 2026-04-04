"use server";

import { KEY_META } from "@/constants/admin.ts";
import { db } from "@/db";
import { meta } from "@/db/schema.ts";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getMetas = async (): Promise<Map<string, string>> => {
  const metas = await db.query.meta.findMany({
    columns: { id: false },
  });
  const map = new Map();
  metas.forEach((meta) => map.set(meta.key, meta.text));
  return map;
};

export const getMetasByKey = async (
  keyMeta: string[],
): Promise<Map<string, string>> => {
  const metas = await db.query.meta.findMany({
    columns: { id: false },
    where: {
      key: { OR: [...keyMeta] },
    },
  });
  const map = new Map();
  metas.forEach((meta) => map.set(meta.key, meta.text));
  return map;
};

export async function updateMeta(
  initialState: any,
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

    const metaFound = await db.query.meta.findFirst({
      where: { key },
    });

    if (!metaFound) {
      await db.insert(meta).values({
        key,
        text,
      });
    } else {
      await db.update(meta).set({ text }).where(eq(meta.key, key));
    }

    revalidatePath("/admin");
    return { message: "Modification enregistrée", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}
