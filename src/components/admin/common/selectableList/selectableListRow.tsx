"use client";

import Image from "next/image";

import DeleteButton from "@/components/admin/common/button/deleteButton.tsx";
import s from "@/components/admin/common/selectableList/adminList.module.css";
import React from "react";

interface Props {
  part1: string;
  part2: string;
  part3?: string;
  part4?: string;
  imageSrc: string;
  deleteAction?: () => Promise<{
    message: string;
    isError: boolean;
  }>;
}

export default function SelectableListRow({
  part1,
  part2,
  part3,
  part4,
  imageSrc,
  deleteAction,
}: Props) {
  return (
    <>
      <span className={s.part1}>{part1}</span>
      <span className={s.part2}>{part2}</span>
      {part3 && <span className={s.part3}>{part3}</span>}
      {part4 && <span className={s.part4}>{part4}</span>}
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
        <DeleteButton action={deleteAction} disabled={!deleteAction} />
      </span>
    </>
  );
}
