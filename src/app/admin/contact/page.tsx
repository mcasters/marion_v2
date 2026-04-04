import s from "@/components/admin/admin.module.css";
import TextAreaForm from "@/components/admin/text/textAreaForm.tsx";
import React from "react";
import InputForm from "@/components/admin/text/inputForm.tsx";
import { LABEL } from "@/db/schema.ts";
import { getContactContent, updateContent } from "@/app/admin/contentAction.ts";

export default async function Contact() {
  const contents = await getContactContent();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page contact</h1>
      <TextAreaForm
        dbKey={LABEL.ADDRESS}
        text={contents.get(LABEL.ADDRESS) ?? ""}
        updateAction={updateContent}
        title="Adresse"
      />
      <div className="separate" />
      <InputForm
        dbKey={LABEL.PHONE}
        text={contents.get(LABEL.PHONE) ?? ""}
        updateAction={updateContent}
        title="Téléphone"
        isPhone
      />
      <div className="separate" />
      <InputForm
        dbKey={LABEL.EMAIL}
        text={contents.get(LABEL.EMAIL) ?? ""}
        updateAction={updateContent}
        title="E-mail"
        isEmail
      />
      <div className="separate" />
      <TextAreaForm
        dbKey={LABEL.TEXT_CONTACT}
        text={contents.get(LABEL.TEXT_CONTACT) ?? ""}
        updateAction={updateContent}
        title="Texte d'accompagnement (facultatif)"
      />
    </div>
  );
}
