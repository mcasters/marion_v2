"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import s from "@/components/admin/admin.module.css";
import { AdminWork, Category, Filter } from "@/lib/type.ts";
import { filterWorks, getYearsFromWorks } from "@/lib/utils/commonUtils.ts";

interface Props {
  items: AdminWork[];
  categories: Category[];
  onFilter: Dispatch<SetStateAction<AdminWork[]>>;
}
export default function FilterWorkListComponent({
  items,
  categories,
  onFilter,
}: Props) {
  const years = useMemo(() => getYearsFromWorks(items), [items]);
  const [numberFilter, setNumberFilter] = useState(items.length);
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

    const filteredWorks = filterWorks(items, _filter);
    onFilter(filteredWorks);
    setNumberFilter(filteredWorks.length);
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
      <br />
      <h4>{`Filtre : ${numberFilter} ${items[0].type}s`}</h4>
    </div>
  );
}
