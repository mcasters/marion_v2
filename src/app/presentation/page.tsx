import { getMetaMap } from "@/lib/utils/commonUtils";
import { Metadata } from "next";
import { KEY_META } from "@/constants/admin.ts";
import FormattedPhoto from "@/components/image/formattedPhoto.tsx";
import s from "@/styles/page.module.css";
import { getMetas } from "@/app/admin/meta/action.ts";
import { getPresentationContent } from "@/app/admin/contentAction.ts";
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
  const contents = await getPresentationContent();
  const image = contents.image;
  const demarche = contents.text.get(LABEL.DEMARCHE);
  const presentation = contents.text.get(LABEL.PRESENTATION);
  const inspiration = contents.text.get(LABEL.INSPIRATION);

  return (
    <div className={`${s.limitedWidth} preLine`}>
      <h1 className="hidden">Présentation</h1>
      {image && (
        <FormattedPhoto
          folder="miscellaneous"
          filename={image.filename}
          width={image.width}
          height={image.height}
          alt={`Photo de ${process.env.TITLE}`}
          priority
          displayWidth={{ small: 80, large: 35 }}
          displayHeight={{ small: 40, large: 40 }}
        />
      )}
      <section className={s.section}>
        <p>{presentation}</p>
      </section>
      {demarche && (
        <section className={s.section}>
          <h2>Démarche artistique</h2>
          <p>{demarche}</p>
        </section>
      )}
      {inspiration && (
        <section className={s.section}>
          <h2>Inspirations</h2>
          <p>{inspiration}</p>
        </section>
      )}
    </div>
  );
}
