"use client";

import React, { useEffect, useState } from "react";
import SubmitButton from "@/components/admin/common/button/submitButton.tsx";
import CancelButton from "@/components/admin/common/button/cancelButton.tsx";
import { useAlert } from "@/app/context/alertProvider";
import { updateImageContent } from "@/app/actions/contents/admin";
import s from "@/components/admin/admin.module.css";
import { Image, KeyContent } from "@/lib/type";
import ImageInput from "@/components/admin/common/image/imageInput.tsx";

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
  const alert = useAlert();
  const [workImages, setWorkImages] = useState<Image[]>(images);
  const [filenamesToDelete, setFilenamesToDelete] = useState<string[]>([]);
  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const [resetInput, setResetInput] = useState<number>(0);

  useEffect(() => {
    setWorkImages(images);
  }, [images]);

  const reset = () => {
    setFilesToAdd([]);
    setFilenamesToDelete([]);
    setResetInput(resetInput + 1);
  };

  const handleAddFiles = (files: File[]) => {
    setFilesToAdd((prevState) =>
      isMultiple ? [...prevState, ...files] : files,
    );
    if (!isMultiple) setWorkImages([]);
  };

  const handleDeleteFile = (filename: string) => {
    const images = workImages.filter((i: Image) => i.filename !== filename);
    setWorkImages(images);
    setFilenamesToDelete([...filenamesToDelete, filename]);
  };

  const submit = async (formData: FormData) => {
    filesToAdd.forEach((file) => formData.append("files", file));
    const { message, isError } = await updateImageContent(formData);
    reset();
    alert(message, isError);
  };

  return (
    <>
      <form action={submit}>
        <input type="hidden" name="label" value={label} />
        <input type="hidden" name="isMain" value={isMain?.toString()} />
        <input
          name="filenamesToDelete"
          type="hidden"
          value={filenamesToDelete}
        />
        <ImageInput
          key={resetInput}
          filenames={workImages.map((i) => i.filename)}
          pathImage="/images/miscellaneous"
          isMultiple={isMultiple}
          smallImageOption={acceptSmallImage}
          onNewFiles={handleAddFiles}
          onDelete={handleDeleteFile}
          title={title}
        />
        <div className={s.buttonSection}>
          <SubmitButton
            disabled={filesToAdd.length === 0 && filenamesToDelete.length === 0}
          />
          <CancelButton
            onCancel={() => {
              reset();
              setWorkImages(images);
            }}
            disabled={filesToAdd.length === 0 && filenamesToDelete.length === 0}
          />
        </div>
      </form>
    </>
  );
}
