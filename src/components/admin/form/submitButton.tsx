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
      disabled={disabled ? disabled : false}
      type="submit"
      className={`${classname ? classname : ""} adminButton`}
    >
      {text ? text : "Enregistrer"}
    </button>
  );
}
