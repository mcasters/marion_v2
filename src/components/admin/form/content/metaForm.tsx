"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import SubmitButton from "@/components/admin/form/submitButton";
import CancelButton from "@/components/admin/form/cancelButton";
import { useAlert } from "@/app/context/alertProvider";
import { updateMeta } from "@/app/actions/meta/admin";

interface Props {
  content: string;
  dbLabel: string;
  label: string;
  isTextArea: boolean;
}
export default function MetaForm({
  content,
  dbLabel,
  label,
  isTextArea,
}: Props) {
  const [text, setText] = useState<string>(content);
  const [isChanged, setIsChanged] = useState(false);
  const alert = useAlert();

  const action = async (formData: FormData) => {
    const { message, isError } = await updateMeta(null, formData);
    alert(message, isError);
    setIsChanged(false);
  };

  return (
    <form action={action} className={s.metaForm}>
      <input type="hidden" name="label" value={dbLabel} />
      <label>
        {label}
        {isTextArea ? (
          <textarea
            name="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setIsChanged(true);
            }}
            rows={3}
          />
        ) : (
          <input
            name="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setIsChanged(true);
            }}
          />
        )}
      </label>
      <SubmitButton disabled={!isChanged} />
      <CancelButton disabled={!isChanged} onCancel={() => setText(content)} />
    </form>
  );
}
