"use client";

import { HomeLayout, Image } from "@/lib/type";
import { useEffect, useMemo, useState } from "react";
import { useMetaContext } from "@/app/context/metaProvider";
import { getHomeLayout } from "@/lib/utils/commonUtils";
import useWindowRect from "@/components/hooks/useWindowRect.ts";
import { DEVICE } from "@/constants/image.ts";
import s from "@/components/image/slideshow/slider.module.css";
import ArrowPrev from "@/components/icons/arrowPrev.tsx";
import ArrowNext from "@/components/icons/arrowNext.tsx";
import NextImage from "next/image";

type Props = {
  images: Image[];
};

export default function Slideshow({ images }: Props) {
  const metas = useMetaContext();
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;
  const window = useWindowRect();
  const isSmall = window.innerWidth < DEVICE.SMALL;
  const needPortrait = window.innerWidth / window.innerHeight < 0.98;
  const [active, setActive] = useState(0);
  const imagesToDisplay = useMemo(() => {
    return needPortrait
      ? images.filter((i) => i.isMain)
      : images.filter((i) => !i.isMain);
  }, [needPortrait, images]);

  useEffect(() => {
    if (imagesToDisplay.length > 0) {
      const interval = setInterval(() => {
        onNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imagesToDisplay]);

  const onPrev = () =>
    setActive((active) => Math.abs((active - 1) % imagesToDisplay.length));

  const onNext = () =>
    setActive((active) => (active + 1) % imagesToDisplay.length);

  return (
    <div className={s.slideContainer}>
      {imagesToDisplay.map((image, index) => (
        <NextImage
          key={image.filename}
          alt="Image d'accueil"
          src={`/images/miscellaneous${isSmall ? "/md/" : "/"}${image.filename}`}
          width={image.width}
          height={image.height}
          className={`${isPlainHomeLayout ? s.plainSlide : s.slide} ${active === index ? s.active : ""}`}
          loading="eager"
          priority={index < 1}
          unoptimized
        />
      ))}
      {!isSmall && imagesToDisplay.length > 1 && (
        <>
          <button
            className={`${s.prev} iconButton`}
            onClick={onPrev}
            aria-label="Image précédente"
            title="Image précédente"
          >
            <ArrowPrev width={60} height={60} />
          </button>
          <button
            className={`${s.next} iconButton`}
            onClick={onNext}
            aria-label="Image suivante"
            title="Image suivante"
          >
            <ArrowNext width={60} height={60} />
          </button>
        </>
      )}
    </div>
  );
}
