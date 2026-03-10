"use client";

import React from "react";

interface Props {
  onCancel: () => void;
  text?: string;
  classname?: string;
  disabled?: boolean;
}

export default function CancelButton({
  onCancel,
  text,
  classname,
  disabled = false,
}: Props) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className={`${classname ? classname : ""} adminButton`}
      disabled={disabled}
      style={{
        cursor: disabled ? "unset" : "pointer",
      }}
    >
      {text ? text : "Annuler"}
    </button>
  );
}
