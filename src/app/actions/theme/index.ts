"use server";

import { db } from "@/db";

import {
  getBasePresetColorData,
  getBaseThemeData,
} from "@/lib/utils/themeUtils.ts";
import { PresetColor, Theme } from "@/lib/type.ts";
import {
  presetColor as presetColorTable,
  theme as themeTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { THEME } from "@/constants/admin.ts";

export const getActiveTheme = async (): Promise<Theme> => {
  let theme = (
    await db.select().from(themeTable).where(eq(themeTable.isActive, true))
  )[0];

  if (!theme) {
    theme = (
      await db
        .select()
        .from(themeTable)
        .where(eq(themeTable.name, THEME.BASE_THEME_NAME))
    )[0];

    if (!theme) {
      await db.insert(themeTable).values({ ...getBaseThemeData() });
      theme = (
        await db
          .select()
          .from(themeTable)
          .where(eq(themeTable.name, THEME.BASE_THEME_NAME))
      )[0];
    }
  }

  if (!theme.isActive) {
    await db
      .update(themeTable)
      .set({ isActive: true })
      .where(eq(themeTable.name, THEME.BASE_THEME_NAME));
    theme = (
      await db.select().from(themeTable).where(eq(themeTable.isActive, true))
    )[0];
  }
  return theme;
};

export const getPresetColors = async (): Promise<PresetColor[]> => {
  const presetColors = await db.select().from(presetColorTable);
  if (presetColors.length === 0) {
    await db.insert(presetColorTable).values({ ...getBasePresetColorData() });
    const defaultPresetColor = (await db.select().from(presetColorTable))[0];
    presetColors.push(defaultPresetColor);
  }
  return presetColors;
};

// For admin
export const getThemes = async (): Promise<Theme[]> =>
  await db.select().from(themeTable);
