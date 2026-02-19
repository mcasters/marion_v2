"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/admin/form/submitButton";
import CancelButton from "@/components/admin/form/cancelButton";
import { useAlert } from "@/app/context/alertProvider";
import { updateContent } from "@/app/actions/contents/admin";

interface Props {
  label: string;
  textContent: string;
  textLabel?: string;
  isPhone?: boolean;
  isEmail?: boolean;
}
export default function InputForm({
  label,
  textContent,
  textLabel,
  isPhone = false,
  isEmail = false,
}: Props) {
  const [text, setText] = useState<string>(textContent);
  const [isChanged, setIsChanged] = useState(false);
  const alert = useAlert();

  const action = async (formData: FormData) => {
    const { message, isError } = await updateContent(null, formData);
    alert(message, isError);
    setIsChanged(false);
  };

  return (
    <form action={action}>
      <input type="hidden" name="label" value={label} />
      <label>
        {textLabel}
        <input
          placeholder={label}
          name="text"
          type={isPhone ? "tel" : isEmail ? "email" : "text"}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setIsChanged(true);
          }}
        />
      </label>
      <SubmitButton disabled={!isChanged} />
      <CancelButton
        disabled={!isChanged}
        onCancel={() => setText(textContent)}
      />
    </form>
  );
}
