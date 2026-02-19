import { getCategory, getItemsByCategory } from "@/app/actions/item-post";
import ItemPage from "@/components/item/itemPage.tsx";
import { Type } from "@/lib/type";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { getMetas } from "@/app/actions/meta";
import { META } from "@/constants/admin";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  const categoryKey = (await params).category;
  const category = await getCategory(categoryKey, Type.DRAWING);

  if (metas && category) {
    const text =
      category.value === "Sans catégorie"
        ? category.value
        : `Série ${category.value}`;
    return {
      title: `${metas.get(META.DOCUMENT_TITLE_DRAWING)} - ${text}`,
      description: `${metas.get(META.DESCRIPTION_DRAWING)} - ${text}`,
      openGraph: {
        title: `${metas.get(META.DOCUMENT_TITLE_DRAWING)} - ${text}`,
        description: `${metas.get(META.DESCRIPTION_DRAWING)} - ${text}`,
        url: metas.get(META.URL),
        siteName: metas.get(META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page({ params }: Props) {
  const type = Type.DRAWING;
  const categoryKey = (await params).category;
  const category = await getCategory(categoryKey, type);
  const items = await getItemsByCategory(categoryKey, type);

  return (
    <>
      {category && (
        <ItemPage
          tag={category.value}
          category={category}
          items={items}
          type={type}
        />
      )}
    </>
  );
}
