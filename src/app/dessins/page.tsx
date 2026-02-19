import { Type } from "@/lib/type";
import { getCategories, getYears } from "@/app/actions/item-post";
import ItemHome from "@/components/item/itemHome.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils.ts";
import { getMetas } from "@/app/actions/meta";
import { META } from "@/constants/admin.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(META.DOCUMENT_TITLE_DRAWING_HOME),
      description: metas.get(META.DESCRIPTION_DRAWING_HOME),
      openGraph: {
        title: metas.get(META.DOCUMENT_TITLE_DRAWING_HOME),
        description: metas.get(META.DESCRIPTION_DRAWING_HOME),
        url: metas.get(META.URL),
        siteName: metas.get(META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page() {
  const type = Type.DRAWING;
  const categories = await getCategories(type);
  const years = await getYears(type);

  return (
    <>
      <h1 className="hidden">Les dessins</h1>
      <ItemHome type={type} categories={categories} years={years} />
    </>
  );
}
