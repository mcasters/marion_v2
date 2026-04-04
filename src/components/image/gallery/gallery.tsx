"use client";

import React, { useMemo, useState } from "react";
import { EnhancedImage, Post, Work } from "@/lib/type";
import s from "./gallery.module.css";
import Image from "next/image";
import Lightbox from "@/components/image/lightbox/lightbox";
import useWindowRect from "@/components/hooks/useWindowRect.ts";
import { DEVICE } from "@/constants/image.ts";
import { useMetaContext } from "@/app/context/metaProvider.tsx";
import { KEY_META } from "@/constants/admin.ts";
import { getEnhancedImages } from "@/lib/utils/imageUtils.ts";

interface Props {
  items: Work[] | Post[];
}

export default function Gallery({ items }: Props) {
  const metas = useMetaContext();
  const [index, setIndex] = useState(-1);
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const enhancedImages: EnhancedImage[] = useMemo(() => {
    return getEnhancedImages(items, isSmall, metas.get(KEY_META.OWNER));
  }, [items, isSmall]);

  return (
    <>
      <div className={s.container}>
        {enhancedImages.map((image, i) => {
          return (
            <Image
              key={i}
              src={image.littleScr!}
              alt={image.alt}
              width={image.width}
              height={image.height}
              unoptimized
              className={`${s.image}`}
              onClick={() => setIndex(i)}
              title="Agrandir"
              loading={i < 10 ? "eager" : undefined}
            />
          );
        })}
      </div>
      <Lightbox
        enhancedImages={enhancedImages}
        index={index}
        onClose={() => setIndex(-1)}
        isSmall={isSmall}
      />
    </>
  );
}
