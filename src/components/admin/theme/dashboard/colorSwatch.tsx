"use client";

import { Theme } from "@@/prisma/generated/client";
import React, { useRef } from "react";
import s from "@/components/admin/theme/adminTheme.module.css";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import {
  OnlyString,
  StructTheme,
  ThemeGenTarget,
  ThemePage,
  ThemeTarget,
} from "@/lib/type";
import ColorPicker from "@/components/admin/theme/dashboard/colorPicker";
import Modal from "@/components/admin/form/modal.tsx";
import { createPresetColor } from "@/app/actions/theme/admin";
import { useAlert } from "@/app/context/alertProvider";
import { colorNameToHex } from "@/lib/utils/themeUtils";
import {
  THEME_GEN_TARGET_LABEL,
  THEME_LABEL,
  THEME_PAGE_LABEL,
  THEME_TARGET_LABEL,
} from "@/constants/admin";
import useModal from "@/components/hooks/useModal.ts";

interface Props {
  themeKey: string;
  pageKey: string | null;
  targetKey: string;
}

export default function ColorSwatch({ themeKey, pageKey, targetKey }: Props) {
  const {
    workTheme,
    setWorkTheme,
    isSaved,
    setIsSaved,
    presetColors,
    setPresetColors,
  } = useAdminWorkThemeContext();
  const alert = useAlert();
  const { isOpen, toggle } = useModal();
  const dbLabel = pageKey
    ? `${themeKey}_${pageKey}_${targetKey}`
    : `${themeKey}_${targetKey}`;
  const label = pageKey
    ? THEME_TARGET_LABEL[targetKey as keyof ThemeTarget]
    : THEME_GEN_TARGET_LABEL[targetKey as keyof ThemeGenTarget];
  const color: string = workTheme[dbLabel as keyof OnlyString<Theme>];
  const initialColor = useRef(color);
  const initialIsSaved = useRef(isSaved);

  const handleColorChange = (color: string) => {
    setWorkTheme({
      ...workTheme,
      [dbLabel]: color,
    } as Theme);
    setIsSaved(false);
  };

  const handleCreatePresetColor = async (
    nameColor: string,
    hexColor: string,
  ) => {
    const res = await createPresetColor(
      nameColor,
      hexColor,
      presetColors.length,
    );
    if (res.newPresetColor) {
      setPresetColors([...presetColors, res.newPresetColor]);
      setWorkTheme({ ...workTheme, [dbLabel]: nameColor } as Theme);
      setIsSaved(false);
    }
    alert(res.message, res.isError);
  };

  const handleCancel = () => {
    setIsSaved(initialIsSaved.current);
    setWorkTheme({
      ...workTheme,
      [dbLabel]: initialColor.current,
    } as Theme);
    toggle();
  };

  return (
    <div className={s.colorWrapper}>
      <button
        className={
          isOpen
            ? `${s.swatch} ${s.open}`
            : !color.startsWith("#")
              ? `${s.swatch} ${s.isPresetColor}`
              : s.swatch
        }
        style={{
          backgroundColor: colorNameToHex(color, presetColors),
        }}
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        title={color}
      />
      <p className={s.colorLabel}>{label}</p>
      <Modal
        isOpen={isOpen}
        title={`${THEME_LABEL[themeKey as keyof StructTheme]} / ${pageKey ? `${THEME_PAGE_LABEL[pageKey as keyof ThemePage]} /` : ""} ${label}`}
        onClickOutside={toggle}
        width={425}
      >
        <ColorPicker
          color={color}
          onColorChange={handleColorChange}
          onCreatePresetColor={handleCreatePresetColor}
          onClose={toggle}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}
