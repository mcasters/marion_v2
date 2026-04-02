import Link from "next/link";
import {
  getAddress,
  getContactText,
  getEmail,
  getMetaMap,
  getPhone,
} from "@/lib/utils/commonUtils";
import InstagramIcon from "@/components/icons/instagramIcon";
import { KEY_META } from "@/constants/admin";
import { Metadata } from "next";
import s from "@/styles/page.module.css";
import { getMetas } from "@/app/admin/meta/action.ts";
import { getContentsFull } from "@/app/admin/contentAction.ts";

export async function generateMetadata(): Promise<Metadata | undefined> {
  const metas = getMetaMap(await getMetas());
  if (metas) {
    return {
      title: metas.get(KEY_META.DOCUMENT_TITLE_CONTACT),
      description: metas.get(KEY_META.DESCRIPTION_CONTACT),
      openGraph: {
        title: metas.get(KEY_META.DOCUMENT_TITLE_CONTACT),
        description: metas.get(KEY_META.DESCRIPTION_CONTACT),
        url: metas.get(KEY_META.URL),
        siteName: metas.get(KEY_META.SEO_SITE_TITLE),
        locale: "fr",
        type: "website",
      },
    };
  }
}

export default async function Contact() {
  const contents = await getContentsFull();
  const metas = getMetaMap(await getMetas());
  const email = getEmail(contents);
  const contactText = getContactText(contents);
  const owner = metas.get(KEY_META.OWNER);
  const instagram = metas.get(KEY_META.INSTAGRAM);

  return (
    <>
      <h1 className="hidden">Contacter {owner}</h1>
      <address className={s.section}>
        <p>{owner}</p>
        <p>{getAddress(contents)}</p>
        <br />
        <p>
          <Link href={`tel:+33${getPhone(contents)}`}>
            {getPhone(contents)}
          </Link>
        </p>
        <br />
        <p>
          <Link href={`mailto:${email}`}>{email}</Link>
        </p>
        {owner?.startsWith("T") && instagram && (
          <>
            <br />
            <br />
            <br />
            <a href={instagram} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </>
        )}
      </address>
      {contactText !== "" && (
        <section className={s.section}>
          <br />
          <br />
          <br />
          <p>{contactText}</p>
        </section>
      )}
    </>
  );
}
