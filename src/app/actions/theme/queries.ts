import { PresetColor, Theme } from "@@/prisma/generated/client";
import prisma from "@/lib/prisma.ts";
import { THEME } from "@/constants/admin";
import {
  getBasePresetColorData,
  getBaseThemeData,
} from "@/lib/utils/themeUtils";
import { activateTheme } from "@/app/actions/theme/admin";

export const queryActiveTheme = async (): Promise<Theme> => {
  let theme = await prisma.theme.findFirst({
    where: {
      isActive: true,
    },
  });
  if (!theme) {
    theme = await queryActivatedBaseTheme();
  }
  return theme;
};

export const queryPresetColors = async (): Promise<PresetColor[]> => {
  const presetColors = await prisma.presetColor.findMany();
  if (presetColors.length === 0) {
    const defaultPresetColor = await prisma.presetColor.create({
      data: {
        ...getBasePresetColorData(),
      },
    });
    presetColors.push(defaultPresetColor);
  }
  return presetColors;
};

const queryActivatedBaseTheme = async (): Promise<Theme> => {
  let theme = await prisma.theme.findUnique({
    where: {
      name: THEME.BASE_THEME,
    },
  });
  if (!theme) {
    theme = await prisma.theme.create({
      data: {
        ...getBaseThemeData(),
      },
    });
  }
  if (!theme.isActive) {
    await activateTheme(theme.id);
  }
  return theme;
};
