"use client";

import React from "react";

interface Props {
  disabled?: boolean;
  text?: string;
  classname?: string;
}

export default function SubmitButton({
  disabled = false,
  text,
  classname,
}: Props) {
  return (
    <button
      className={`${classname ? classname : ""} adminButton`}
      type="submit"
      disabled={disabled}
      autoFocus={!disabled}
      style={{
        cursor: disabled ? "unset" : "pointer",
        outline: !disabled ? "2px solid #b9b9b9" : undefined,
        border: !disabled ? "2px solid #fff" : undefined,
      }}
    >
      {text ? text : "Enregistrer"}
    </button>
  );
}
