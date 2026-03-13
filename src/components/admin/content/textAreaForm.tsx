"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { useAlert } from "@/app/context/alertProvider.tsx";
import { updateContent } from "@/app/actions/contents/admin.ts";
import { Label } from "@/lib/type.ts";

interface Props {
  label: Label;
  textContent: string;
  title?: string;
}
export default function TextAreaForm({ label, textContent, title }: Props) {
  const [text, setText] = useState<string>(textContent);
  const alert = useAlert();

  const action = async (formData: FormData) => {
    const { message, isError } = await updateContent(formData);
    alert(message, isError);
  };

  return (
    <form action={action}>
      <input type="hidden" name="label" value={label} />
      <label>
        {title}
        <textarea
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
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
