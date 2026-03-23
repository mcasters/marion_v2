"use client";

import React, { Fragment } from "react";
import s from "../adminTheme.module.css";
import {
  THEME_GEN_TARGET_LABEL,
  THEME_LABEL,
  THEME_PAGE_LABEL,
  THEME_TARGET_LABEL,
} from "@/constants/admin";
import ColorSwatch from "@/components/admin/theme/dashboard/colorSwatch";
import {
  StructTheme,
  ThemeGenTarget,
  ThemePage,
  ThemeTarget,
} from "@/lib/type";

interface Props {
  structuredTheme: StructTheme;
  themeKey: keyof StructTheme;
}

export default function SubDashboard({ structuredTheme, themeKey }: Props) {
  if (themeKey === "general") {
    return Object.entries(structuredTheme[themeKey]).map(
      ([targetKey, value], i) => {
        return value !== "" ? (
          <ColorSwatch
            key={i}
            dbKey={`${themeKey}_${targetKey}`}
            fullLabel={`${THEME_LABEL[themeKey as keyof StructTheme]} | ${THEME_GEN_TARGET_LABEL[targetKey as keyof ThemeGenTarget]}`}
          />
        ) : undefined;
      },
    );
  } else
    return Object.entries(structuredTheme[themeKey]).map(
      ([pageKey, content], i) => (
        <div key={i} className={s.subSection}>
          {Object.entries(content).map(([targetKey, value], ii) => (
            <Fragment key={ii}>
              {ii === 0 && (
                <h5 className={s.subTitle}>
                  {THEME_PAGE_LABEL[pageKey as keyof ThemePage]} :
                </h5>
              )}
              {value !== "" && (
                <ColorSwatch
                  dbKey={`${themeKey}_${pageKey}_${targetKey}`}
                  fullLabel={`${THEME_LABEL[themeKey as keyof StructTheme]} | ${THEME_PAGE_LABEL[pageKey as keyof ThemePage]} | ${THEME_TARGET_LABEL[targetKey as keyof ThemeTarget]}`}
                />
              )}
            </Fragment>
          ))}
        </div>
      ),
    );
}
