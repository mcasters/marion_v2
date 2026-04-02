import s from "@/components/admin/admin.module.css";
import React from "react";
import ItemLayoutForm from "@/components/admin/item/form/itemLayoutForm.tsx";
import WorkManagement from "@/components/admin/item/workManagement.tsx";
import {
  getDrawingAdminCategories,
  getDrawingWorks,
} from "@/app/admin/dessins/action.ts";
import { TYPE } from "@/db/schema.ts";

export default async function Dessins() {
  const type = TYPE.DRAWING;
  const works = await getDrawingWorks();
  const categories = await getDrawingAdminCategories(works);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les dessins</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <ItemLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des dessins ( total : ${works.length} )`}</h2>
      <WorkManagement works={works} categories={categories} type={type} />
    </div>
  );
}
