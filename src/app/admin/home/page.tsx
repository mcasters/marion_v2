import { getIntroText } from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import React from "react";
import TextAreaForm from "@/components/admin/content/textAreaForm.tsx";
import { getContentsFull } from "@/app/actions/contents";
import {
  getSliderLandscapeImages,
  getSliderPortraitImages,
} from "@/lib/utils/imageUtils";
import HomeLayoutForm from "@/components/admin/home/homeLayoutForm.tsx";
import ImagesForm from "@/components/admin/common/image/imagesForm.tsx";
import { LABEL } from "@/constants/admin.ts";

export default async function Home() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>{`Contenus de la page Home`}</h1>
      <h2 className={s.title2}>Mise en page</h2>
      <HomeLayoutForm />
      <div className="separate" />
      <h2 className={s.title2}>{`Texte d'accueil (facultatif)`}</h2>
      <TextAreaForm textContent={getIntroText(contents)} label={LABEL.INTRO} />
      <div className="separate" />
      <h2
        className={s.title2WithInfo}
      >{`Images affichées sur écran mobile`}</h2>
      <p>
        {`(Une ou plusieurs images possible. Format portrait mieux adapté)`}
      </p>
      <ImagesForm
        images={getSliderPortraitImages(contents)}
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
        images={getSliderLandscapeImages(contents)}
        isMultiple={true}
        label={LABEL.SLIDER}
        acceptSmallImage={false}
        isMain={false}
      />
    </div>
  );
}
