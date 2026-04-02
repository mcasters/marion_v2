"use client";

import { Category } from "@/lib/type";
import React from "react";
import s from "@/components/item/itemHome.module.css";
import Image from "next/image";
import Link from "next/link";
import { TYPE } from "@/db/schema.ts";

interface Props {
  type: TYPE;
  categories: Category[];
  years: number[];
}
export default function ItemHome({ categories, type, years }: Props) {
  return (
    <>
      <p className={`${s.tagTitle}`}>Par séries :</p>
      <ul className={s.ul}>
        {categories.map((category) => {
          const noImage =
            category.key === "no-category" || category.imageFilename === "";
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
                      src={`/images/${type}/sm/${category.imageFilename}`}
                      alt=""
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
