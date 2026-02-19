"use client";

import React, { useRef, useState } from "react";
import { useAlert } from "@/app/context/alertProvider";
import s from "@/components/admin/admin.module.css";
import Preview from "@/components/admin/form/image/preview.tsx";
import { constraintImage } from "@/components/admin/form/formUtils";
import DropFile from "@/components/admin/form/image/DropFile.tsx";
import { MESSAGE } from "@/constants/admin.ts";

type Props = {
  isMultiple: boolean;
  acceptSmallImage: boolean;
  onNewFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function ImageInput({
  isMultiple,
  acceptSmallImage,
  onNewFiles,
}: Props) {
  const alert = useAlert();
  const inputRef = useRef<HTMLInputElement>(null);
  const [smallImage, setSmallImage] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const reset = () => {
    onNewFiles([]);
    setPreviewImages([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async (dropFile?: File) => {
    const files = dropFile
      ? [dropFile]
      : Array.from(inputRef.current?.files ?? []);

    if (!isMultiple) reset();

    let error = false;
    let weight = 0;
    for (const file of files) {
      weight += file.size;
      if (weight > 30000000) {
        error = true;
        alert(MESSAGE.error_sizeUpload, true, 5000);
        break;
      }
      if (!smallImage) {
        const bmp = await createImageBitmap(file);
        if (bmp.width < 2000) {
          error = true;
          alert(MESSAGE.error_imageSize, true, 5000);
          bmp.close();
          break;
        }
      }
      const resizedFile = await constraintImage(file);
      setPreviewImages((prev) => [...prev, URL.createObjectURL(resizedFile)]);
      onNewFiles((prev) => [...prev, resizedFile]);
    }
    if (error) reset();
  };

  return (
    <>
      <div className={s.imageInputContainer}>
        <DropFile onFile={handleUpload}>
          <input
            type="file"
            onChange={() => handleUpload()}
            ref={inputRef}
            multiple={isMultiple}
            accept="image/png, image/jpeg"
            className={s.inputButton}
          />
        </DropFile>
        {acceptSmallImage && (
          <label>
            <input
              type="checkbox"
              checked={smallImage}
              onChange={() => setSmallImage(!smallImage)}
            />
            Accepter les images sous 2000 px de large
          </label>
        )}
      </div>
      {previewImages.length > 0 && (
        <Preview filenames={previewImages} pathImage="" />
      )}
    </>
  );
}
