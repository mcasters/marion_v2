"use client";

import React from "react";
import themeStyle from "./adminTheme.module.css";
import ThemeAdd from "@/components/admin/theme/themeAdd";
import Dashboard from "@/components/admin/theme/dashboard/dashboard";
import ThemeUpdate from "@/components/admin/theme/themeUpdate";
import s from "@/components/admin/admin.module.css";
import PresetColorDashboard from "@/components/admin/theme/dashboard/presetColor/presetColorDashboard";
import ThemeCancel from "@/components/admin/theme/themeCancel";
import ThemeActivate from "@/components/admin/theme/themeActivate";
import ThemeDelete from "@/components/admin/theme/themeDelete";
import ThemeSelect from "@/components/admin/theme/ThemeSelect";

export default function AdminTheme() {
  return (
    <>
      <h3 className={s.title3}>Thèmes :</h3>
      <ThemeSelect />
      <ThemeActivate />
      <ThemeDelete />
      <div className="smallSeparate" />
      <h3 className={s.title3}>Détail du thème sélectionné :</h3>
      <Dashboard />
      <div className={themeStyle.actionContainer}>
        <ThemeAdd />
        <ThemeUpdate />
        <ThemeCancel />
      </div>
      <div className="smallSeparate" />
      <h3 className={s.title3}>Couleurs mémorisées</h3>
      <PresetColorDashboard />
    </>
  );
}
