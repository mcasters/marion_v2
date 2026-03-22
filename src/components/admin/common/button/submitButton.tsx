"use client";

import React from "react";

interface Props {
  disabled?: boolean;
}

export default function SubmitButton({ disabled }: Props) {
  return (
    <button
      className="adminButton"
      type="submit"
      disabled={disabled !== undefined ? disabled : false}
      style={{
        outline:
          disabled !== undefined && !disabled
            ? "2px solid var(--color-main)"
            : undefined,
      }}
    >
      Enregistrer
    </button>
  );
}
