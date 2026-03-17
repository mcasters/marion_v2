"use client";

import Modal from "@/components/admin/common/modal.tsx";
import React from "react";
import useModal from "@/components/hooks/useModal.ts";

interface Props {
  renderForm: (arg0: () => void) => React.ReactNode;
}
export default function AddButton({ renderForm }: Props) {
  const { isOpen, toggle } = useModal();

  return (
    <>
      <button onClick={toggle} className="adminButton">
        Ajouter
      </button>
      <Modal isOpen={isOpen} title={`Ajout`}>
        {renderForm(toggle)}
      </Modal>
    </>
  );
}
