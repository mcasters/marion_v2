"use client";

import React, { useState } from "react";
import s from "@/components/admin/admin.module.css";
import Image from "next/image";
import { Image as IImage, Type } from "@/lib/type";
import { getEmptyImage } from "@/lib/utils/commonUtils";

type Props = {
  itemsImages: IImage[];
  selectedImage: IImage;
  onChange: (image: IImage) => void;
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
};

export default function SelectImageList({
  itemsImages,
  selectedImage,
  onChange,
  type,
}: Props) {
  const [filename, setFilename] = useState<string>(selectedImage.filename);

  const onSelectImage = (image: IImage) => {
    setFilename(image.filename);
    onChange(image);
  };

  return (
    <>
      <label className={s.label}>Image de la catégorie (facultative)</label>
      <div className={s.selectList}>
        <div
          onClick={() => onSelectImage(getEmptyImage())}
          className={`${s.option} ${filename === "" ? "selected" : undefined}`}
        >
          -- Aucune image --
        </div>
        {itemsImages.length > 0 &&
          itemsImages.map((image: IImage) => {
            const isCategoryImage = image.filename === filename;
            return (
              <div
                key={image.filename}
                className={
                  isCategoryImage ? `${s.selectedOption} selected` : s.option
                }
                onClick={() => onSelectImage(image)}
              >
                <Image
                  src={`/images/${type}/sm/${image.filename}`}
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
      Les images sont ici tronquées au carré, comme elles sont affichées dans la
      pastille de la catégorie.
    </>
  );
}
