import { getIntroText } from "@/lib/utils/commonUtils";
import { Label } from "@@/prisma/generated/client";
import s from "@/components/admin/admin.module.css";
import React from "react";
import TextAreaForm from "@/components/admin/form/content/textAreaForm";
import { getContentsFull } from "@/app/actions/contents";
import {
  getSliderLandscapeImages,
  getSliderPortraitImages,
} from "@/lib/utils/imageUtils";
import HomeLayoutForm from "@/components/admin/form/home/homeLayoutForm";
import ImagesForm from "@/components/admin/form/image/imagesForm.tsx";

export default async function Home() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>{`Contenus de la page Home`}</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <HomeLayoutForm />
      <div className="separate" />
      <h2 className={s.title2}>{`Texte d'accueil (facultatif)`}</h2>
      <TextAreaForm textContent={getIntroText(contents)} label={Label.INTRO} />
      <div className="separate" />
      <h2 className={s.title2}>{`Images affichées sur écran mobile`}</h2>
      <ImagesForm
        images={getSliderPortraitImages(contents)}
        isMultiple={true}
        label={Label.SLIDER}
        acceptSmallImage={false}
        title={`Une ou plusieurs images possible. Format portrait mieux adapté`}
        isMain={true}
      />
      <div className="separate" />
      <h2 className={s.title2}>{`Images affichées sur écran ordinateur`}</h2>
      <ImagesForm
        images={getSliderLandscapeImages(contents)}
        isMultiple={true}
        label={Label.SLIDER}
        acceptSmallImage={false}
        title={`Une ou plusieurs images possible. Format paysage ou carré mieux adapté`}
        isMain={false}
      />
    </div>
  );
}
