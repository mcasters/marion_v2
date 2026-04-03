import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import WorkPage from "@/components/work/workPage.tsx";
import { KEY_META } from "@/constants/admin";
import { TYPE } from "@/db/schema.ts";
import {
  getPaintingCategory,
  getPaintingWorksByCategory,
} from "@/app/peintures/action.ts";
import { getMetas } from "@/app/admin/meta/action.ts";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const categoryKey = (await params).category;
  const metas = getMetaMap(await getMetas());
  const category = await getPaintingCategory(categoryKey);

  if (metas && category) {
    const text =
      category.value === "Sans catégorie"
        ? category.value
        : `Série ${category.value}`;
    return {
      title: `${metas.get(KEY_META.DOCUMENT_TITLE_PAINTING)} - ${text}`,
      description: `${metas.get(KEY_META.DESCRIPTION_PAINTING)} - ${text}`,
      openGraph: {
        title: `${metas.get(KEY_META.DOCUMENT_TITLE_PAINTING)} - ${text}`,
        description: `${metas.get(KEY_META.DESCRIPTION_PAINTING)} - ${text}`,
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
  const { category, works } = await getPaintingWorksByCategory(categoryKey);

  return (
    <>
      {category && (
        <WorkPage
          tag={category.value}
          category={category}
          works={works}
          type={TYPE.PAINTING}
        />
      )}
    </>
  );
}
