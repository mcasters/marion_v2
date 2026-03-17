import { getMessages } from "@/app/actions/messages";
import { Metadata } from "next";
import s from "@/components/admin/admin.module.css";
import style from "@/components/admin/admin.module.css";
import AdminTheme from "@/components/admin/theme/adminTheme.tsx";
import ChatMessages from "@/components/admin/chatMessage/chatMessages.tsx";
import React from "react";
import { getMetaMap } from "@/lib/utils/commonUtils.ts";
import { getMetas } from "@/app/actions/meta";
import { KEY_META } from "@/constants/admin.ts";
import InputForm from "@/components/admin/text/inputForm.tsx";
import { updateMeta } from "@/app/actions/meta/admin.ts";

export const metadata: Metadata = {
  title: "",
  description: "",
  keywords: "",
  openGraph: null,
};

export default async function AdminHome() {
  const messages = await getMessages();
  const metas = getMetaMap(await getMetas());

  return (
    <>
      <h1 className={s.title1}>Administration générale</h1>
      <h2 className={s.title2}>Gestion du thème</h2>
      <AdminTheme />
      <div className="separate" />
      <h2 className={style.title2}>Pied de page du site</h2>
      <InputForm
        key={KEY_META.FOOTER}
        text={metas.get(KEY_META.FOOTER) || ""}
        updateAction={updateMeta}
      />
      <div className="separate" />
      <h2 className={style.title2}>
        Tchat (si t'as des questions ou des remarques)
      </h2>
      <ChatMessages dbMessages={messages} />
    </>
  );
}
