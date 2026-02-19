"use client";

import React from "react";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { Theme } from "@@/prisma/generated/client";

export default function ThemeCancel() {
  const { workTheme, setWorkTheme, isSaved, setIsSaved, themes } =
    useAdminWorkThemeContext();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setWorkTheme(themes.find((t) => t.id === workTheme.id) as Theme);
        setIsSaved(true);
      }}
      className="adminButton"
      disabled={isSaved}
    >
      Annuler les changements
    </button>
  );
}
