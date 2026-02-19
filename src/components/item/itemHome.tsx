"use client";

import { Category, Type } from "@/lib/type";
import React from "react";
import s from "@/components/item/itemHome.module.css";
import Image from "next/image";
import Link from "next/link";

interface Props {
  type: Type;
  categories: Category[];
  years: number[];
}
export default function ItemHome({ categories, type, years }: Props) {
  return (
    <>
      <p className={`${s.tagTitle}`}>Par séries :</p>
      <ul className={s.ul}>
        {categories.map((category) => {
          const content = category.content;
          const noImage =
            category.key === "no-category" || content.image.filename === "";
          return (
            <li key={category.key}>
              <Link
                href={`${type}s/${category.key}`}
                className={`${s.link} ${s.categoryLink}`}
                title={`Catégorie ${category.value}`}
              >
                {!noImage && (
                  <>
                    <Image
                      src={`/images/${type}/sm/${content.image.filename}`}
                      width={content.image.width}
                      height={content.image.height}
                      alt=""
                      style={{
                        objectFit: "cover",
                      }}
                      priority
                      unoptimized
                      className={s.image}
                    />
                    <p>{category.value}</p>
                  </>
                )}
                {noImage && <>{category.value}</>}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className={`${s.tagTitle}`}>Par années :</p>
      <ul className={s.ul}>
        {years.map((year) => {
          return (
            <li key={year}>
              <Link
                href={`${type}s/annee/${year}`}
                className={`${s.link} ${s.yearLink}`}
                title={`Année ${year}`}
              >
                {year}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
