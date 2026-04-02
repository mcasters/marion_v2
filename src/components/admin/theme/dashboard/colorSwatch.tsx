"use client";

import React, { useRef } from "react";
import s from "@/components/admin/theme/adminTheme.module.css";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { OnlyString, Theme } from "@/lib/type";
import ColorPicker from "@/components/admin/theme/dashboard/colorPicker";
import Modal from "@/components/admin/common/modal.tsx";
import { useAlert } from "@/app/context/alertProvider";
import { colorNameToHex } from "@/lib/utils/themeUtils";
import useModal from "@/components/hooks/useModal.ts";
import { createPresetColor } from "@/app/admin/themeAction.ts";

interface Props {
  dbKey: string;
  fullLabel: string;
}

export default function ColorSwatch({ dbKey, fullLabel }: Props) {
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
  const color: string = workTheme[dbKey as keyof OnlyString<Theme>];
  const initialColor = useRef(color);
  const initialIsSaved = useRef(isSaved);

  const handleColorChange = (color: string) => {
    setWorkTheme({
      ...workTheme,
      [dbKey]: color,
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
      setWorkTheme({ ...workTheme, [dbKey]: nameColor } as Theme);
      setIsSaved(false);
    }
    alert(res.message, res.isError);
  };

  const handleCancel = () => {
    setIsSaved(initialIsSaved.current);
    setWorkTheme({
      ...workTheme,
      [dbKey]: initialColor.current,
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
        onClick={() => toggle()}
        title={color}
      />
      <p className={s.colorLabel}>
        {fullLabel.substring(fullLabel.lastIndexOf("|") + 2)}
      </p>
      <Modal
        isOpen={isOpen}
        title={fullLabel}
        onClickOutside={toggle}
        width={440}
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
