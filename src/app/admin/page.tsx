import { getMessages } from "@/app/actions/messages";
import { Metadata } from "next";
import s from "@/components/admin/admin.module.css";
import style from "@/components/admin/admin.module.css";
import AdminTheme from "@/components/admin/theme/adminTheme.tsx";
import ChatMessages from "@/components/admin/chatMessage/chatMessages.tsx";
import React from "react";

export const metadata: Metadata = {
  title: "",
  description: "",
  keywords: "",
  openGraph: null,
};

export default async function Page() {
  const messages = await getMessages();

  return (
    <>
      <h1 className={s.title1}>Administration générale</h1>
      <h2 className={s.title2}>Gestion du thème</h2>
      <AdminTheme />
      <div className="separate" />
      <h2 className={style.title2}>Messages</h2>
      <ChatMessages dbMessages={messages} />
    </>
  );
}
