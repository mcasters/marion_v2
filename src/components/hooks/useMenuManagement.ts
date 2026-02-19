"use client";

import { useRef, useState } from "react";

const useMenuManagement = () => {
  const isOpenRef = useRef<number>(-1);
  const [indexOpen, setIndexOpen] = useState<number>(isOpenRef.current);

  const toggle = (index: number) => {
    isOpenRef.current = index;
    setIndexOpen(isOpenRef.current);
  };

  return { indexOpen, toggle };
};

export default useMenuManagement;
