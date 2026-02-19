"use client";

import React, { useEffect, useState } from "react";
import s from "@/components/admin/theme/adminTheme.module.css";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";

import { colorNameToHex } from "@/lib/utils/themeUtils";

interface Props {
  color: string;
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
  const [_nameColor, set_nameColor] = useState<string>("");
  const [isColorChanged, setIsColorChanged] = useState<boolean>(false);

  useEffect(() => {
    set_nameColor(isPresetColor ? color : "");
  }, [workTheme]);

  const handleColorChange = (color: string) => {
    if (color.startsWith("#")) {
      set_nameColor("");
      setIsColorChanged(true);
    } else setIsColorChanged(false);
    onColorChange(color);
  };

  return (
    <div className={s.colorPicker}>
      <HexColorPicker
        color={hexColor}
        onChange={handleColorChange}
        style={{ width: "300px", margin: "0 auto 1em" }}
      />
      <div className={s.halfWidth} style={{ backgroundColor: hexColor }}></div>
      <HexColorInput
        color={hexColor}
        onChange={handleColorChange}
        prefixed={true}
        className={s.halfWidth}
      />
      <br />
      <br />
      <input
        className={s.halfWidth}
        placeholder="Nom de la couleur"
        value={_nameColor}
        onChange={(e) => set_nameColor(e.target.value)}
      />
      <button
        onClick={() => onCreatePresetColor(_nameColor, hexColor)}
        className={s.halfWidth}
        disabled={
          _nameColor === "" ||
          _nameColor === color ||
          (!isColorChanged && isPresetColor)
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
              onClick={() => handleColorChange(p.name)}
            />
            <p>{p.name}</p>
          </div>
        ))}
      </div>
      <button onClick={onClose} className={s.halfWidth}>
        OK
      </button>
      <button onClick={onCancel} className={s.halfWidth}>
        Annuler
      </button>
    </div>
  );
}
