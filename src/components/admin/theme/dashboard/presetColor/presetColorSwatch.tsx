"use client";

import s from "@/components/admin/theme/adminTheme.module.css";
import React from "react";
import Modal from "@/components/admin/form/modal.tsx";
import { PresetColor } from "@@/prisma/generated/client";
import DeleteIcon from "@/components/icons/deleteIcon";
import { useAlert } from "@/app/context/alertProvider";
import {
  deletePresetColor,
  updatePresetColor,
} from "@/app/actions/theme/admin";
import { BASE_PRESET_COLOR } from "@/constants/specific";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import PresetColorPicker from "@/components/admin/theme/dashboard/presetColor/presetColorPicker";
import useModal from "@/components/hooks/useModal.ts";

interface Props {
  presetColor: PresetColor;
  count: number;
}

export default function PresetColorSwatch({ presetColor, count }: Props) {
  const alert = useAlert();
  const { isOpen, toggle } = useModal();
  const { setThemes, presetColors, setPresetColors, workTheme, setWorkTheme } =
    useAdminWorkThemeContext();

  const handleDelete = async () => {
    if (confirm("Sûr de vouloir supprimé ?")) {
      const { updatedPresetColors, updatedThemes, message, isError } =
        await deletePresetColor(presetColor.id);
      if (updatedThemes && updatedPresetColors) {
        setPresetColors(updatedPresetColors);
        setThemes(updatedThemes);
        const updatedWorkTheme = updatedThemes.find(
          (t) => t.id === workTheme.id,
        );
        if (updatedWorkTheme !== undefined) setWorkTheme(updatedWorkTheme);
      }
      alert(message, isError);
    }
  };

  const handleUpdate = async (color: string) => {
    const updatedPresetColor: PresetColor = {
      ...presetColor,
      color,
    } as PresetColor;
    const { message, isError } = await updatePresetColor(updatedPresetColor);
    if (!isError) {
      const updatedPresetColors = presetColors.map((p) => {
        if (p.id === updatedPresetColor.id) return updatedPresetColor;
        else return p;
      });
      setPresetColors(updatedPresetColors);
      if (!isError) toggle();
    }
    alert(message, isError);
  };

  return (
    <div className={s.presetColorWrapper}>
      <p className={s.presetColorLabel}>{presetColor.name}</p>
      <button
        className={`${s.swatch} ${s.presetColorSwatch}`}
        style={{
          backgroundColor: presetColor.color,
        }}
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
      />
      <button
        className="iconButton"
        onClick={handleDelete}
        disabled={presetColor.name === BASE_PRESET_COLOR.name}
      >
        <DeleteIcon />
      </button>
      <div className={s.info}>{count} utilisation(s)</div>
      <Modal
        isOpen={isOpen}
        title={`Modification de "${presetColor.name}"`}
        onClickOutside={toggle}
        width={400}
      >
        <PresetColorPicker
          presetColor={presetColor}
          onUpdate={handleUpdate}
          onCancel={toggle}
        />
      </Modal>
    </div>
  );
}
