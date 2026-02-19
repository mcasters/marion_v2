"use client";

import s from "./itemLayout.module.css";
import { Layout, Work } from "@/lib/type.ts";
import React, { useMemo, useState } from "react";
import { getItemPhotoTab } from "@/lib/utils/imageUtils.ts";
import { useMetas } from "@/app/context/metaProvider.tsx";
import ImageInfos from "@/components/image/common/imageInfos.tsx";
import Lightbox from "@/components/image/lightbox/lightbox.tsx";
import { META } from "@/constants/admin.ts";
import Image from "next/image";
import { DEVICE, IMAGE_INFO } from "@/constants/image.ts";
import useWindowRect from "@/components/hooks/useWindowRect.ts";

interface Props {
  item: Work;
  layout: Layout.MONO | Layout.DOUBLE | Layout.SCULPTURE;
  priority: boolean;
}
export default function ItemLayout({ item, layout, priority }: Props) {
  const metas = useMetas();
  const isSmall = useWindowRect().innerWidth < DEVICE.SMALL;
  const [index, setIndex] = useState(-1);
  const photoTab = useMemo(
    () =>
      getItemPhotoTab(
        item,
        `${item.title} - ${item.type} de ${metas.get(META.SITE_TITLE)}`,
      ),
    [item],
  );
  const photos = isSmall ? photoTab.sm : photoTab.md;
  const _width = isSmall
    ? IMAGE_INFO[layout].WIDTH.small
    : IMAGE_INFO[layout].WIDTH.large;
  const _height = isSmall
    ? IMAGE_INFO[layout].HEIGHT.small
    : IMAGE_INFO[layout].HEIGHT.large;

  return (
    <article
      className={`${s.article} ${
        layout === Layout.MONO ? s.monoContainer : undefined
      }`}
    >
      <figure
        className={
          layout === Layout.SCULPTURE ? s.sculptureContainer : undefined
        }
      >
        {photos.map((p, index) => {
          const isLandscape = p.width / p.height >= 1.03;
          const onLeft = Layout.SCULPTURE && index % 2 === 0;
          return (
            <Image
              key={index}
              src={p.src}
              width={p.width}
              height={p.height}
              priority={priority}
              style={{
                width: isLandscape ? `${_width}vw` : "auto",
                height: !isLandscape ? `${_height}vh` : "auto",
              }}
              alt={p.alt}
              unoptimized
              onClick={() => setIndex(index)}
              className={
                layout === Layout.SCULPTURE
                  ? onLeft
                    ? s.left
                    : s.right
                  : s.image
              }
              title="Agrandir"
            />
          );
        })}
        <Lightbox
          photos={isSmall ? photoTab.md : photoTab.lg}
          index={index}
          onClose={() => setIndex(-1)}
          isSmall={isSmall}
        />
      </figure>
      <figcaption>
        <ImageInfos item={item} isMono={layout === Layout.MONO} />
      </figcaption>
    </article>
  );
}
