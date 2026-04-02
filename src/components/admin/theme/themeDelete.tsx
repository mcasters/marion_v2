"use client";

import React from "react";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { useAlert } from "@/app/context/alertProvider";
import { THEME } from "@/constants/admin";

import { deleteTheme } from "@/app/admin/themeAction.ts";
import { Theme } from "@/lib/type.ts";

export default function ThemeDelete() {
  const alert = useAlert();
  const { workTheme, setWorkTheme, setThemes } = useAdminWorkThemeContext();

  const handleDelete = async () => {
    const { message, isError, updatedThemes } = await deleteTheme(workTheme.id);
    if (updatedThemes) {
      setThemes(updatedThemes);
      setWorkTheme(updatedThemes.find((t) => t.isActive) as Theme);
    }
    alert(message, isError);
  };

  return (
    <button
      disabled={workTheme.name === THEME.BASE_THEME_NAME}
      onClick={handleDelete}
      className="adminButton"
    >
      Supprimer
    </button>
  );
}
