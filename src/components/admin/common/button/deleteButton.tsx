"use client";

import React from "react";
import DeleteIcon from "@/components/icons/deleteIcon.tsx";
import { useAlert } from "@/app/context/alertProvider.tsx";

export type DeleteButtonProps = {
  action?: () => Promise<{
    message: string;
    isError: boolean;
  }>;
  disabled?: boolean;
};
export default function DeleteButton({
  action,
  disabled = false,
}: DeleteButtonProps) {
  const alert = useAlert();

  return (
    <button
      onClick={
        action
          ? async (e) => {
              e.preventDefault();
              if (confirm("Sûr de vouloir supprimer ?")) {
                const res = await action();
                alert(res.message, res.isError);
              }
            }
          : undefined
      }
      className="iconButton"
      title={`${disabled ? "Ne peut pas être supprimé" : "supprimer"}`}
      disabled={disabled}
      style={{
        cursor: disabled ? "unset" : "pointer",
      }}
    >
      <DeleteIcon />
    </button>
  );
}
