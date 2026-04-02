import {
  getAddress,
  getContactText,
  getEmail,
  getPhone,
} from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import TextAreaForm from "@/components/admin/text/textAreaForm.tsx";
import React from "react";
import InputForm from "@/components/admin/text/inputForm.tsx";
import { LABEL } from "@/db/schema.ts";
import { getContentsFull, updateContent } from "@/app/admin/contentAction.ts";

export default async function Contact() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page contact</h1>
      <TextAreaForm
        text={getAddress(contents)}
        dbKey={LABEL.ADDRESS}
        updateAction={updateContent}
        title="Adresse"
      />
      <div className="separate" />
      <InputForm
        dbKey={LABEL.PHONE}
        text={getPhone(contents)}
        updateAction={updateContent}
        title="Téléphone"
        isPhone
      />
      <div className="separate" />
      <InputForm
        dbKey={LABEL.EMAIL}
        text={getEmail(contents)}
        updateAction={updateContent}
        title="E-mail"
        isEmail
      />
      <div className="separate" />
      <TextAreaForm
        text={getContactText(contents)}
        dbKey={LABEL.TEXT_CONTACT}
        updateAction={updateContent}
        title="Texte d'accompagnement (facultatif)"
      />
    </div>
  );
}
