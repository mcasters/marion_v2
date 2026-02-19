"use client";
import { createContext, ReactNode, useContext } from "react";
import { StructTheme } from "@/lib/type";

const ThemeContext = createContext<StructTheme>({} as StructTheme);

interface Props {
  theme: StructTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme, children }: Props) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
