import {
  getAddress,
  getContactText,
  getEmail,
  getPhone,
} from "@/lib/utils/commonUtils";
import s from "@/components/admin/admin.module.css";
import { Label } from "@@/prisma/generated/client";
import TextAreaForm from "@/components/admin/form/content/textAreaForm";
import React from "react";
import InputForm from "@/components/admin/form/content/inputForm";
import { getContentsFull } from "@/app/actions/contents";

export default async function Contact() {
  const contents = await getContentsFull();

  return (
    <div className={s.container}>
      <h1 className={s.title1}>Contenus de la page contact</h1>
      <TextAreaForm
        textContent={getAddress(contents)}
        label={Label.ADDRESS}
        textLabel="Adresse"
      />
      <div className="separate" />
      <InputForm
        label={Label.PHONE}
        textContent={getPhone(contents)}
        textLabel="Téléphone"
        isPhone
      />
      <div className="separate" />
      <InputForm
        label={Label.EMAIL}
        textContent={getEmail(contents)}
        textLabel="E-mail"
        isEmail
      />
      <div className="separate" />
      <TextAreaForm
        textContent={getContactText(contents)}
        label={Label.TEXT_CONTACT}
        textLabel="Texte d'accompagnement (facultatif)"
      />
    </div>
  );
}
