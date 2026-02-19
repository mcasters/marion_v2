import {
  getDemarche,
  getInspiration,
  getMetaMap,
  getPresentation,
  getPresentationImage,
} from "@/lib/utils/commonUtils";
import { getContentsFull } from "@/app/actions/contents";
import { Metadata } from "next";
import { getMetas } from "@/app/actions/meta";
import { META } from "@/constants/admin.ts";
import FormattedPhoto from "@/components/image/formattedPhoto.tsx";
import { getPhotoTabFromImages } from "@/lib/utils/imageUtils.ts";
import s from "@/styles/page.module.css";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(META.DOCUMENT_TITLE_PRESENTATION),
      description: metas.get(META.DESCRIPTION_PRESENTATION),
      openGraph: {
        title: metas.get(META.DOCUMENT_TITLE_PRESENTATION),
        description: metas.get(META.DESCRIPTION_PRESENTATION),
        url: metas.get(META.URL),
        siteName: metas.get(META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Presentation() {
  const contents = await getContentsFull();
  const demarche = getDemarche(contents);
  const inspiration = getInspiration(contents);

  return (
    <div className={`${s.limitedWidth} preLine`}>
      <h1 className="hidden">Présentation</h1>
      <FormattedPhoto
        photoTab={getPhotoTabFromImages(
          getPresentationImage(contents),
          "miscellaneous",
          `Photo de ${process.env.TITLE}`,
        )}
        priority
        width={{ small: 80, large: 35 }}
        height={{ small: 40, large: 40 }}
      />
      <section className={s.section}>
        <p>{getPresentation(contents)}</p>
      </section>
      {demarche !== "" && (
        <section className={s.section}>
          <h2>Démarche artistique</h2>
          <p>{demarche}</p>
        </section>
      )}
      {inspiration !== "" && (
        <section className={s.section}>
          <h2>Inspirations</h2>
          <p>{inspiration}</p>
        </section>
      )}
    </div>
  );
}
