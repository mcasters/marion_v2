"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import Image from "next/image";
import { TYPE } from "@/db/schema.ts";

type Props = {
  filenames: string[];
  categoryFilename: string;
  onChange: (filename: string) => void;
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
};

export default function SelectImageList({
  filenames,
  categoryFilename,
  onChange,
  type,
}: Props) {
  const [selectedFilename, setSelectedFilename] =
    useState<string>(categoryFilename);
  const isEmpty = filenames.length === 1 && filenames[0] === "";

  const onSelectFilename = (filename: string) => {
    setSelectedFilename(filename);
    onChange(filename);
  };

  return (
    <div className="inputContainer">
      <span className="label">Image de la catégorie (facultative)</span>
      <div className={s.selectList}>
        <div
          onClick={() => onSelectFilename("")}
          className={
            selectedFilename === "" ? `${s.selectedOption} selected` : s.option
          }
        >
          -- Aucune image --
        </div>
        {!isEmpty &&
          filenames.map((filename: string) => {
            return (
              <div
                key={filename}
                className={
                  selectedFilename === filename
                    ? `${s.selectedOption} selected`
                    : s.option
                }
                onClick={() => onSelectFilename(filename)}
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
