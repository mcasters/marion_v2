"use server";

import s from "@/components/admin/admin.module.css";
import React from "react";
import WorkLayoutForm from "@/components/admin/item/form/workLayoutForm.tsx";
import WorkManagement from "@/components/admin/item/workManagement.tsx";
import {
  getPaintingAdminCategories,
  getPaintingWorks,
} from "@/app/admin/peintures/action.ts";
import { TYPE } from "@/db/schema.ts";

export default async function Peintures() {
  const type = TYPE.PAINTING;
  const works = await getPaintingWorks();
  const categories = await getPaintingAdminCategories(works);

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Les peintures</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <WorkLayoutForm type={type} />
      <div className="separate" />
      <h2
        className={s.title2}
      >{`Gestion des peintures ( total : ${works.length} )`}</h2>
      <WorkManagement works={works} categories={categories} type={type} />
    </div>
  );
}
