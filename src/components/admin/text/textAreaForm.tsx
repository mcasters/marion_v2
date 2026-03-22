"use client";

import React, { useActionState, useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { KeyContent, KeyMeta } from "@/lib/type.ts";
import s from "../admin.module.css";
import useActionResult from "@/components/hooks/useActionResult.ts";

interface Props {
  dbKey: KeyContent | KeyMeta;
  text: string;
  updateAction: (
    initialState: any,
    formData: FormData,
  ) => Promise<{ message: string; isError: boolean }>;
  title?: string;
  metaLayout?: boolean;
}
export default function TextAreaForm({
  dbKey,
  text,
  updateAction,
  title,
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
