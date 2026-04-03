import type { Viewport } from "next";
import { Metadata } from "next";
import Layout from "@/components/layout/layout";
import Providers from "./context/providers";
import "@/styles/globals-specific.css";
import { getIntroText, getMetaMap } from "@/lib/utils/commonUtils";
import React from "react";
import StyledJsxRegistry from "./registry";
import { Cormorant_SC, EB_Garamond } from "next/font/google";
import { KEY_META } from "@/constants/admin";
import { getMetas } from "@/app/admin/meta/action.ts";
import { getActiveTheme, getPresetColors } from "@/app/admin/themeAction.ts";
import { getContentsFull } from "@/app/admin/contentAction.ts";
import { getSession } from "@/app/admin/authAction.ts";
import { getStructHexaTheme } from "@/lib/utils/themeUtils.ts";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-garamond",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif-cormorant-caps",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_HOME),
      description: metas.get(KEY_META.DESCRIPTION_HOME),
      keywords: metas.get(KEY_META.KEYWORDS),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_HOME),
        description: metas.get(KEY_META.DESCRIPTION_HOME),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const theme = await getActiveTheme();
  const pColors = await getPresetColors();
  const structuredTheme = getStructHexaTheme(theme, pColors);
  const metas = await getMetas();
  const contents = await getContentsFull();

  return (
    <html lang="fr" className={`${garamond.variable} ${cormorantSC.variable}`}>
      <body>
        <Providers
          session={session}
          theme={structuredTheme}
          metaMap={getMetaMap(metas)}
        >
          <StyledJsxRegistry>
            <Layout introduction={getIntroText(contents)}>{children}</Layout>
          </StyledJsxRegistry>
        </Providers>
      </body>
    </html>
  );
}
