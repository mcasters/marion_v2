"use client";

import s from "@/components/admin/admin.module.css";
import React from "react";
import { AdminCategory, Work } from "@/lib/type.ts";
import AddButton from "@/components/admin/common/button/addButton.tsx";
import {
  getEmptyAdminCategory,
  getEmptyWork,
  getThumbnailSrc,
} from "@/lib/utils/commonUtils.ts";
import {
  getDeleteAction,
  getDeleteCategoryAction,
} from "@/lib/utils/actionUtils.ts";
import SelectableList from "@/components/admin/common/selectableList/selectableList.tsx";
import SelectableListRow from "@/components/admin/common/selectableList/selectableListRow.tsx";
import CategoryForm from "@/components/admin/item/form/categoryForm.tsx";
import FilterWorkListComponent from "@/components/admin/common/selectableList/filterWorkListComponent.tsx";
import WorkForm from "@/components/admin/item/form/workForm.tsx";
import { TYPE } from "@/db/schema.ts";

interface Props {
  works: Work[];
  categories: AdminCategory[];
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
}
export default function WorkManagement({ works, categories, type }: Props) {
  const deleteAction = getDeleteAction(type);
  const deleteCategoryAction = getDeleteCategoryAction(type);
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
            deleteAction={() => deleteAction(work.id)}
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
        formToRender={(work, handleClose) => (
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
        modalWidth={900}
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
              category.id === 0 || category.count > 0
                ? undefined
                : () => deleteCategoryAction(category.id)
            }
          />
        )}
        formToRender={(category, handleClose) => (
          <CategoryForm adminCategory={category} onClose={handleClose} />
        )}
      />
      <AddButton
        renderForm={(toggle) => (
          <CategoryForm
            adminCategory={getEmptyAdminCategory(type)}
            onClose={toggle}
          />
        )}
        modalWidth={700}
      />
    </>
  );
}
