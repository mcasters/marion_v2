import { getCategory, getWorksByCategory } from "@/app/actions/item-post";
import { Type } from "@/lib/type";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { getMetas } from "@/app/actions/meta";
import ItemPage from "@/components/item/itemPage.tsx";
import { KEY_META } from "@/constants/admin";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const categoryKey = (await params).category;
  const metas = getMetaMap(await getMetas());
  const category = await getCategory(categoryKey, Type.PAINTING);

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
  const type = Type.PAINTING;
  const categoryKey = (await params).category;
  const category = await getCategory(categoryKey, type);
  const works = await getWorksByCategory(categoryKey, type);

  return (
    <>
      {category && (
        <ItemPage
          tag={category.value}
          category={category}
          works={works}
          type={type}
        />
      )}
    </>
  );
}
