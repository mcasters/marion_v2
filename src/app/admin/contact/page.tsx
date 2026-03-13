import {
  getAddress,
  getContactText,
  getEmail,
  getPhone,
} from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import TextAreaForm from "@/components/admin/content/textAreaForm.tsx";
import React from "react";
import InputForm from "@/components/admin/content/inputForm.tsx";
import { getContentsFull } from "@/app/actions/contents";
import { updateContent } from "@/app/actions/contents/admin.ts";
import { LABEL } from "@/constants/admin.ts";

export default async function Contact() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page contact</h1>
      <TextAreaForm
        textContent={getAddress(contents)}
        label={LABEL.ADDRESS}
        title="Adresse"
      />
      <div className="separate" />
      <InputForm
        label={LABEL.PHONE}
        textContent={getPhone(contents)}
        updateAction={updateContent}
        title="Téléphone"
        isPhone
      />
      <div className="separate" />
      <InputForm
        label={LABEL.EMAIL}
        textContent={getEmail(contents)}
        updateAction={updateContent}
        title="E-mail"
        isEmail
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getContactText(contents)}
        label={LABEL.TEXT_CONTACT}
        title="Texte d'accompagnement (facultatif)"
      />
    </div>
  );
}
