"use client";

import React, { Fragment, HTMLProps, JSX } from "react";
import DeleteIcon from "@/components/icons/deleteIcon";
import s from "./image.module.css";
import Image from "next/image";

interface Props extends HTMLProps<HTMLDivElement> {
  filenames: string[];
  pathImage: string;
  onDelete?: (filename: string) => void;
  title?: string;
  emptyInfo?: string;
}

export default function Preview({
  filenames,
  pathImage,
  onDelete,
  title,
  style,
  emptyInfo = "",
}: Props): JSX.Element {
  return (
    <div className={s.previewContainer} style={{ ...style }}>
      {title && <label>{title}</label>}
      {filenames.length === 0 && (
        <span className={s.emptyInfo}>{emptyInfo}</span>
      )}
      {filenames.map((filename) => (
        <Fragment key={filename}>
          <div className={s.imageWrapper}>
            <Image
              src={pathImage === "" ? filename : `${pathImage}/sm/${filename}`}
              width={150}
              height={150}
              alt="Image de l'item"
              unoptimized={true}
              className={s.image}
            />
            {onDelete && (
              <button
                onClick={() => onDelete(filename)}
                className="iconButton"
                aria-label="Supprimer"
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
