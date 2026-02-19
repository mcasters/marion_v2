"use client";

import s from "@/components/admin/theme/adminTheme.module.css";
import React, { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { PresetColor } from "@@/prisma/generated/client";

interface Props {
  presetColor: PresetColor;
  onUpdate: (color: string) => void;
  onCancel: () => void;
}

export default function PresetColorPicker({
  presetColor,
  onUpdate,
  onCancel,
}: Props) {
  const [color, setColor] = useState<string>(presetColor.color);

  return (
    <div className={s.colorPicker}>
      <p>{`S'applique à toutes les utilisations de "${presetColor.name}"`}</p>
      <HexColorPicker
        color={color}
        onChange={setColor}
        style={{ width: "300px", margin: "0 auto 1em" }}
      />
      <div
        className={s.halfWidth}
        style={{
          backgroundColor: color,
        }}
      ></div>
      <HexColorInput
        color={color}
        onChange={setColor}
        prefixed={true}
        className={s.halfWidth}
      />
      <button className={s.halfWidth} onClick={() => onUpdate(color)}>
        OK
      </button>
      <button className={s.halfWidth} onClick={onCancel}>
        Annuler
      </button>
    </div>
  );
}
