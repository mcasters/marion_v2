"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { PresetColor, Theme } from "@@/prisma/generated/client";

export interface AdminWorkThemeContextType {
  workTheme: Theme;
  setWorkTheme: React.Dispatch<React.SetStateAction<Theme>>;
  isSaved: boolean;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
  themes: Theme[];
  setThemes: React.Dispatch<React.SetStateAction<Theme[]>>;
  presetColors: PresetColor[];
  setPresetColors: React.Dispatch<React.SetStateAction<PresetColor[]>>;
}

const AdminWorkThemeContext = createContext<AdminWorkThemeContextType>(
  {} as AdminWorkThemeContextType,
);

interface Props {
  defaultWorkTheme: Theme;
  defaultThemes: Theme[];
  defaultPresetColors: PresetColor[];
  children: ReactNode;
}

export function AdminWorkThemeProvider({
  defaultWorkTheme,
  defaultThemes,
  defaultPresetColors,
  children,
}: Props) {
  const [workTheme, setWorkTheme] = useState<Theme>(defaultWorkTheme);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [presetColors, setPresetColors] =
    useState<PresetColor[]>(defaultPresetColors);

  return (
    <AdminWorkThemeContext.Provider
      value={{
        workTheme,
        setWorkTheme,
        isSaved,
        setIsSaved,
        themes,
        setThemes,
        presetColors,
        setPresetColors,
      }}
    >
      {children}
    </AdminWorkThemeContext.Provider>
  );
}

export function useAdminWorkThemeContext() {
  return useContext(AdminWorkThemeContext);
}
