import WorkHome from "@/components/work/workHome.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils.ts";
import { KEY_META } from "@/constants/admin.ts";
import { getDrawingCategories, getDrawingYears } from "@/app/dessins/action.ts";
import { TYPE } from "@/db/schema.ts";
import { getMetas } from "@/app/admin/meta/action.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_DRAWING_HOME),
      description: metas.get(KEY_META.DESCRIPTION_DRAWING_HOME),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_DRAWING_HOME),
        description: metas.get(KEY_META.DESCRIPTION_DRAWING_HOME),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page() {
  const categories = await getDrawingCategories();
  const years = await getDrawingYears();

  return (
    <>
      <h1 className="hidden">Les dessins</h1>
      <WorkHome type={TYPE.DRAWING} categories={categories} years={years} />
    </>
  );
}
