"use client";

import React from "react";
import DeleteIcon from "@/components/icons/deleteIcon.tsx";
import { useAlert } from "@/app/context/alertProvider.tsx";

export type DeleteButtonProps = {
  action?: () => Promise<{
    message: string;
    isError: boolean;
  }>;
};
export default function DeleteButton({ action }: DeleteButtonProps) {
  const alert = useAlert();

  return (
    <button
      onClick={
        action
          ? async (e) => {
              e.preventDefault();
              if (confirm("Sûr de vouloir supprimé ?")) {
                const res = await action();
                alert(res.message, res.isError);
              }
            }
          : undefined
      }
      className="iconButton"
      aria-label="Supprimer"
      disabled={!action}
    >
      <DeleteIcon />
    </button>
  );
}
