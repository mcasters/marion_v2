"use client";

import { useRef, useState } from "react";

export default function useModal() {
  const isOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(isOpenRef.current);

  const toggle = () => {
    isOpenRef.current = !isOpenRef.current;
    setIsOpen(isOpenRef.current);
  };

  return { isOpen, toggle };
}
