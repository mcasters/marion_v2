"use client";

import React, { useActionState, useState } from "react";
import s from "@/components/admin/admin.module.css";
import { Image, KeyContent } from "@/lib/type";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";
import useActionResult from "@/components/hooks/useActionResult.ts";
import { updateImageContent } from "@/app/actions/contents/admin.ts";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";

type Props = {
  images: Image[];
  isMultiple: boolean;
  label: KeyContent;
  acceptSmallImage: boolean;
  title?: string;
  isMain?: boolean;
};

export default function ImagesForm({
  images,
  isMultiple,
  label,
  acceptSmallImage,
  title,
  isMain = false,
}: Props) {
  const [resetInput, setResetInput] = useState<number>(0);
  const [changed, setChanged] = useState<boolean>(false);
  const [state, action] = useActionState(updateImageContent, null);
  const reset = (): void => {
    setResetInput(resetInput + 1);
    setChanged(false);
  };
  useActionResult(state, reset);

  return (
    <form action={action}>
      <input type="hidden" name="key" value={label} />
      <input type="hidden" name="isMain" value={isMain?.toString()} />
      <ImageInput
        key={resetInput}
        filesPath={images.map(
          (i: Image) => `/images/miscellaneous/sm/${i.filename}`,
        )}
        isMultiple={isMultiple}
        smallImageOption={acceptSmallImage}
        onChange={() => setChanged(true)}
        title={title}
      />
      <div className={s.buttonSection}>
        <SubmitButton disabled={!changed} />
        <CancelButton disabled={!changed} onCancel={reset} />
      </div>
    </form>
  );
}
