"use client";

import s from "@/components/admin/admin.module.css";
import React from "react";
import { AdminCategory, AdminWork, Type } from "@/lib/type.ts";
import AddButton from "@/components/admin/common/button/addButton.tsx";
import {
  getEmptyCategory,
  getEmptyWork,
  getThumbnailSrc,
} from "@/lib/utils/commonUtils.ts";
import SelectableList from "@/components/admin/common/selectableList/selectableList.tsx";
import SelectableListRow from "@/components/admin/common/selectableList/selectableListRow.tsx";
import { deleteCategory } from "@/app/actions/item-post/categories/admin.ts";
import CategoryForm from "@/components/admin/item/form/categoryForm.tsx";
import FilterWorkListComponent from "@/components/admin/common/selectableList/filterWorkListComponent.tsx";
import { deleteItem } from "@/app/actions/item-post/admin.ts";
import WorkForm from "@/components/admin/item/form/workForm.tsx";

interface Props {
  works: AdminWork[];
  categories: AdminCategory[];
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
}
export default function WorkManagement({ works, categories, type }: Props) {
  return (
    <>
      <SelectableList
        items={works}
        renderItem={(work) => (
          <SelectableListRow
            part1={work.title}
            part2={
              categories.find((category) => category.id === work.categoryId)
                ?.value || " "
            }
            part3={new Date(work.date).getFullYear().toString()}
            part4={work.isOut ? "sortie" : "Non sortie"}
            imageSrc={getThumbnailSrc(work)}
            deleteAction={() => deleteItem(work.id, work.type)}
          />
        )}
        renderFilter={(getFilteredItems) => (
          <FilterWorkListComponent
            works={works}
            categories={categories}
            onFilter={getFilteredItems}
            type={type}
          />
        )}
        updateForm={(work, handleClose) => (
          <WorkForm work={work} categories={categories} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <WorkForm
            work={getEmptyWork(type)}
            categories={categories}
            onClose={toggle}
          />
        )}
      />
      <div className="separate" />
      <h2 className={s.title2}>Gestion des catégories</h2>
      <SelectableList
        items={categories}
        renderItem={(category) => (
          <SelectableListRow
            part1={category.value}
            part2={`${category.count} ${category.workType}(s)`}
            imageSrc={getThumbnailSrc(category)}
            deleteAction={
              !category.modifiable || category.count > 0
                ? undefined
                : () => deleteCategory(category.id, type)
            }
          />
        )}
        updateForm={(category, handleClose) => (
          <CategoryForm category={category} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <CategoryForm category={getEmptyCategory(type)} onClose={toggle} />
        )}
      />
    </>
  );
}
