"use server";

import { revalidatePath } from "next/cache";
import { THEME } from "@/constants/admin";
import { NewTheme, OnlyString, PresetColor, Theme } from "@/lib/type";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  presetColor as presetColorTable,
  theme as themeTable,
} from "@/db/schema";

export async function createTheme(newTheme: NewTheme) {
  try {
    const existants = await db
      .select()
      .from(themeTable)
      .where(eq(themeTable.name, newTheme.name));

    if (existants.length > 0)
      return {
        message: "Nom du thème déjà existant",
        isError: true,
        theme: undefined,
      };

    await db.insert(themeTable).values(newTheme);

    const savedTheme = (
      await db
        .select()
        .from(themeTable)
        .where(eq(themeTable.name, newTheme.name))
    )[0];

    revalidatePath("/*");
    return { message: "Thème ajouté", isError: false, theme: savedTheme };
  } catch (e) {
    return {
      message: `Erreur à l'enregistrement : ${e}`,
      isError: true,
      theme: undefined,
    };
  }
}

export async function updateTheme(theme: Theme) {
  try {
    const { id, ...rest } = theme;

    await db
      .update(themeTable)
      .set({ ...rest })
      .where(eq(themeTable.id, id));

    revalidatePath("/*");
    return { message: `Theme "${theme.name}" modifié`, isError: false };
  } catch (e) {
    return { message: "Erreur à l'enregistrement", isError: true };
  }
}

export async function deleteTheme(id: number): Promise<{
  message: string;
  isError: boolean;
  updatedThemes: Theme[] | null;
}> {
  try {
    const themeToDelete = (
      await db.select().from(themeTable).where(eq(themeTable.id, id))
    )[0];

    if (themeToDelete) {
      if (themeToDelete.name === THEME.BASE_THEME_NAME) {
        return {
          message: "le thème par défaut ne peut pas être supprimé",
          isError: true,
          updatedThemes: null,
        };
      }
      if (themeToDelete.isActive)
        await db
          .update(themeTable)
          .set({ isActive: true })
          .where(eq(themeTable.name, THEME.BASE_THEME_NAME));

      await db.delete(themeTable).where(eq(themeTable.id, id));
    }
    const updatedThemes = await db.select().from(themeTable);

    revalidatePath("/*");
    return { message: "Thème supprimé", isError: false, updatedThemes };
  } catch (e) {
    return {
      message: "Erreur à la suppression",
      isError: true,
      updatedThemes: null,
    };
  }
}

export async function activateTheme(id: number) {
  try {
    await db.update(themeTable).set({ isActive: false });

    await db
      .update(themeTable)
      .set({ isActive: true })
      .where(eq(themeTable.id, id));

    revalidatePath("/*");
    return { message: `Thème activé`, isError: false };
  } catch (e) {
    return { message: "Erreur à l'activation'", isError: true };
  }
}

export async function createPresetColor(
  name: string,
  color: string,
  displayOrder: number,
): Promise<{
  message: string;
  isError: boolean;
  newPresetColor: PresetColor | null;
}> {
  try {
    const alreadyExist = (
      await db
        .select()
        .from(presetColorTable)
        .where(eq(presetColorTable.name, name))
    )[0];
    if (alreadyExist)
      return {
        message: "Nom de la couleur déjà utilisé",
        isError: true,
        newPresetColor: null,
      };

    await db.insert(presetColorTable).values({
      name,
      color,
      displayOrder,
    });

    const newPresetColor = (
      await db
        .select()
        .from(presetColorTable)
        .where(eq(presetColorTable.name, name))
    )[0];

    revalidatePath("/*");
    return { message: "Couleur perso ajoutée", isError: false, newPresetColor };
  } catch (e) {
    return {
      message: `Erreur à la création de la couleur perso : ${e}`,
      isError: true,
      newPresetColor: null,
    };
  }
}

export async function updatePresetColor(presetColor: PresetColor) {
  try {
    await db
      .update(presetColorTable)
      .set({
        color: presetColor.color,
      })
      .where(eq(presetColorTable.id, presetColor.id));

    revalidatePath("/*");
    return { message: "Couleur perso modifiée", isError: false };
  } catch (e) {
    return {
      message: "Erreur à la modification de la couleur perso",
      isError: true,
    };
  }
}

export async function updatePresetColorsOrder(map: Map<number, number>) {
  try {
    const presetColors = await db.select().from(presetColorTable);
    for await (const p of presetColors) {
      await db
        .update(presetColorTable)
        .set({
          displayOrder: map.get(p.id),
        })
        .where(eq(presetColorTable.id, p.id));
    }
    const updatedPresetColors = await db.select().from(presetColorTable);

    revalidatePath("/*");
    return {
      message: "Ré-ordonnancement enregistré",
      isError: false,
      updatedPresetColors,
    };
  } catch (e) {
    return {
      message: `Erreur à l'ordonnancement de la couleur perso : ${e}`,
      isError: true,
      updatedPresetColors: null,
    };
  }
}

export async function deletePresetColor(id: number): Promise<{
  message: string;
  isError: boolean;
  updatedPresetColors: PresetColor[] | null;
  updatedThemes: Theme[] | null;
}> {
  try {
    const presetColorToDelete = (
      await db
        .select()
        .from(presetColorTable)
        .where(eq(presetColorTable.id, id))
    )[0];

    if (!presetColorToDelete)
      return {
        message: "Erreur à la suppression",
        isError: true,
        updatedPresetColors: null,
        updatedThemes: null,
      };
    else {
      const themes: Theme[] = await db.select().from(themeTable);
      for await (const theme of themes) {
        const updatedTheme = theme;
        let isModified = false;
        for await (const [key, value] of Object.entries(theme)) {
          if (
            value === presetColorToDelete.name &&
            key !== "name" &&
            key !== "isActive"
          ) {
            isModified = true;
            updatedTheme[key as keyof OnlyString<Theme>] =
              presetColorToDelete.color;
          }
        }
        if (isModified) {
          const { id, ...rest } = updatedTheme;
          await db
            .update(themeTable)
            .set({ ...rest })
            .where(eq(themeTable.id, id));
        }
      }

      await db.delete(presetColorTable).where(eq(presetColorTable.id, id));

      const presetColors = await db.select().from(presetColorTable);
      for await (const p of presetColors) {
        if (p.displayOrder > presetColorToDelete.displayOrder)
          await db
            .update(presetColorTable)
            .set({ displayOrder: p.displayOrder - 1 })
            .where(eq(presetColorTable.id, p.id));
      }

      const updatedThemes = await db.select().from(themeTable);
      const updatedPresetColors = await db.select().from(presetColorTable);
      revalidatePath("/*");
      return {
        message: "Couleur perso supprimée",
        isError: false,
        updatedPresetColors,
        updatedThemes,
      };
    }
  } catch (e) {
    return {
      message: "Erreur à la suppression",
      isError: true,
      updatedPresetColors: null,
      updatedThemes: null,
    };
  }
}
