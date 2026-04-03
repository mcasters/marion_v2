import WorkPage from "@/components/work/workPage.tsx";
import { Metadata } from "next";
import { getMetaMap } from "@/lib/utils/commonUtils";
import { KEY_META } from "@/constants/admin";
import { getDrawingWorksByYear } from "@/app/dessins/action.ts";
import { TYPE } from "@/db/schema.ts";
import { getMetas } from "@/app/admin/meta/action.ts";

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
      title: `${metas.get(KEY_META.DOCUMENT_TITLE_DRAWING)} - Année ${year}`,
      description: `${metas.get(KEY_META.DESCRIPTION_DRAWING)} - Année ${year}`,
      openGraph: {
        title: `${metas.get(KEY_META.DOCUMENT_TITLE_DRAWING)} - Année ${year}`,
        description: `${metas.get(KEY_META.DESCRIPTION_DRAWING)} - Année ${year}`,
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
  const works = await getDrawingWorksByYear(year);

  return <WorkPage tag={year} works={works} type={TYPE.DRAWING} />;
}
