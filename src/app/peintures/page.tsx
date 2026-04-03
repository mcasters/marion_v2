import WorkHome from "@/components/work/workHome.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils.ts";
import { KEY_META } from "@/constants/admin.ts";
import {
  getPaintingCategories,
  getPaintingYears,
} from "@/app/peintures/action.ts";
import { TYPE } from "@/db/schema.ts";
import { getMetas } from "@/app/admin/meta/action.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_PAINTING_HOME),
      description: metas.get(KEY_META.DESCRIPTION_PAINTING_HOME),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_PAINTING_HOME),
        description: metas.get(KEY_META.DESCRIPTION_PAINTING_HOME),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page() {
  const categories = await getPaintingCategories();
  const years = await getPaintingYears();

  return (
    <>
      <h1 className="hidden">Les peintures</h1>
      <WorkHome type={TYPE.PAINTING} categories={categories} years={years} />
    </>
  );
}
