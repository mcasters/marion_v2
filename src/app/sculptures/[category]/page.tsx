import ItemPage from "@/components/item/itemPage.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { getMetas } from "@/app/actions/meta";
import { KEY_META } from "@/constants/admin";
import { TYPE } from "@/db/schema.ts";
import {
  getSculptureCategory,
  getSculptureWorksByCategory,
} from "@/app/sculptures/action.ts";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const categoryKey = (await params).category;
  const metas = getMetaMap(await getMetas());
  const category = await getSculptureCategory(categoryKey);

  if (metas && category) {
    const text =
      category.value === "Sans catégorie"
        ? category.value
        : `Série ${category.value}`;
    return {
      title: `${metas.get(KEY_META.DOCUMENT_TITLE_SCULPTURE)} - ${text}`,
      description: `${metas.get(KEY_META.DESCRIPTION_SCULPTURE)} - ${text}`,
      openGraph: {
        title: `${metas.get(KEY_META.DOCUMENT_TITLE_SCULPTURE)} - ${text}`,
        description: `${metas.get(KEY_META.DESCRIPTION_SCULPTURE)} - ${text}`,
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
  const category = await getSculptureCategory(categoryKey);
  const works = await getSculptureWorksByCategory(categoryKey);

  return (
    <>
      {category && (
        <ItemPage
          tag={category.value}
          category={category}
          works={works}
          type={TYPE.SCULPTURE}
        />
      )}
    </>
  );
}
