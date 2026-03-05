import s from "@/components/admin/admin.module.css";
import React from "react";
import { Type } from "@/lib/type";
import ItemLayoutForm from "@/components/admin/item/form/itemLayoutForm.tsx";
import {
  getAdminCategories,
  getAdminWorks,
} from "@/app/actions/item-post/admin.ts";
import WorkManagement from "@/components/admin/item/workManagement.tsx";

export default async function Sculptures() {
  const type = Type.SCULPTURE;
  const categories = await getAdminCategories(type);
  const works = await getAdminWorks(type);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les sculptures</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <ItemLayoutForm type={type} />
      <div className="separate" />
      <WorkManagement works={works} categories={categories} />
    </div>
  );
}
