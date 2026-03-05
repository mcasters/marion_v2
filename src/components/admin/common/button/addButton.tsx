"use client";

import Modal from "@/components/admin/common/modal.tsx";
import { Category, Item, Type } from "@/lib/type.ts";
import PostForm from "@/components/admin/item/form/postForm.tsx";
import WorkForm from "@/components/admin/item/form/workForm.tsx";
import React from "react";
import s from "@/components/admin/admin.module.css";
import CategoryForm from "@/components/admin/item/form/categoryForm.tsx";
import useModal from "@/components/hooks/useModal.ts";

export type Props = {
  item: Item;
  categories?: Category[];
  disabled?: boolean;
};
export default function AddButton({ item, categories, disabled }: Props) {
  const { isOpen, toggle } = useModal();

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle();
        }}
        className={`${s.addButton} adminButton`}
        aria-label={"Ajout"}
        disabled={disabled ? disabled : false}
      >
        Ajouter
      </button>
      <Modal isOpen={isOpen} title={`Ajout de ${item.type}`}>
        {item.type === Type.CATEGORY ? (
          <CategoryForm category={item} onClose={toggle} />
        ) : item.type === Type.POST ? (
          <PostForm post={item} onClose={toggle} />
        ) : (
          <WorkForm work={item} categories={categories} onClose={toggle} />
        )}
      </Modal>
    </>
  );
}
