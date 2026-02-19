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
  disabled,
}: Props) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className={`${classname ? classname : ""} adminButton`}
      disabled={disabled ? disabled : false}
    >
      {text ? text : "Annuler"}
    </button>
  );
}
