"use server";

import { PresetColor, Theme } from "@@/prisma/generated/client";
import prisma from "@/lib/prisma.ts";
import { activateTheme } from "@/app/actions/theme/admin";

import {
  getBasePresetColorData,
  getBaseThemeData,
} from "@/lib/utils/themeUtils.ts";
import { THEME } from "@/constants/admin.ts";

export const getActiveTheme = async (): Promise<Theme> => {
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

export const getPresetColors = async (): Promise<PresetColor[]> => {
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

// For admin
export const getThemesFull = async (): Promise<Theme[]> =>
  await prisma.theme.findMany();

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
