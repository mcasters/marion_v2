import {
  getDemarche,
  getInspiration,
  getMetaMap,
  getPresentation,
} from "@/lib/utils/commonUtils";
import { Metadata } from "next";
import { KEY_META } from "@/constants/admin.ts";
import FormattedPhoto from "@/components/image/formattedPhoto.tsx";
import s from "@/styles/page.module.css";
import { getMetas } from "@/app/admin/meta/action.ts";
import { getContentPresentation } from "@/app/admin/contentAction.ts";
import { LABEL } from "@/db/schema.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_PRESENTATION),
      description: metas.get(KEY_META.DESCRIPTION_PRESENTATION),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_PRESENTATION),
        description: metas.get(KEY_META.DESCRIPTION_PRESENTATION),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Presentation() {
  const contents = await getContentPresentation();
  const demarche = getDemarche(contents);
  const inspiration = getInspiration(contents);
  const images =
    contents?.filter((c) => c.label === LABEL.PRESENTATION)[0]?.images || [];

  return (
    <div className={`${s.limitedWidth} preLine`}>
      <h1 className="hidden">Présentation</h1>
      <FormattedPhoto
        folder="miscellaneous"
        filename={images[0].filename}
        width={images[0].width}
        height={images[0].height}
        alt={`Photo de ${process.env.TITLE}`}
        priority
        displayWidth={{ small: 80, large: 35 }}
        displayHeight={{ small: 40, large: 40 }}
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
