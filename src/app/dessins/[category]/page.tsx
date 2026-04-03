import WorkPage from "@/components/work/workPage.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { KEY_META } from "@/constants/admin";
import {
  getDrawingCategory,
  getDrawingWorksByCategory,
} from "@/app/dessins/action.ts";
import { TYPE } from "@/db/schema.ts";
import { getMetas } from "@/app/admin/meta/action.ts";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  const categoryKey = (await params).category;
  const category = await getDrawingCategory(categoryKey);

  if (metas && category) {
    const text =
      category.value === "Sans catégorie"
        ? category.value
        : `Série ${category.value}`;
    return {
      title: `${metas.get(KEY_META.DOCUMENT_TITLE_DRAWING)} - ${text}`,
      description: `${metas.get(KEY_META.DESCRIPTION_DRAWING)} - ${text}`,
      openGraph: {
        title: `${metas.get(KEY_META.DOCUMENT_TITLE_DRAWING)} - ${text}`,
        description: `${metas.get(KEY_META.DESCRIPTION_DRAWING)} - ${text}`,
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page({ params }: Props) {
  const categoryKey = (await params).category;
  const { category, works } = await getDrawingWorksByCategory(categoryKey);

  return (
    <>
      {category && (
        <WorkPage
          tag={category.value}
          category={category}
          works={works}
          type={TYPE.DRAWING}
        />
      )}
    </>
  );
}
