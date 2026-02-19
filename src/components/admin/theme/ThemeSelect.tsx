"use client";

import React from "react";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { Theme } from "@@/prisma/generated/client";

export default function ThemeSelect() {
  const { workTheme, setWorkTheme, themes } = useAdminWorkThemeContext();

  return (
    <select
      name="name"
      value={workTheme.id}
      onChange={(e) => {
        const selectedWorkTheme = themes.find(
          (t) => t.id === Number(e.target.value),
        ) as Theme;
        setWorkTheme(selectedWorkTheme);
      }}
      autoComplete="true"
    >
      {themes.map((t: Theme) => (
        <option key={t.id} value={t.id.toString()}>
          {`${t.name} ${t.isActive ? `(ACTIF)` : ""}`}
        </option>
      ))}
    </select>
  );
}
