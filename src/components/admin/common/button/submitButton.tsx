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
      style={{
        cursor: disabled ? "unset" : "pointer",
      }}
    >
      {text ? text : "Enregistrer"}
    </button>
  );
}
