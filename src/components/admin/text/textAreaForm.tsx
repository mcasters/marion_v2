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
  metaLayout?: boolean;
}
export default function TextAreaForm({
  key,
  text,
  updateAction,
  title,
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
        <textarea
          name="text"
          value={_text}
          onChange={(e) => set_text(e.target.value)}
          rows={metaLayout ? 3 : 7}
        />
      </label>
      <SubmitButton disabled={text === _text} />
      <CancelButton disabled={text === _text} onCancel={() => set_text(text)} />
    </form>
  );
}
