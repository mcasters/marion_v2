"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { useAlert } from "@/app/context/alertProvider.tsx";
import { KeyContent, KeyMeta } from "@/lib/type.ts";
import s from "../admin.module.css";

interface Props {
  key: KeyContent | KeyMeta;
  text: string;
  updateAction: (
    formData: FormData,
  ) => Promise<{ message: string; isError: boolean }>;
  title?: string;
  isPhone?: boolean;
  isEmail?: boolean;
  metaLayout?: boolean;
}
export default function InputForm({
  key,
  text,
  updateAction,
  title,
  isPhone = false,
  isEmail = false,
  metaLayout = false,
}: Props) {
  const [_text, set_text] = useState<string>(text);
  const alert = useAlert();

  const action = async (formData: FormData) => {
    const { message, isError } = await updateAction(formData);
    alert(message, isError);
  };

  return (
    <form action={action} className={metaLayout ? s.metaForm : undefined}>
      <input type="hidden" name="key" value={key} />
      <label className="inputContainer">
        {title}
        <input
          name="text"
          value={_text}
          type={isPhone ? "tel" : isEmail ? "email" : "text"}
          onChange={(e) => set_text(e.target.value)}
        />
      </label>
      <SubmitButton disabled={_text === text} />
      <CancelButton disabled={_text === text} onCancel={() => set_text(text)} />
    </form>
  );
}
