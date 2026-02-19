import ItemPage from "@/components/item/itemPage.tsx";
import { Type } from "@/lib/type";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { getMetas } from "@/app/actions/meta";
import { META } from "@/constants/admin";
import { getItemsByYear } from "@/app/actions/item-post";

type Props = {
  params: Promise<{ year: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  const { year } = await params;
  if (metas) {
    return {
      title: `${metas.get(META.DOCUMENT_TITLE_DRAWING)} - Année ${year}`,
      description: `${metas.get(META.DESCRIPTION_DRAWING)} - Année ${year}`,
      openGraph: {
        title: `${metas.get(META.DOCUMENT_TITLE_DRAWING)} - Année ${year}`,
        description: `${metas.get(META.DESCRIPTION_DRAWING)} - Année ${year}`,
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
  const { year } = await params;
  const items = await getItemsByYear(year, type);

  return <ItemPage tag={year} items={items} type={type} />;
}
