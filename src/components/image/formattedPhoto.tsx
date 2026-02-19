"use client";

import { PhotoTab } from "@/lib/type";
import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/image/lightbox/lightbox.tsx";
import useWindowRect from "@/components/hooks/useWindowRect.ts";
import { DEVICE } from "@/constants/image.ts";

interface Props {
  photoTab: PhotoTab;
  priority: boolean;
  width: { small: number; large: number };
  height: { small: number; large: number };
  withLightbox?: boolean;
}
export default function FormattedPhoto({
  photoTab,
  priority,
  width,
  height,
  withLightbox = false,
}: Props) {
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const [index, setIndex] = useState(-1);
  const photo = isSmall ? photoTab.sm[0] : photoTab.md[0];
  const ratio = Math.round((photo?.width / photo?.height) * 10000);
  const isLandscape = ratio >= 10300;

  if (photo)
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <Image
            src={photo.src}
            width={photo.width}
            height={photo.height}
            priority={priority}
            style={{
              objectFit: "contain",
              width: isLandscape
                ? `${isSmall ? width.small : width.large}vw`
                : "auto",
              height: !isLandscape
                ? `${isSmall ? height.small : height.large}vh`
                : "auto",
              cursor: withLightbox ? "pointer" : undefined,
              margin: "auto",
            }}
            alt={photo.alt}
            unoptimized
            onClick={() => setIndex(0)}
            title={withLightbox ? "Agrandir" : ""}
          />
        </div>
        {withLightbox && (
          <Lightbox
            photos={[isSmall ? photoTab.md[0] : photoTab.lg[0]]}
            index={index}
            onClose={() => setIndex(-1)}
            isSmall={isSmall}
          />
        )}
      </>
    );
}
