"use client";

import React from "react";
import DeleteIcon from "@/components/icons/deleteIcon";
import { useAlert } from "@/app/context/alertProvider";

export type DeleteButtonProps = {
  action: () => Promise<{
    message: string;
    isError: boolean;
  }>;
  disabled?: boolean;
};
export default function DeleteButton({ action, disabled }: DeleteButtonProps) {
  const alert = useAlert();

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        if (confirm("Sûr de vouloir supprimé ?")) {
          const res = await action();
          alert(res.message, res.isError);
        }
      }}
      className="iconButton"
      aria-label="Supprimer"
      disabled={disabled ? disabled : false}
    >
      <DeleteIcon />
    </button>
  );
}
