"use client";

import React, { useEffect, useState } from "react";
import s from "@/components/admin/theme/adminTheme.module.css";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";

import { colorNameToHex } from "@/lib/utils/themeUtils";

interface Props {
  color: string; // Hex or presetColor name
  onColorChange: (color: string) => void;
  onCreatePresetColor: (nameColor: string, hexColor: string) => void;
  onClose: () => void;
  onCancel: () => void;
}

export default function ColorPicker({
  color,
  onColorChange,
  onCreatePresetColor,
  onClose,
  onCancel,
}: Props) {
  const { workTheme, presetColors } = useAdminWorkThemeContext();
  const isPresetColor = !color.startsWith("#");
  const hexColor = colorNameToHex(color, presetColors);
  const [name, setName] = useState<string>("");
  const [colorChanged, setColorChanged] = useState<boolean>(false);

  useEffect(() => {
    setName(isPresetColor ? color : "");
  }, [workTheme]);

  const handleNewColor = (color: string) => {
    setName("");
    setColorChanged(true);
    onColorChange(color);
  };

  const handleSelectPresetColor = (name: string) => {
    setColorChanged(false);
    onColorChange(name);
  };

  return (
    <div className={s.colorPicker}>
      <HexColorPicker
        color={hexColor}
        onChange={handleNewColor}
        style={{ width: "300px", margin: "0 auto 1em" }}
      />
      <div className={s.halfWidth} style={{ backgroundColor: hexColor }}></div>
      <HexColorInput
        color={hexColor}
        onChange={handleNewColor}
        prefixed={true}
        className={s.halfWidth}
      />
      <br />
      <input
        className={s.halfWidth}
        placeholder="Nom de la couleur"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => onCreatePresetColor(name, hexColor)}
        className={`${s.halfWidth} adminButton`}
        disabled={
          name === "" || name === color || (!colorChanged && isPresetColor)
        }
      >
        Mémoriser la couleur
      </button>
      <div className={s.pickerPresetColor}>
        {presetColors?.map((p) => (
          <div key={p.id} className={s.presetColorContainer}>
            <button
              className={
                p.name === color ? `${s.swatch} ${s.isPresetColor}` : s.swatch
              }
              style={{
                background: p.color,
              }}
              onClick={() => handleSelectPresetColor(p.name)}
            />
            <p>{p.name}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className={`${s.halfWidth} adminButton`}
        style={{ marginRight: "1.5em" }}
      >
        OK
      </button>
      <button onClick={onCancel} className={`${s.halfWidth} adminButton`}>
        Annuler
      </button>
    </div>
  );
}
