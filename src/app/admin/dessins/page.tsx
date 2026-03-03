import { Type } from "@/lib/type";
import s from "@/components/admin/admin.module.css";
import React from "react";
import ItemLayoutForm from "@/components/admin/form/item/itemLayoutForm.tsx";
import AddButton from "@/components/admin/form/addButton.tsx";
import {
  getEmptyWork,
  getEnhancedCategories,
  getEnhancedCategory,
} from "@/lib/utils/commonUtils.ts";
import ListComponent from "@/components/admin/form/item/listComponent.tsx";
import { MESSAGE } from "@/constants/admin.ts";
import {
  getAdminCategories,
  getAdminWorks,
} from "@/app/actions/item-post/admin.ts";

export default async function Dessins() {
  const type = Type.DRAWING;
  const categories = await getAdminCategories(type);
  const works = await getAdminWorks(type);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les dessins</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <ItemLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des dessins ( total : ${works.length} )`}</h2>
      <ListComponent items={works} categories={categories} />
      <AddButton item={getEmptyWork(type)} categories={categories} />
      <div className="separate" />
      <h2 className={s.title2}>Gestion des catégories</h2>
      <ListComponent items={getEnhancedCategories(works)} />
      <h5>{MESSAGE.category}</h5>
      <AddButton item={getEnhancedCategory(type)} />
    </div>
  );
}
