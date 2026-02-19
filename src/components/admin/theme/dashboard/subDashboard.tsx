"use client";

import React, { Fragment } from "react";
import s from "../adminTheme.module.css";
import { THEME_PAGE_LABEL } from "@/constants/admin";
import ColorSwatch from "@/components/admin/theme/dashboard/colorSwatch";
import { StructTheme, ThemePage } from "@/lib/type";

interface Props {
  structuredTheme: StructTheme;
  themeKey: keyof StructTheme;
}

export default function SubDashboard({ structuredTheme, themeKey }: Props) {
  if (themeKey === "general") {
    return Object.entries(structuredTheme[themeKey]).map(
      ([targetKey, value], i) =>
        value !== "" ? (
          <ColorSwatch
            key={i}
            themeKey={themeKey}
            pageKey={null}
            targetKey={targetKey}
          />
        ) : undefined,
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
                  themeKey={themeKey}
                  pageKey={pageKey}
                  targetKey={targetKey}
                />
              )}
            </Fragment>
          ))}
        </div>
      ),
    );
}
