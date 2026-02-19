import { PresetColor, Theme } from "@@/prisma/generated/client";
import { DragListElement, OnlyString, StructTheme } from "@/lib/type.ts";

import { BASE_PRESET_COLOR, BASE_THEME } from "@/constants/specific";
import { createNestedObject } from "@/lib/utils/commonUtils.ts";

export const getBaseThemeData = () => {
  return BASE_THEME;
};
export const getBasePresetColorData = () => {
  return BASE_PRESET_COLOR;
};
export const themeToHexa = (
  theme: Theme,
  presetColors: PresetColor[],
): Theme => {
  const updatedTheme = theme;
  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === "string" && value.charAt(0) !== "#") {
      presetColors.find((p) => {
        if (p.name === value) {
          updatedTheme[key as keyof OnlyString<Theme>] = p.color;
        }
      });
    }
  });
  return updatedTheme;
};
export const colorNameToHex = (
  colorName: string,
  presetColors: PresetColor[],
): string => {
  let colorHex = colorName;
  if (colorName.charAt(0) !== "#") {
    presetColors.find((p) => {
      if (p.name === colorName) {
        colorHex = p.color;
      }
    });
  }
  return colorHex;
};

export function hexToRgb(
  hex: string,
  transform: number = 0,
): { r: number; g: number; b: number } | undefined {
  const array = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!array) return;
  const r = parseInt(array[1], 16) + transform;
  const g = parseInt(array[2], 16) + transform;
  const b = parseInt(array[3], 16) + transform;
  return { r: r <= 0 ? 0 : r, g: g <= 0 ? 0 : g, b: b <= 0 ? 0 : b };
} // hexToRgb("#0033ff").g; // "51";

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
} // rgbToHex(0, 51, 255); // #0033ff

export function getDarkerColor(
  colorHex: string,
  transform: number,
): string | undefined {
  const rgb = hexToRgb(colorHex, transform);
  return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : undefined;
}

export const getStructuredTheme = (theme: Theme): StructTheme => {
  const structuredTheme = {};
  Object.entries(theme).forEach(([key, value]) => {
    const stringSplit = key.split("_");

    if (stringSplit.length === 3) {
      const [page, pagePart, target] = stringSplit;
      createNestedObject(structuredTheme, page, pagePart)[target] = value;
    } else if (stringSplit.length === 2) {
      const [page, target] = stringSplit;
      createNestedObject(structuredTheme, page)[target] = value;
    }
  });
  return structuredTheme as StructTheme;
};

export const sortList = (
  list: DragListElement[],
  sourceIndex: number,
  targetIndex: number,
) => {
  const temp = list[sourceIndex];
  list.splice(sourceIndex, 1);
  let newIndex: number = 0;

  if (sourceIndex < targetIndex) {
    list.splice(targetIndex - 1, 0, temp);
    newIndex = targetIndex - 1;
  } else if (sourceIndex > targetIndex) {
    list.splice(targetIndex, 0, temp);
    newIndex = targetIndex;
  }
  const map: Map<number, number> = new Map();
  list.forEach((item, index) => map.set(item.id, index));
  return { map, newIndex };
};
