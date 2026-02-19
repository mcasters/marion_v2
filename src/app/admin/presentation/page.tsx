import {
  getDemarche,
  getInspiration,
  getPresentation,
  getPresentationImage,
} from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import { Label } from "@@/prisma/generated/client";
import React from "react";
import TextAreaForm from "@/components/admin/form/content/textAreaForm";
import ImagesForm from "@/components/admin/form/image/imagesForm";
import { getContentsFull } from "@/app/actions/contents";

export default async function Presentation() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page Présentation</h1>
      <ImagesForm
        images={getPresentationImage(contents)}
        isMultiple={false}
        label={Label.PRESENTATION}
        acceptSmallImage={true}
        title="Image de présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getPresentation(contents)}
        label={Label.PRESENTATION}
        textLabel="Présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getDemarche(contents)}
        label={Label.DEMARCHE}
        textLabel="Démarche artistique (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getInspiration(contents)}
        label={Label.INSPIRATION}
        textLabel="Inspiration (facultatif)"
      />
    </div>
  );
}
