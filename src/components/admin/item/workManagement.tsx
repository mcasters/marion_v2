"use client";

import s from "@/components/admin/admin.module.css";
import React from "react";
import { AdminCategory, AdminWork, Type } from "@/lib/type.ts";
import AddButton from "@/components/admin/common/button/addButton.tsx";
import {
  getEmptyCategory,
  getEmptyWork,
  getImageSrc,
} from "@/lib/utils/commonUtils.ts";
import { MESSAGE } from "@/constants/admin.ts";
import { deleteItem } from "@/app/actions/item-post/admin.ts";
import SelectableList from "@/components/admin/common/selectableList/selectableList.tsx";
import RowComponent from "@/components/admin/common/selectableList/rowComponent.tsx";
import FilterWorkListComponent from "@/components/admin/common/selectableList/filterWorkListComponent.tsx";
import { deleteCategory } from "@/app/actions/item-post/categories/admin.ts";
import WorkForm from "@/components/admin/item/form/workForm.tsx";
import CategoryForm from "@/components/admin/item/form/categoryForm.tsx";

interface Props {
  works: AdminWork[];
  categories: AdminCategory[];
}
export default function WorkManagement({ works, categories }: Props) {
  const type = works[0].type;

  return (
    <>
      <h2
        className={s.title2}
      >{`Gestion des ${type}s ( total : ${works.length} )`}</h2>
      <SelectableList
        items={works}
        renderItem={(work) => (
          <RowComponent
            item={work}
            part1={work.title}
            part2={
              categories.find((category) => category.id === work.categoryId)
                ?.value || " "
            }
            part3={new Date(work.date).getFullYear().toString()}
            part4={work.isOut ? "sortie" : ""}
            imageSrc={getImageSrc(work)}
            deleteAction={() => deleteItem(work.id, type)}
          />
        )}
        renderFilter={(handleFilter) => (
          <FilterWorkListComponent
            items={works}
            categories={categories}
            onFilter={handleFilter}
          />
        )}
        updateForm={(work, handleCloseAction) => (
          <WorkForm
            work={work}
            categories={categories}
            onClose={handleCloseAction}
          />
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
          <RowComponent
            item={category}
            part1={category.value}
            part2={`${category.count} ${category.workType}(s)`}
            imageSrc={getImageSrc(category)}
            deleteAction={() => deleteCategory(category.id, Type.PAINTING)}
          />
        )}
        updateForm={(category, handleClose) => (
          <CategoryForm category={category} onClose={handleClose} />
        )}
      />
      <h5>{MESSAGE.category}</h5>
      <AddButton
        renderForm={(toggle) => (
          <CategoryForm category={getEmptyCategory(type)} onClose={toggle} />
        )}
      />
    </>
  );
}
