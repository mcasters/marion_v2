import s from "@/components/admin/admin.module.css";
import React from "react";
import TextAreaForm from "@/components/admin/text/textAreaForm.tsx";
import HomeLayoutForm from "@/components/admin/home/homeLayoutForm.tsx";
import ImagesForm from "@/components/admin/common/image/imagesForm.tsx";
import { LABEL } from "@/db/schema.ts";
import {
  getHomeImages,
  getHomeText,
  updateContent,
} from "@/app/admin/contentAction.ts";

export default async function Home() {
  const text = await getHomeText();
  const images = await getHomeImages();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>{`Contenus de la page Home`}</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <HomeLayoutForm />
      <div className="separate" />
      <h2 className={s.title2}>{`Texte d'accueil (facultatif)`}</h2>
      <TextAreaForm
        dbKey={LABEL.INTRO}
        text={text ?? ""}
        updateAction={updateContent}
      />
      <div className="separate" />
      <h2
        className={s.title2WithInfo}
      >{`Images affichées sur écran mobile`}</h2>
      <p>
        {`(Une ou plusieurs images possible. Format portrait mieux adapté)`}
      </p>
      <ImagesForm
        images={images.filter((i) => i.isMain)}
        isMultiple={true}
        label={LABEL.SLIDER}
        acceptSmallImage={false}
        isMain={true}
      />
      <div className="separate" />
      <h2
        className={s.title2WithInfo}
      >{`Images affichées sur écran ordinateur`}</h2>
      <p>
        {`(Une ou plusieurs images possible. Format paysage ou carré mieux adapté)`}
      </p>
      <ImagesForm
        images={images.filter((i) => !i.isMain)}
        isMultiple={true}
        label={LABEL.SLIDER}
        acceptSmallImage={false}
        isMain={false}
      />
    </div>
  );
}
