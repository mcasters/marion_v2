"use client";

import React, { HTMLProps, JSX, useEffect, useRef, useState } from "react";
import { useAlert } from "@/app/context/alertProvider";
import s from "./image.module.css";
import { constraintImage } from "@/components/admin/common/formUtils";
import { MESSAGE } from "@/constants/admin.ts";
import ArrowDown from "@/components/icons/arrowDown.tsx";
import { Thumbnail } from "@/lib/type.ts";
import { getThumbnails } from "@/lib/utils/imageUtils.ts";
import Image from "next/image";
import DeleteButton from "@/components/admin/common/button/deleteButton.tsx";

interface Props extends HTMLProps<HTMLInputElement> {
  filenames: string[];
  pathImage: string;
  isMultiple: boolean;
  smallImageOption: boolean;
  onNewFiles: (files: File[]) => void;
  onDelete: (filename: string) => void;
  title?: string;
  required?: boolean;
}

export default function ImageInput({
  filenames,
  pathImage,
  isMultiple,
  smallImageOption,
  onNewFiles,
  onDelete,
  title = "",
  required = false,
}: Props): JSX.Element {
  const alert = useAlert();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [acceptSmallImage, setAcceptSmallImage] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>(
    getThumbnails(filenames, pathImage),
  );

  useEffect(() => {
    const dataTransfer = new DataTransfer();
    filenames.forEach((filename) => {
      dataTransfer.items.add(new File(["foo"], filename));
    });
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  }, []);

  useEffect(() => {
    const dataTransfer = new DataTransfer();
    thumbnails.forEach((thumbnail) => {
      dataTransfer.items.add(new File(["foo"], thumbnail.filename));
    });
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  }, [thumbnails]);

  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const drop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    await handleUpload(e.dataTransfer.files);
  };

  const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleOnDelete = (thumbnail: Thumbnail) => {
    if (thumbnail.path !== "") onDelete(thumbnail.filename);
    setThumbnails(
      thumbnails.filter((item) => item.filename !== thumbnail.filename),
    );
  };

  const handleUpload = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);

    let weight = 0;
    let resizedFiles: File[] = [];
    let thumbnails: Thumbnail[] = [];

    for await (const file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        alert(MESSAGE.error_imageType, true, 5000);
        return;
      }
      weight += file.size;
      if (weight > 30000000) {
        alert(MESSAGE.error_sizeUpload, true, 5000);
        return;
      }
      if (!acceptSmallImage) {
        const bmp = await createImageBitmap(file);
        if (bmp.width < 2000) {
          alert(MESSAGE.error_imageSize, true, 5000);
          bmp.close();
          return;
        }
        bmp.close();
      }
      const resizedFile = await constraintImage(file);
      thumbnails.push({ filename: URL.createObjectURL(resizedFile), path: "" });
      resizedFiles.push(resizedFile);
    }
    setThumbnails(isMultiple ? (prev) => [...prev, ...thumbnails] : thumbnails);
    onNewFiles(resizedFiles);
  };

  return (
    <div className="inputContainer">
      <>
        {title && <p className="label">{title}</p>}
        <div
          ref={dropRef}
          className={isOver ? `${s.dropZoneOver} ${s.dropZone}` : s.dropZone}
          onDragOver={dragOver}
          onDrop={drop}
          onDragLeave={dragLeave}
        >
          <input
            ref={inputRef}
            type="file"
            onChange={(e) => handleUpload(e.target.files)}
            multiple={isMultiple}
            accept="image/png, image/jpeg"
            className={s.input}
            required={required}
          />
          <div className={s.dropIcon}>
            <ArrowDown width={50} height={50} />
          </div>
          {`Glisser ${isMultiple ? "les" : "la"} photo${isMultiple ? "s" : ""} ou cliquer`}
        </div>
        {smallImageOption && (
          <label className={s.smallImageLabel}>
            <input
              type="checkbox"
              checked={acceptSmallImage}
              onChange={() => setAcceptSmallImage(!acceptSmallImage)}
            />
            Accepter les images en dessous de 2000 px de large
          </label>
        )}
      </>
      {thumbnails.length > 0 && (
        <div className={s.previewContainer}>
          {thumbnails.map(({ filename, path }) => (
            <div key={filename} className={s.imageWrapper}>
              <Image
                src={path === "" ? filename : `${path}/sm/${filename}`}
                width={150}
                height={150}
                alt="Image de l'item"
                unoptimized={true}
                className={s.image}
              />
              <DeleteButton
                onDelete={() => handleOnDelete({ filename, path })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
