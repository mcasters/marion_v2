"use client";

import { useState } from "react";

const useListSelection = <T>(list: T[]) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const decrease = () => {
    setSelectedIndex(selectedIndex !== 0 ? selectedIndex - 1 : list.length - 1);
  };

  const increase = () => {
    setSelectedIndex(selectedIndex !== list.length - 1 ? selectedIndex + 1 : 0);
  };

  return { selectedIndex, decrease, increase, setSelectedIndex };
};

export default useListSelection;
