"use client";

import { Category, ItemDarkBackground, Layout, Work } from "@/lib/type";
import React from "react";
import s from "@/components/item/itemsPage.module.css";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { getWorkLayout } from "@/lib/utils/commonUtils.ts";
import ItemLayout from "@/components/item/itemLayout.tsx";
import { getPhotoTabEnhanced } from "@/lib/utils/imageUtils.ts";
import { KEY_META } from "@/constants/admin.ts";
import Gallery from "@/components/image/gallery/gallery.tsx";
import { TYPE } from "@/db/schema.ts";

interface Props {
  tag: string;
  works: Work[];
  category?: Category;
  type: TYPE.PAINTING | TYPE.SCULPTURE | TYPE.DRAWING;
}
export default function ItemPage({ tag, works, category, type }: Props) {
  const metas = useMetas();
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const photosEnhanced =
    itemLayout === Layout.MULTIPLE
      ? getPhotoTabEnhanced(
          works,
          `${works[0].title} - ${type} de ${metas.get(KEY_META.OWNER)}`,
        )
      : undefined;

  return (
    <>
      <div className={s.infoCategory}>
        <h2 className={s.tagTitle}>{tag}</h2>
        {category && (category.title !== "" || category.text !== "") && (
          <div className={s.categoryContent}>
            <h3>{category.title}</h3>
            <br />
            <p>{category.text}</p>
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
