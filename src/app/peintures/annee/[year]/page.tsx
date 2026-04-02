import ItemPage from "@/components/item/itemPage.tsx";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { getMetas } from "@/app/actions/meta";
import { Metadata } from "next";
import { KEY_META } from "@/constants/admin";
import { getPaintingWorksByYear } from "@/app/peintures/action.ts";
import { TYPE } from "@/db/schema.ts";

type Props = {
  params: Promise<{ year: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const year = await params;
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: `${metas.get(KEY_META.DOCUMENT_TITLE_PAINTING)} - Année ${year}`,
      description: `${metas.get(KEY_META.DESCRIPTION_PAINTING)} - Année ${year}`,
      openGraph: {
        title: `${metas.get(KEY_META.DOCUMENT_TITLE_PAINTING)} - Année ${year}`,
        description: `${metas.get(KEY_META.DESCRIPTION_PAINTING)} - Année ${year}`,
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Page({ params }: Props) {
  const { year } = await params;
  const works = await getPaintingWorksByYear(year);

  return <ItemPage tag={year} works={works} type={TYPE.PAINTING} />;
}
