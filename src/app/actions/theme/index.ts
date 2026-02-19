"use server";
import { PresetColor, Theme } from "@@/prisma/generated/client";
import prisma from "@/lib/prisma.ts";
import {
  queryActiveTheme,
  queryPresetColors,
} from "@/app/actions/theme/queries";
import { cacheDatas } from "@/lib/utils/serverUtils";

export async function getActiveTheme(): Promise<Theme> {
  const theme = await cacheDatas(() => queryActiveTheme(), "activeTheme");

  return JSON.parse(JSON.stringify(theme));
}

export async function getPresetColors(): Promise<PresetColor[]> {
  const presetColors = await cacheDatas(
    () => queryPresetColors(),
    "presetColors",
  );

  return JSON.parse(JSON.stringify(presetColors));
}

// For admin
export async function getThemesFull(): Promise<Theme[]> {
  const themes = await prisma.theme.findMany();

  return JSON.parse(JSON.stringify(themes));
}
