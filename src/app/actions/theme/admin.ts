"use server";

import prisma from "@/lib/prisma.ts";
import { revalidatePath } from "next/cache";
import { PresetColor, Theme } from "@@/prisma/generated/client";
import { THEME } from "@/constants/admin";
import { OnlyString } from "@/lib/type";

export async function createTheme(theme: Theme, newName: string) {
  try {
    const alreadyTheme = await prisma.theme.findUnique({
      where: { name: newName },
    });
    if (alreadyTheme)
      return {
        message: "Nom du thème déjà existant",
        isError: true,
        theme: undefined,
      };
    const { id, isActive, name, ...rest } = theme;
    const newTheme = await prisma.theme.create({
      data: {
        name: newName,
        isActive: false,
        ...rest,
      },
    });

    revalidatePath("/admin");
    return { message: "Thème ajouté", isError: false, theme: newTheme };
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
    await prisma.theme.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
    revalidatePath("/admin");
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
    const themeToDelete = await prisma.theme.findUnique({
      where: {
        id,
      },
    });

    if (themeToDelete) {
      if (themeToDelete.name === THEME.BASE_THEME) {
        return {
          message: "le thème par défaut ne peut pas être supprimé",
          isError: true,
          updatedThemes: null,
        };
      }
      if (themeToDelete.isActive) {
        await prisma.theme.update({
          where: {
            name: THEME.BASE_THEME,
          },
          data: {
            isActive: true,
          },
        });
      }
      await prisma.theme.delete({
        where: { id },
      });
    }
    const updatedThemes = await prisma.theme.findMany();

    revalidatePath("/admin");
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
    const activatedTheme = await prisma.theme.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });
    await prisma.theme.updateMany({
      where: {
        isActive: true,
        NOT: { id },
      },
      data: {
        isActive: false,
      },
    });
    revalidatePath("/admin");
    return { message: `Thème "${activatedTheme.name}" activé`, isError: false };
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
  const alreadyExist = await prisma.presetColor.findUnique({ where: { name } });
  if (alreadyExist)
    return {
      message: "Nom de la couleur déjà utilisé",
      isError: true,
      newPresetColor: null,
    };

  try {
    const newPresetColor = await prisma.presetColor.create({
      data: {
        name,
        color,
        displayOrder,
      },
    });
    revalidatePath("/admin");
    return { message: "Couleur perso ajoutée", isError: false, newPresetColor };
  } catch (e) {
    return {
      message: "Erreur à la création de la couleur perso",
      isError: true,
      newPresetColor: null,
    };
  }
}

export async function updatePresetColor(presetColor: PresetColor) {
  try {
    await prisma.presetColor.update({
      where: {
        id: presetColor.id,
      },
      data: {
        color: presetColor.color,
      },
    });
    revalidatePath("/admin");
    return { message: "Couleur perso modifiée", isError: false };
  } catch (e) {
    return {
      message: "Erreur à la modification de la couleur perso",
      isError: true,
    };
  }
}

export async function updatePresetColorsOrder(map: Map<number, number>) {
  const presetColors = await prisma.presetColor.findMany();

  try {
    for await (const p of presetColors) {
      await prisma.presetColor.update({
        where: {
          id: p.id,
        },
        data: {
          displayOrder: map.get(p.id),
        },
      });
    }
    const updatedPresetColors = await prisma.presetColor.findMany();

    revalidatePath("/admin");
    return { message: "", isError: false, updatedPresetColors };
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
    const presetColorToDelete = await prisma.presetColor.findUnique({
      where: {
        id,
      },
    });

    if (!presetColorToDelete)
      return {
        message: "Couleur perso introuvable",
        isError: true,
        updatedPresetColors: null,
        updatedThemes: null,
      };

    const themes: Theme[] = await prisma.theme.findMany();
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
        await prisma.theme.update({
          where: {
            id,
          },
          data: { ...rest },
        });
      }
    }

    await prisma.presetColor.delete({
      where: { id },
    });

    const presetColors = await prisma.presetColor.findMany();
    for await (const p of presetColors) {
      if (p.displayOrder > presetColorToDelete.displayOrder)
        await prisma.presetColor.update({
          where: { id: p.id },
          data: { displayOrder: p.displayOrder - 1 },
        });
    }

    const updatedThemes = await prisma.theme.findMany();
    const updatedPresetColors = await prisma.presetColor.findMany();

    revalidatePath("/admin");
    return {
      message: "Couleur perso supprimée",
      isError: false,
      updatedPresetColors,
      updatedThemes,
    };
  } catch (e) {
    return {
      message: "Erreur à la suppression",
      isError: true,
      updatedPresetColors: null,
      updatedThemes: null,
    };
  }
}
