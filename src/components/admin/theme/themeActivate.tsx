"use client";

import React from "react";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import { useAlert } from "@/app/context/alertProvider";
import { activateTheme } from "@/app/admin/themeAction.ts";
import { Theme } from "@/lib/type.ts";

export default function ThemeActivate() {
  const { workTheme, setWorkTheme, themes, setThemes } =
    useAdminWorkThemeContext();
  const alert = useAlert();

  const handleActivate = async () => {
    const res = await activateTheme(workTheme.id);
    setWorkTheme({ ...workTheme, isActive: true } as Theme);
    setThemes(
      themes.map((t) => {
        return t.id !== workTheme.id && t.isActive === true
          ? ({ ...t, isActive: false } as Theme)
          : t.id === workTheme.id
            ? ({ ...t, isActive: true } as Theme)
            : t;
      }),
    );
    alert(res.message, res.isError);
  };

  return (
    <button onClick={handleActivate} className="adminButton">
      Activer
    </button>
  );
}
