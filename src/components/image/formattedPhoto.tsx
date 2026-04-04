"use client";

import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/image/lightbox/lightbox.tsx";
import useWindowRect from "@/components/hooks/useWindowRect.ts";
import { DEVICE } from "@/constants/image.ts";

interface Props {
  folder: string;
  filename: string;
  width: number;
  height: number;
  alt: string;
  priority: boolean;
  displayWidth: { small: number; large: number };
  displayHeight: { small: number; large: number };
  withLightbox?: boolean;
}
export default function FormattedPhoto({
  folder,
  filename,
  width,
  height,
  alt,
  priority,
  displayWidth,
  displayHeight,
  withLightbox = false,
}: Props) {
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const [index, setIndex] = useState(-1);
  const ratio = Math.round((width / height) * 10000);
  const isLandscape = ratio >= 10300;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Image
          src={
            isSmall
              ? `/images/${folder}/sm/${filename}`
              : `/images/${folder}/md/${filename}`
          }
          width={width}
          height={height}
          priority={priority}
          style={{
            objectFit: "contain",
            width: isLandscape
              ? `${isSmall ? displayWidth.small : displayWidth.large}vw`
              : "auto",
            height: !isLandscape
              ? `${isSmall ? displayHeight.small : displayHeight.large}vh`
              : "auto",
            cursor: withLightbox ? "pointer" : undefined,
            margin: "auto",
          }}
          alt={alt}
          unoptimized
          onClick={() => setIndex(0)}
          title={withLightbox ? "Agrandir" : ""}
        />
      </div>
      {withLightbox && (
        <Lightbox
          enhancedImages={[
            {
              src: isSmall
                ? `/images/${folder}/md/${filename}`
                : `/images/${folder}/${filename}`,
              width,
              height,
              alt,
            },
          ]}
          index={index}
          onClose={() => setIndex(-1)}
          isSmall={isSmall}
        />
      )}
    </>
  );
}
