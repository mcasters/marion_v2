import s from "@/components/admin/admin.module.css";
import React from "react";
import WorkLayoutForm from "@/components/admin/item/form/workLayoutForm.tsx";
import WorkManagement from "@/components/admin/item/workManagement.tsx";
import {
  getAdminSculptureCategories,
  getSculptureWorks,
} from "@/app/admin/sculptures/action.ts";
import { TYPE } from "@/db/schema.ts";

export default async function Sculptures() {
  const type = TYPE.SCULPTURE;
  const works = await getSculptureWorks();
  const categories = await getAdminSculptureCategories(works);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les sculptures</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <WorkLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des sculptures ( total : ${works.length} )`}</h2>
      <WorkManagement works={works} categories={categories} type={type} />
    </div>
  );
}
