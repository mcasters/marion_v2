"use client";

import React from "react";

interface Props {
  disabled?: boolean;
  text?: string;
  classname?: string;
}

export default function SubmitButton({ disabled, text, classname }: Props) {
  return (
    <button
      className={`${classname ? classname : ""} adminButton`}
      type="submit"
      disabled={disabled !== undefined ? disabled : false}
      style={{
        cursor: disabled !== undefined && disabled ? "unset" : "pointer",
        outline:
          disabled !== undefined && !disabled
            ? "2px solid var(--color-main)"
            : undefined,
        border:
          disabled !== undefined && !disabled ? "2px solid #fff" : undefined,
      }}
    >
      {text ? text : "Enregistrer"}
    </button>
  );
}
