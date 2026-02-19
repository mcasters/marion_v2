"use client";

import { HomeLayout, PhotoTab } from "@/lib/type";
import { useMemo } from "react";
import { useMetas } from "@/app/context/metaProvider";
import { getHomeLayout } from "@/lib/utils/commonUtils";
import useWindowRect from "@/components/hooks/useWindowRect.ts";
import { DEVICE } from "@/constants/image.ts";
import Slides from "@/components/image/slideshow/slides.tsx";

type Props = {
  portraitPhotos: PhotoTab;
  landscapePhotos: PhotoTab;
};

export default function Slideshow({ portraitPhotos, landscapePhotos }: Props) {
  const metas = useMetas();
  const isPlainHomeLayout = getHomeLayout(metas) === HomeLayout.PLAIN;
  const window = useWindowRect();
  const isSmall = window.innerWidth < DEVICE.SMALL;
  const needPortrait = window.innerWidth / window.innerHeight < 0.98;
  const photos = useMemo(() => {
    return needPortrait
      ? isSmall
        ? portraitPhotos.md
        : portraitPhotos.lg
      : isSmall
        ? landscapePhotos.md
        : landscapePhotos.lg;
  }, [portraitPhotos, landscapePhotos, needPortrait, isSmall]);

  return (
    <Slides
      photos={photos}
      isPlainHomeLayout={isPlainHomeLayout}
      isSmall={isSmall}
    />
  );
}
