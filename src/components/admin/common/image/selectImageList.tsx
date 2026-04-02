"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import Image from "next/image";
import { TYPE } from "@/db/schema.ts";

type Props = {
  filenames: string[];
  selectedFilename: string;
  onChange: (filename: string) => void;
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
};

export default function SelectImageList({
  filenames,
  selectedFilename,
  onChange,
  type,
}: Props) {
  const [filename, setFilename] = useState<string>(selectedFilename);
  const isEmpty = filenames.length === 1 && filenames[0] === "";

  const onSelectImage = (filename: string) => {
    setFilename(filename);
    onChange(filename);
  };

  return (
    <div className="inputContainer">
      <span className="label">Image de la catégorie (facultative)</span>
      <div className={s.selectList}>
        <div
          onClick={() => onSelectImage("")}
          className={`${s.option} ${filename === "" ? "selected" : undefined}`}
        >
          -- Aucune image --
        </div>
        {!isEmpty &&
          filenames.map((filename: string) => {
            const isCategoryImage = filename === filename;
            return (
              <div
                key={filename}
                className={
                  isCategoryImage ? `${s.selectedOption} selected` : s.option
                }
                onClick={() => onSelectImage(filename)}
              >
                <Image
                  src={`/images/${type}/sm/${filename}`}
                  width={120}
                  height={120}
                  alt="Image de l'item"
                  style={{
                    objectFit: "cover",
                    verticalAlign: "top",
                  }}
                  unoptimized
                />
              </div>
            );
          })}
      </div>
      {!isEmpty && (
        <p>
          Les images sont ici tronquées au carré, comme elles sont affichées
          dans la pastille de la catégorie.
        </p>
      )}
    </div>
  );
}
