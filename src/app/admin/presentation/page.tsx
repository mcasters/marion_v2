import {
  getDemarche,
  getInspiration,
  getPresentation,
  getPresentationImage,
} from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import React from "react";
import TextAreaForm from "@/components/admin/content/textAreaForm.tsx";
import ImagesForm from "@/components/admin/common/image/imagesForm";
import { getContentsFull } from "@/app/actions/contents";

import { LABEL } from "@/constants/admin.ts";

export default async function Presentation() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page Présentation</h1>
      <ImagesForm
        images={getPresentationImage(contents)}
        isMultiple={false}
        label={LABEL.PRESENTATION}
        acceptSmallImage={true}
        title="Image de présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getPresentation(contents)}
        label={LABEL.PRESENTATION}
        title="Présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getDemarche(contents)}
        label={LABEL.DEMARCHE}
        title="Démarche artistique (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getInspiration(contents)}
        label={LABEL.INSPIRATION}
        title="Inspiration (facultatif)"
      />
    </div>
  );
}
