"use client";

import React, { useEffect } from "react";
import s from "./alertModal.module.css";
import CheckIcon from "@/components/icons/checkIcon.tsx";
import ErrorIcon from "@/components/icons/errorIcon.tsx";

type Props = {
  message: string;
  isError: boolean;
  time: number;
  onClose: () => void;
};

const errorStyles = {
  backgroundColor: "#f3d0d4",
};

const validStyles = {
  backgroundColor: "#c6eec4",
};

export default function AlertModal({ message, isError, time, onClose }: Props) {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, time);
  });

  return (
    <div className={s.alertOverlay} onClick={onClose}>
      <div className={s.alertBox} style={isError ? errorStyles : validStyles}>
        <div style={isError ? { color: "#fceaeb" } : { color: "#eafcea" }}>
          {isError ? <ErrorIcon /> : <CheckIcon />}
        </div>
        <div className={s.message}>{message}</div>
      </div>
    </div>
  );
}
