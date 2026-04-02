"use client";

import React, { useActionState, useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { KeyMeta } from "@/lib/type.ts";
import s from "../admin.module.css";
import useActionResult from "@/components/hooks/useActionResult.ts";
import { LABEL } from "@/db/schema.ts";

interface Props {
  dbKey: LABEL | KeyMeta;
  text: string;
  updateAction: (
    initialState: any,
    formData: FormData,
  ) => Promise<{ message: string; isError: boolean }>;
  title?: string;
  isPhone?: boolean;
  isEmail?: boolean;
  metaLayout?: boolean;
}
export default function InputForm({
  dbKey,
  text,
  updateAction,
  title,
  isPhone = false,
  isEmail = false,
  metaLayout = false,
}: Props) {
  const [_text, set_text] = useState<string>(text);
  const [state, action] = useActionState(updateAction, null);
  useActionResult(state);

  return (
    <form action={action} className={metaLayout ? s.metaForm : undefined}>
      <input type="hidden" name="key" value={dbKey} />
      <label className="inputContainer">
        {title}
        <input
          name="text"
          value={_text}
          onChange={(e) => set_text(e.target.value)}
          type={isPhone ? "tel" : isEmail ? "email" : "text"}
        />
      </label>
      <SubmitButton disabled={text === _text} />
      <CancelButton disabled={text === _text} onCancel={() => set_text(text)} />
    </form>
  );
}
