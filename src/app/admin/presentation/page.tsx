import s from "@/components/admin/admin.module.css";
import React from "react";
import TextAreaForm from "@/components/admin/text/textAreaForm.tsx";
import ImagesForm from "@/components/admin/common/image/imagesForm";

import { LABEL } from "@/db/schema.ts";
import {
  getPresentationContent,
  updateContent,
} from "@/app/admin/contentAction.ts";

export default async function Presentation() {
  const contents = await getPresentationContent();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page Présentation</h1>
      <ImagesForm
        label={LABEL.PRESENTATION}
        images={contents.image ? [contents.image] : []}
        isMultiple={false}
        acceptSmallImage={true}
        title="Image de présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        dbKey={LABEL.PRESENTATION}
        text={contents.text.get(LABEL.PRESENTATION) ?? ""}
        updateAction={updateContent}
        title="Présentation (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        dbKey={LABEL.DEMARCHE}
        text={contents.text.get(LABEL.DEMARCHE) ?? ""}
        updateAction={updateContent}
        title="Démarche artistique (facultatif)"
      />
      <div className="separate" />
      <TextAreaForm
        dbKey={LABEL.INSPIRATION}
        text={contents.text.get(LABEL.INSPIRATION) ?? ""}
        updateAction={updateContent}
        title="Inspiration (facultatif)"
      />
    </div>
  );
}
