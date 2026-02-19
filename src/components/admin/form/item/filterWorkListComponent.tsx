"use client";

import React, { useEffect, useMemo, useState } from "react";
import s from "@/components/admin/admin.module.css";
import { Category, Filter, Work } from "@/lib/type.ts";
import { filterWorks, getYearsFromWorks } from "@/lib/utils/commonUtils.ts";

interface Props {
  items: Work[];
  categories: Category[];
  onFilteredItems: (items: Work[]) => void;
}
export default function FilterWorkListComponent({
  items,
  categories,
  onFilteredItems,
}: Props) {
  const years = useMemo(() => getYearsFromWorks(items), [items]);
  const [filter, setFilter] = useState({
    categoryFilter: -1,
    yearFilter: -1,
    isOutFilter: -1,
  });

  useEffect(() => {
    const categoryDeleted = !categories.find(
      (category) => category.id === filter.categoryFilter,
    );
    if (categoryDeleted) handleChange("categoryFilter", -1);
  }, [categories]);

  useEffect(() => {
    const yearDeleted = !years.includes(filter.yearFilter);
    if (yearDeleted) handleChange("yearFilter", -1);
  }, [years]);

  const handleChange = (filterName: keyof Filter, value: number) => {
    const _filter = { ...filter, [filterName]: value };
    setFilter(_filter);
    onFilteredItems(filterWorks(items, _filter));
  };

  return (
    <div className={s.filterContainer}>
      <label className={s.filter}>
        Filtre par catégorie
        <select
          name="categoryFilter"
          value={filter.categoryFilter}
          onChange={(e) =>
            handleChange(e.target.name as keyof Filter, Number(e.target.value))
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
            handleChange(e.target.name as keyof Filter, Number(e.target.value))
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
            handleChange(e.target.name as keyof Filter, Number(e.target.value))
          }
        >
          <option value={-1}>-- Pas de filtre --</option>
          <option value={0}>Non sortie</option>
          <option value={1}>Sortie</option>
        </select>
      </label>
    </div>
  );
}
