"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { useAlert } from "@/app/context/alertProvider.tsx";

interface Props {
  dbLabel: string;
  text: string;
  updateAction: (
    formData: FormData,
  ) => Promise<{ message: string; isError: boolean }>;
  label?: string;
  isPhone?: boolean;
  isEmail?: boolean;
}
export default function InputForm({
  dbLabel,
  text,
  label,
  isPhone = false,
  isEmail = false,
  updateAction,
}: Props) {
  const [_text, set_text] = useState<string>(text);
  const [isChanged, setIsChanged] = useState(false);
  const alert = useAlert();

  const action = async (formData: FormData) => {
    const { message, isError } = await updateAction(formData);
    alert(message, isError);
    setIsChanged(false);
  };

  return (
    <form action={action}>
      <input type="hidden" name="label" value={dbLabel} />
      <label>
        {label}
        <input
          placeholder={label}
          name="text"
          type={isPhone ? "tel" : isEmail ? "email" : "text"}
          value={_text}
          onChange={(e) => {
            set_text(e.target.value);
            setIsChanged(true);
          }}
        />
      </label>
      <SubmitButton disabled={!isChanged} />
      <CancelButton disabled={!isChanged} onCancel={() => set_text(text)} />
    </form>
  );
}
