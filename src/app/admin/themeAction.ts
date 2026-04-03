"use server";

import { OnlyString, PresetColor, Theme } from "@/lib/type.ts";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { THEME } from "@/constants/admin.ts";
import {
  getBasePresetColorData,
  getBaseThemeData,
} from "@/lib/utils/themeUtils.ts";
import { presetColor, theme } from "@/db/schema.ts";

export async function createTheme(newTheme: Theme) {
  try {
    const existant = await db.query.theme.findFirst({
      where: { name: newTheme.name },
    });

    if (existant)
      return {
        message: "Nom du thème déjà existant",
        isError: true,
        theme: undefined,
      };

    const newId = await db.insert(theme).values(newTheme).$returningId();
    const savedTheme = await db.query.theme.findFirst({
      where: { id: newId[0].id },
    });

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

export async function updateTheme(themeToUpdate: Theme) {
  try {
    await db
      .update(theme)
      .set(themeToUpdate)
      .where(eq(theme.id, themeToUpdate.id));

    revalidatePath("/*");
    return { message: `Theme "${themeToUpdate.name}" modifié`, isError: false };
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
    const themeToDelete = await db.query.theme.findFirst({ where: { id } });

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
          .update(theme)
          .set({ isActive: true })
          .where(eq(theme.name, THEME.BASE_THEME_NAME));

      await db.delete(theme).where(eq(theme.id, id));
    }
    const updatedThemes = await db.query.theme.findMany();

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
    await db.update(theme).set({ isActive: false });
    await db.update(theme).set({ isActive: true }).where(eq(theme.id, id));

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
) {
  try {
    const alreadyExist = (
      await db.select().from(presetColor).where(eq(presetColor.name, name))
    )[0];
    if (alreadyExist)
      return {
        message: "Nom de la couleur déjà utilisé",
        isError: true,
        newPresetColor: null,
      };

    const newId = await db
      .insert(presetColor)
      .values({
        name,
        color,
        displayOrder,
      })
      .$returningId();

    const newPresetColor = await db.query.presetColor.findFirst({
      where: { id: newId[0].id },
    });

    revalidatePath("/*");
    return {
      message: "Couleur perso ajoutée",
      isError: false,
      newPresetColor: newPresetColor,
    };
  } catch (e) {
    return {
      message: `Erreur à la création de la couleur perso`,
      isError: true,
      newPresetColor: null,
    };
  }
}

export async function updatePresetColor(presetColorToUpdate: PresetColor) {
  try {
    await db
      .update(presetColor)
      .set({
        color: presetColorToUpdate.color,
      })
      .where(eq(presetColor.id, presetColorToUpdate.id));

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
    const presetColors = await db.query.presetColor.findMany();
    for await (const p of presetColors) {
      await db
        .update(presetColor)
        .set({
          displayOrder: map.get(p.id),
        })
        .where(eq(presetColor.id, p.id));
    }
    const updatedPresetColors = await db.query.presetColor.findMany();

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
    const presetColorToDelete = await db.query.presetColor.findFirst({
      where: { id },
    });

    if (!presetColorToDelete)
      return {
        message: "Erreur à la suppression",
        isError: true,
        updatedPresetColors: null,
        updatedThemes: null,
      };
    else {
      const themes: Theme[] = await db.query.theme.findMany();
      for await (const t of themes) {
        const updatedTheme = t;
        let isModified = false;
        for await (const [key, value] of Object.entries(t)) {
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
          await db
            .update(theme)
            .set(updatedTheme)
            .where(eq(theme.id, updatedTheme.id));
        }
      }

      await db.delete(presetColor).where(eq(presetColor.id, id));

      const presetColors = await db.query.presetColor.findMany();
      for await (const p of presetColors) {
        if (p.displayOrder > presetColorToDelete.displayOrder)
          await db
            .update(presetColor)
            .set({ displayOrder: p.displayOrder - 1 })
            .where(eq(presetColor.id, p.id));
      }

      const updatedThemes = await db.query.theme.findMany();
      const updatedPresetColors = await db.query.presetColor.findMany();
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

export const getActiveTheme = async (): Promise<Theme> => {
  let activeTheme = await db.query.theme.findFirst({
    where: { isActive: true },
  });

  if (!activeTheme) {
    let themeToActivate = await db.query.theme.findFirst({
      where: { name: THEME.BASE_THEME_NAME },
    });

    if (!themeToActivate) {
      const newId = await db
        .insert(theme)
        .values({ ...getBaseThemeData() })
        .$returningId();
      themeToActivate = await db.query.theme.findFirst({
        where: { id: newId[0].id },
      });
    }

    await db
      .update(theme)
      .set({ isActive: true })
      .where(eq(theme.id, themeToActivate!.id));
    activeTheme = await db.query.theme.findFirst({ where: { isActive: true } });
  }
  return activeTheme!;
};

export const getPresetColors = async (): Promise<PresetColor[]> => {
  const presetColors = await db.query.presetColor.findMany();

  if (presetColors.length === 0) {
    const newId = await db
      .insert(presetColor)
      .values({ ...getBasePresetColorData() })
      .$returningId();
    const defaultPresetColor = await db.query.presetColor.findFirst({
      where: { id: newId[0].id },
    });
    presetColors.push(defaultPresetColor!);
  }
  return presetColors;
};
export const getThemes = async (): Promise<Theme[]> =>
  await db.query.theme.findMany();
