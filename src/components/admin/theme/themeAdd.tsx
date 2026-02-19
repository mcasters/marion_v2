"use client";

import React, { useState } from "react";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { useAlert } from "@/app/context/alertProvider";
import { createTheme } from "@/app/actions/theme/admin";

export default function ThemeAdd() {
  const { workTheme, setWorkTheme, setIsSaved, themes, setThemes } =
    useAdminWorkThemeContext();
  const [themeName, setThemeName] = useState<string>("");
  const alert = useAlert();

  const handleAdd = async () => {
    if (themeName === "") alert("Le nom du nouveau thème est manquant", true);
    else {
      const { theme, message, isError } = await createTheme(
        workTheme,
        themeName,
      );
      if (theme) {
        setThemes([...themes, theme]);
        setWorkTheme(theme);
        setIsSaved(true);
        setThemeName("");
      }
      alert(message, isError);
    }
  };

  return (
    <>
      <input
        name="newTheme"
        required
        placeholder="Nom du nouveau thème"
        type="text"
        value={themeName}
        onChange={(e) => {
          setThemeName(e.target.value);
        }}
        style={{
          height: "unset",
          width: "200px",
          margin: "0.5em 0",
        }}
      />
      <button
        onClick={handleAdd}
        className="adminButton"
        style={{ marginLeft: "0" }}
      >
        Sauvegarder en nouveau thème
      </button>
    </>
  );
}
