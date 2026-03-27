"use server";
import {KEY_META} from "@/constants/admin.ts";
import {revalidatePath} from "next/cache";
import {meta} from "@/db/schema.ts"
import {db} from "@/db";
import {eq} from "drizzle-orm";

export const getMetas = async (): Promise<typeof meta.$inferSelect[]> =>
  await db.select().from(meta);

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

    const metaFind = await db.select()
      .from(meta)
      .where(eq(meta.key, key));

    if (!metaFind) {
      await db.insert(meta).values({
          key,
          text,
      });
    } else {
      await db.update(meta)
        .set({text})
        .where(eq(meta.key, key));
    }

    revalidatePath("/admin");
    return { message: "Modification enregistrée", isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}
