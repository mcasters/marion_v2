"use client";

import React, { useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { useAlert } from "@/app/context/alertProvider";
import {
  deleteImageContent,
  updateImageContent,
} from "@/app/actions/contents/admin";
import s from "@/components/admin/admin.module.css";
import { Image, Label } from "@/lib/type";
import Preview from "@/components/admin/common/image/preview.tsx";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";

type Props = {
  images: Image[];
  isMultiple: boolean;
  label: Label;
  acceptSmallImage: boolean;
  title: string;
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
  const alert = useAlert();
  const [files, setFiles] = useState<File[]>([]);
  const [resetInput, setResetInput] = useState<number>(0);

  const submit = async (formData: FormData) => {
    files.forEach((file) => formData.append("files", file));
    const { message, isError } = await updateImageContent(formData);
    alert(message, isError);
    reset();
  };

  const reset = () => {
    setFiles([]);
    setResetInput(resetInput + 1);
  };

  return (
    <>
      <label className={s.label}>{title}</label>
      <Preview
        filenames={images.map((i) => i.filename)}
        pathImage="/images/miscellaneous"
        deleteAction={(filename) => deleteImageContent(filename)}
      />
      <form action={submit}>
        <input type="hidden" name="label" value={label} />
        <input type="hidden" name="isMain" value={isMain?.toString()} />
        <ImageInput
          key={resetInput}
          isMultiple={isMultiple}
          acceptSmallImage={acceptSmallImage}
          onNewFiles={setFiles}
        />
        <div className={s.buttonSection}>
          <SubmitButton disabled={files.length === 0} />
          <CancelButton onCancel={reset} disabled={files.length === 0} />
        </div>
      </form>
    </>
  );
}
