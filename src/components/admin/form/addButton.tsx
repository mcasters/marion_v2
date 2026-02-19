"use client";

import Modal from "@/components/admin/form/modal.tsx";
import { Category, Item, Type } from "@/lib/type";
import PostForm from "@/components/admin/form/item/postForm";
import WorkForm from "@/components/admin/form/item/workForm.tsx";
import React from "react";
import s from "@/components/admin/admin.module.css";
import CategoryForm from "@/components/admin/form/item/categoryForm";
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
          <WorkForm item={item} categories={categories} onClose={toggle} />
        )}
      </Modal>
    </>
  );
}
