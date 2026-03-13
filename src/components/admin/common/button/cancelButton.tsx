"use client";

import React from "react";

interface Props {
  onCancel: () => void;
  text?: string;
  disabled?: boolean;
}

export default function CancelButton({
  onCancel,
  text,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="adminButton"
      disabled={disabled}
      style={{
        cursor: disabled ? "unset" : "pointer",
      }}
    >
      {text ? text : "Annuler"}
    </button>
  );
}
