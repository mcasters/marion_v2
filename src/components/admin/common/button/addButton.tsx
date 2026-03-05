"use client";

import Modal from "@/components/admin/common/modal.tsx";
import React from "react";
import s from "@/components/admin/admin.module.css";
import useModal from "@/components/hooks/useModal.ts";

interface Props {
  renderForm: (arg0: () => void) => React.ReactNode;
}
export default function AddButton({ renderForm }: Props) {
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
      >
        Ajouter
      </button>
      <Modal isOpen={isOpen} title={`Ajout`}>
        {renderForm(toggle)}
      </Modal>
    </>
  );
}
