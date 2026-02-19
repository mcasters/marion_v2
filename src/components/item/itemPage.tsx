"use client";

import { Category, ItemDarkBackground, Layout, Type, Work } from "@/lib/type";
import React from "react";
import s from "@/components/item/itemsPage.module.css";
import { useMetas } from "@/app/context/metaProvider.tsx";
import { getWorkLayout } from "@/lib/utils/commonUtils.ts";
import ItemLayout from "@/components/item/itemLayout.tsx";
import { getItemsPhotoTabEnhanced } from "@/lib/utils/imageUtils.ts";
import { META } from "@/constants/admin.ts";
import Gallery from "@/components/image/gallery/gallery.tsx";

interface Props {
  tag: string;
  items: Work[];
  category?: Category;
  type: Type.PAINTING | Type.SCULPTURE | Type.DRAWING;
}
export default function ItemPage({ tag, items, category, type }: Props) {
  const metas = useMetas();
  const [itemLayout, itemDarkBackground] = getWorkLayout(metas, type);
  const photosEnhanced =
    itemLayout === Layout.MULTIPLE
      ? getItemsPhotoTabEnhanced(
          items,
          `${items[0].title} - ${type} de ${metas.get(META.SITE_TITLE)}`,
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
          items.map((item, i) => (
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
