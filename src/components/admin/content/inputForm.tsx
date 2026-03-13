"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { useAlert } from "@/app/context/alertProvider.tsx";
import { Label, Meta } from "@/lib/type.ts";

interface Props {
  label: Label | Meta;
  textContent: string;
  updateAction: (
    formData: FormData,
  ) => Promise<{ message: string; isError: boolean }>;
  title?: string;
  isPhone?: boolean;
  isEmail?: boolean;
}
export default function InputForm({
  label,
  textContent,
  title,
  isPhone = false,
  isEmail = false,
  updateAction,
}: Props) {
  const [text, setText] = useState<string>(textContent);
  const alert = useAlert();

  const action = async (formData: FormData) => {
    const { message, isError } = await updateAction(formData);
    alert(message, isError);
  };

  return (
    <form action={action}>
      <input type="hidden" name="label" value={label} />
      <label>
        {title}
        <input
          placeholder={title}
          name="text"
          type={isPhone ? "tel" : isEmail ? "email" : "text"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <SubmitButton disabled={textContent === text} />
      <CancelButton
        disabled={textContent === text}
        onCancel={() => setText(textContent)}
      />
    </form>
  );
}
