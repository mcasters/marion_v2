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
import { getContentsFull } from "@/app/actions/contents";
import { updateContent } from "@/app/actions/contents/admin.ts";
import { KEY_LABEL } from "@/constants/admin.ts";

export default async function Contact() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page contact</h1>
      <TextAreaForm
        text={getAddress(contents)}
        key={KEY_LABEL.ADDRESS}
        updateAction={updateContent}
        title="Adresse"
      />
      <div className="separate" />
      <InputForm
        key={KEY_LABEL.PHONE}
        text={getPhone(contents)}
        updateAction={updateContent}
        title="Téléphone"
        isPhone
      />
      <div className="separate" />
      <InputForm
        key={KEY_LABEL.EMAIL}
        text={getEmail(contents)}
        updateAction={updateContent}
        title="E-mail"
        isEmail
      />
      <div className="separate" />
      <TextAreaForm
        text={getContactText(contents)}
        key={KEY_LABEL.TEXT_CONTACT}
        updateAction={updateContent}
        title="Texte d'accompagnement (facultatif)"
      />
    </div>
  );
}
