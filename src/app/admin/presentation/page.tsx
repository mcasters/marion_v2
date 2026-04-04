import {
  getDemarche,
  getInspiration,
  getPresentation,
  getPresentationImage,
} from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import React from "react";
import TextAreaForm from "@/components/admin/text/textAreaForm.tsx";
import ImagesForm from "@/components/admin/common/image/imagesForm";

import { LABEL } from "@/db/schema.ts";
import {
  getContentPresentation,
  updateContent,
} from "@/app/admin/contentAction.ts";

export default async function Presentation() {
  const contents = await getContentPresentation();

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
        text={getPresentation(contents)}
        dbKey={LABEL.PRESENTATION}
        updateAction={updateContent}
        title="Présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        text={getDemarche(contents)}
        dbKey={LABEL.DEMARCHE}
        updateAction={updateContent}
        title="Démarche artistique (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        text={getInspiration(contents)}
        dbKey={LABEL.INSPIRATION}
        updateAction={updateContent}
        title="Inspiration (facultatif)"
      />
    </div>
  );
}
