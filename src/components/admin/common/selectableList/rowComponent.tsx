"use client";

import Image from "next/image";

import DeleteButton from "@/components/admin/common/button/deleteButton.tsx";
import s from "@/components/admin/adminList.module.css";
import React from "react";
import { Admin } from "@/lib/type.ts";

interface Props<T extends Admin> {
  item: T;
  part1: string;
  part2: string;
  part3?: string;
  part4?: string;
  imageSrc: string;
  deleteAction: () => Promise<{
    message: string;
    isError: boolean;
  }>;
}

export default function RowComponent<T extends Admin>({
  item,
  part1,
  part2,
  part3,
  part4,
  imageSrc,
  deleteAction,
}: Props<T>) {
  return (
    <>
      <span className={s.itemTitle}>{part1}</span>
      <span className={s.itemInfo}>{part2}</span>
      {part3 && <span className={s.itemYear}>{part3}</span>}
      {part4 && <span className={s.itemYear}>{part4}</span>}
      <span className={s.itemImage}>
        {imageSrc !== "" && (
          <Image
            src={imageSrc}
            alt="Image principale de l'item"
            height={50}
            width={50}
            style={{
              objectFit: "contain",
            }}
            unoptimized
          />
        )}
      </span>
      <span className={s.itemIcon}>
        <DeleteButton action={deleteAction} disabled={!item.modifiable} />
      </span>
    </>
  );
}
