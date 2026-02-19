"use client";

import { Photo } from "@/lib/type";
import { useEffect, useState } from "react";
import Image from "next/image";
import s from "@/components/image/slideshow/slider.module.css";
import ArrowPrev from "@/components/icons/arrowPrev.tsx";
import ArrowNext from "@/components/icons/arrowNext.tsx";

type Props = {
  photos: Photo[];
  isSmall: boolean;
  isPlainHomeLayout: boolean;
};

export default function Slides({ photos, isSmall, isPlainHomeLayout }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length > 0) {
      const interval = setInterval(() => {
        onNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [photos]);

  const onPrev = () =>
    setActive((active) => Math.abs((active - 1) % photos.length));

  const onNext = () => setActive((active) => (active + 1) % photos.length);

  return photos.map((photo, index) => (
    <div key={index}>
      <Image
        alt={photo.alt}
        src={photo.src}
        width={photo.width}
        height={photo.height}
        className={`${isPlainHomeLayout ? s.plainSlide : s.slide} ${active === index ? s.active : ""}`}
        loading="eager"
        priority={index < 1}
        unoptimized
      />
      {!isSmall && photos.length > 0 && (
        <>
          <button
            className={`${s.prev} iconButton`}
            onClick={onPrev}
            aria-label="Image précédente"
            title="Image précédente"
          >
            <ArrowPrev />
          </button>
          <button
            className={`${s.next} iconButton`}
            onClick={onNext}
            aria-label="Image suivante"
            title="Image suivante"
          >
            <ArrowNext />
          </button>
        </>
      )}
    </div>
  ));
}
