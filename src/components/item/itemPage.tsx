"use client";

import { Category, ItemDarkBackground, Layout, Type, Work } from "@/lib/type";
import React from "react";
import s from "@/components/item/itemsPage.module.css";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { getWorkLayout } from "@/lib/utils/commonUtils.ts";
import ItemLayout from "@/components/item/itemLayout.tsx";
import { getPhotoTabEnhanced } from "@/lib/utils/imageUtils.ts";
import { KEY_META } from "@/constants/admin.ts";
import Gallery from "@/components/image/gallery/gallery.tsx";

interface Props {
  tag: string;
  works: Work[];
  category?: Category;
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
}
export default function ItemPage({ tag, works, category, type }: Props) {
  const metas = useMetas();
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const photosEnhanced =
    itemLayout === Layout.MULTIPLE
      ? getPhotoTabEnhanced(
          works,
          `${works[0].title} - ${type} de ${metas.get(KEY_META.SITE_TITLE)}`,
        )
      : undefined;

  return (
    <>
      <div className={s.infoCategory}>
        <h2 className={s.tagTitle}>{tag}</h2>
        {category &&
          (category.content.title !== "" || category.content.text !== "") && (
            <div className={s.categoryContent}>
              <h3>{category.content.title}</h3>
              <br />
              <p>{category.content.text}</p>
            </div>
          )}
      </div>
      <div
        className={`${s.content} ${itemLayout === Layout.DOUBLE ? s.doubleContent : undefined} ${itemDarkBackground === ItemDarkBackground.TRUE ? s.darkBackground : ""}`}
      >
        {photosEnhanced && <Gallery photos={photosEnhanced} />}
        {itemLayout !== Layout.MULTIPLE &&
          works.map((item, i) => (
            <ItemLayout
              key={i}
              layout={itemLayout}
              item={item}
              priority={i < 2}
            />
          ))}
      </div>
    </>
  );
}
