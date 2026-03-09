"use client";

import React, { useEffect, useMemo, useState } from "react";
import s from "@/components/admin/admin.module.css";
import { AdminCategory, AdminWork, Type } from "@/lib/type.ts";
import { filterWorks, getYearsFromWorks } from "@/lib/utils/commonUtils.ts";

interface Props {
  works: AdminWork[];
  categories: AdminCategory[];
  onFilter: (filteredItems: AdminWork[]) => void;
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
}
export default function FilterWorkListComponent({
  works,
  categories,
  onFilter,
  type,
}: Props) {
  const years = useMemo(() => getYearsFromWorks(works), [works]);
  const [count, setCount] = useState(works.length);
  const [filter, setFilter] = useState({
    categoryFilter: -1,
    yearFilter: -1,
    isOutFilter: -1,
  });

  useEffect(() => {
    const filteredWorks = filterWorks(works, filter);
    onFilter(filteredWorks);
    setCount(filteredWorks.length);
  }, [works, filter]);

  useEffect(() => {
    if (filter.categoryFilter !== -1) {
      const categoryDeleted = !categories.find(
        (category) => category.id === filter.categoryFilter,
      );
      if (categoryDeleted) setFilter({ ...filter, ["categoryFilter"]: -1 });
    }
  }, [categories]);

  useEffect(() => {
    if (filter.yearFilter !== -1) {
      const yearDeleted = !years.includes(filter.yearFilter);
      if (yearDeleted) setFilter({ ...filter, ["yearFilter"]: -1 });
    }
  }, [years]);

  return (
    <>
      <div className={s.filterContainer}>
        <label className={s.filter}>
          Filtre par catégorie
          <select
            name="categoryFilter"
            value={filter.categoryFilter}
            onChange={(e) =>
              setFilter({ ...filter, [e.target.name]: Number(e.target.value) })
            }
          >
            <option value={-1}>-- Pas de filtre --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.value}
              </option>
            ))}
          </select>
        </label>
        <label className={s.filter}>
          Filtre par année
          <select
            name="yearFilter"
            value={filter.yearFilter}
            onChange={(e) =>
              setFilter({ ...filter, [e.target.name]: Number(e.target.value) })
            }
          >
            <option value={-1}>-- Pas de filtre --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className={s.filter}>
          Filtre par sortie
          <select
            name="isOutFilter"
            value={filter.isOutFilter}
            onChange={(e) =>
              setFilter({ ...filter, [e.target.name]: Number(e.target.value) })
            }
          >
            <option value={-1}>-- Pas de filtre --</option>
            <option value={0}>Non sortie</option>
            <option value={1}>Sortie</option>
          </select>
        </label>
      </div>
      <h4>{`Filtre : ${count} ${type}s`}</h4>
    </>
  );
}
