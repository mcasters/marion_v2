"use client";

import { PresetColor } from "@@/prisma/generated/client";
import { useAdminWorkThemeContext } from "@/app/context/adminWorkThemeProvider";
import PresetColorSwatch from "@/components/admin/theme/dashboard/presetColor/presetColorSwatch";
import DragList from "@/components/admin/form/dragList/dragList.tsx";
import s from "@/components/admin/theme/adminTheme.module.css";
import { updatePresetColorsOrder } from "@/app/actions/theme/admin.ts";
import { useAlert } from "@/app/context/alertProvider.tsx";
import { DragListElement } from "@/lib/type.ts";

export default function PresetColorDashboard() {
  const { themes, presetColors, setPresetColors } = useAdminWorkThemeContext();
  const alert = useAlert();

  const presetColorCountUse = (presetColor: PresetColor): number => {
    let count = 0;
    themes.forEach((theme) => {
      Object.entries(theme).forEach(([key, value]) => {
        if (key.includes("_") && value === presetColor.name) {
          count += 1;
        }
      });
    });
    return count;
  };

  const handleChangeOrder = async (map: Map<number, number>) => {
    const { message, isError, updatedPresetColors } =
      await updatePresetColorsOrder(map);
    if (isError) alert(message, isError);
    else if (updatedPresetColors) setPresetColors(updatedPresetColors);
  };

  return (
    <section className={s.presetColorDashboard}>
      <DragList
        list={presetColors.map(
          (p: PresetColor) =>
            ({
              id: p.id,
              element: (
                <PresetColorSwatch
                  presetColor={p}
                  count={presetColorCountUse(p)}
                />
              ),
              order: p.displayOrder,
            }) as DragListElement,
        )}
        onChangeOrder={handleChangeOrder}
      />
    </section>
  );
}
