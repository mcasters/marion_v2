import s from "@/components/admin/admin.module.css";
import React from "react";
import { Type } from "@/lib/type";
import { getAdminCategories, getAdminWorks } from "@/app/actions/item-post";
import ItemLayoutForm from "@/components/admin/form/item/itemLayoutForm.tsx";
import AddButton from "@/components/admin/form/addButton.tsx";
import {
  getCategoriesFull,
  getEmptyCategoryFull,
  getEmptyWork,
  worksIsEmpty,
} from "@/lib/utils/commonUtils.ts";
import ListComponent from "@/components/admin/form/item/listComponent.tsx";
import { MESSAGE } from "@/constants/admin.ts";

export default async function Peintures() {
  const type = Type.PAINTING;
  const categories = await getAdminCategories(type);
  const items = await getAdminWorks(type);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les peintures</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <ItemLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des peintures ( total : ${worksIsEmpty(items) ? "0" : items.length} )`}</h2>
      <ListComponent items={items} categories={categories} />
      <AddButton item={getEmptyWork(type)} categories={categories} />
      <div className="separate" />
      <h2 className={s.title2}>Gestion des catégories</h2>
      <ListComponent items={getCategoriesFull(categories, items)} />
      <h5>{MESSAGE.category}</h5>
      <AddButton item={getEmptyCategoryFull(type)} />
    </div>
  );
}
