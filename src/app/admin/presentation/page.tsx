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
import { getContentsFull } from "@/app/actions/contents";

import { KEY_LABEL } from "@/constants/admin.ts";
import { updateContent } from "@/app/actions/contents/admin.ts";

export default async function Presentation() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page Présentation</h1>
      <ImagesForm
        images={getPresentationImage(contents)}
        isMultiple={false}
        label={KEY_LABEL.PRESENTATION}
        acceptSmallImage={true}
        title="Image de présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        text={getPresentation(contents)}
        dbKey={KEY_LABEL.PRESENTATION}
        updateAction={updateContent}
        title="Présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        text={getDemarche(contents)}
        dbKey={KEY_LABEL.DEMARCHE}
        updateAction={updateContent}
        title="Démarche artistique (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        text={getInspiration(contents)}
        dbKey={KEY_LABEL.INSPIRATION}
        updateAction={updateContent}
        title="Inspiration (facultatif)"
      />
    </div>
  );
}
