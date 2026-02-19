"use client";

import { useEffect } from "react";

const useKeyboard = (
  targetKey: "ArrowUp" | "ArrowDown",
  onKeyDown: () => void,
  activated: boolean,
) => {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (activated && targetKey === e.key) {
        e.preventDefault();
        onKeyDown();
      }
    }
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [targetKey, onKeyDown]);
};

export default useKeyboard;
