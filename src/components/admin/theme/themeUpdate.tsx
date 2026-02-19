"use client";

import React from "react";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { useAlert } from "@/app/context/alertProvider";
import { THEME } from "@/constants/admin";
import { updateTheme } from "@/app/actions/theme/admin";

export default function ThemeUpdate() {
  const { workTheme, isSaved, setIsSaved, themes, setThemes } =
    useAdminWorkThemeContext();
  const alert = useAlert();

  const handleUpdate = async () => {
    const res = await updateTheme(workTheme);
    if (!res.isError) {
      const updatedThemes = themes.map((t) =>
        t.id === workTheme.id ? workTheme : t,
      );
      setThemes(updatedThemes);
      setIsSaved(true);
    }
    alert(res.message, res.isError);
  };

  return (
    <button
      onClick={handleUpdate}
      className="adminButton"
      disabled={workTheme.name === THEME.BASE_THEME || isSaved}
    >
      {`Sauvegarder le thème "${workTheme.name}"`}
    </button>
  );
}
