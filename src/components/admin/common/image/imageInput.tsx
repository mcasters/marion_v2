"use client";

import React, {
  ChangeEvent,
  HTMLProps,
  JSX,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAlert } from "@/app/context/alertProvider";
import s from "./image.module.css";
import ArrowDown from "@/components/icons/arrowDown.tsx";
import Image from "next/image";
import DeleteButton from "@/components/admin/common/button/deleteButton.tsx";
import { constraintImage, validateFile } from "@/lib/utils/imageUtils.ts";

interface Props extends HTMLProps<HTMLInputElement> {
  filesPath: string[];
  smallImageOption: boolean;
  isMultiple?: boolean;
  onChange?: () => void;
  isMain?: boolean;
  required?: boolean;
  title?: string;
}

export default function ImageInput({
  filesPath,
  smallImageOption,
  onChange,
  isMultiple = false,
  isMain = false,
  required = false,
  title = "",
}: Props): JSX.Element {
  const alert = useAlert();
  const [acceptSmallImage, setAcceptSmallImage] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filenamesToDelete, setFilenamesToDelete] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>(
    filesPath.map((path) => new File(["f"], path)),
  );

  useEffect(() => {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      if (!file.name.startsWith("/images/")) dataTransfer.items.add(file);
    });
    if (inputRef.current) inputRef.current.files = dataTransfer.files;
  }, [files]);

  const handleDelete = (filepath: string) => {
    if (filepath.startsWith("/images/")) {
      const filename = filepath.substring(filepath.lastIndexOf("/") + 1);
      setFilenamesToDelete((prev) =>
        isMultiple ? [...prev, filename] : [filename],
      );
    }
    setFiles(files.filter((file) => file.name !== filepath));
    if (onChange) onChange();
  };

  const handleAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];
    if (files.length === 0) return;

    let resizedFiles: File[] = [];
    let weight = 0;
    const increaseWeight = (size: number) => (weight += size);
    for await (const file of files) {
      const result = await validateFile(file, increaseWeight, acceptSmallImage);
      if (result.isError) {
        if (inputRef.current) inputRef.current.value = "";
        alert(result.message, result.isError, 5000);
        return;
      }
      resizedFiles.push(await constraintImage(file));
    }

    if (!isMultiple) {
      setFiles(resizedFiles);
      if (filesPath.length)
        setFilenamesToDelete([
          filesPath[0].substring(filesPath[0].lastIndexOf("/") + 1),
        ]);
    } else {
      setFiles((prev) => [...prev, ...resizedFiles]);
    }
    if (onChange) onChange();
  };

  return (
    <div className="inputContainer">
      <input
        name={isMain ? "mainFilenameToDelete" : "filenamesToDelete"}
        type="hidden"
        value={filenamesToDelete}
      />
      {title && <p className="label">{title}</p>}
      <div className={s.dropZone}>
        <div className={s.dropIcon}>
          <ArrowDown width={50} height={50} />
        </div>
        <div>{`Glisser ${isMultiple ? "les" : "la"} photo${isMultiple ? "s" : ""} ou cliquer`}</div>
        <input
          ref={inputRef}
          type="file"
          name={isMain ? "mainFileToAdd" : "filesToAdd"}
          onChange={handleAdd}
          multiple={isMultiple}
          accept="image/png, image/jpeg"
          className={s.input}
          required={required && !files.length}
        />
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
      <div className={s.previewContainer}>
        {files.length === 0 && <p className={s.emptyInfo}>Aucune image</p>}
        {files.map((file, i) => (
          <div key={i} className={s.imageWrapper}>
            <SizedImage
              src={
                file.name.startsWith("/images/")
                  ? file.name
                  : URL.createObjectURL(file)
              }
            />
            <DeleteButton onDelete={() => handleDelete(file.name)} />
          </div>
        ))}
      </div>
    </div>
  );
}

const SizedImage = ({ src }: { src: string }): JSX.Element => {
  const [size, setSize] = useState({ naturalWidth: 0, naturalHeight: 0 });
  return (
    <Image
      src={src}
      onLoad={(e) => {
        const { naturalWidth, naturalHeight } = e.target as HTMLImageElement;
        setSize({ naturalWidth, naturalHeight });
      }}
      width={size.naturalWidth}
      height={size.naturalHeight}
      alt="Preview"
      unoptimized={true}
      style={
        size.naturalWidth / size.naturalHeight >= 1.03
          ? {
              width: 150,
              height: "auto",
            }
          : {
              width: "auto",
              height: 150,
            }
      }
      className={s.image}
    />
  );
};
