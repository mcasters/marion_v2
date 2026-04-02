import ItemHome from "@/components/item/itemHome.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils.ts";
import { getMetas } from "@/app/actions/meta";
import { KEY_META } from "@/constants/admin.ts";
import {
  getSculptureCategories,
  getSculptureYears,
} from "@/app/sculptures/action.ts";
import { TYPE } from "@/db/schema.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_SCULPTURE_HOME),
      description: metas.get(KEY_META.DESCRIPTION_SCULPTURE_HOME),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_SCULPTURE_HOME),
        description: metas.get(KEY_META.DESCRIPTION_SCULPTURE_HOME),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page() {
  const categories = await getSculptureCategories();
  const years = await getSculptureYears();

  return (
    <>
      <h1 className="hidden">Les sculptures</h1>
      <ItemHome type={TYPE.SCULPTURE} categories={categories} years={years} />
    </>
  );
}
