"use client";

import { useEffect, useRef, useState } from "react";

const useOnClickOutside = (onClickOutside?: () => void) => {
  const [isOutside, setIsOutside] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (ref && ref.current) {
        if (ref.current.contains(e.target as Node)) {
          setIsOutside(false);
        } else {
          if (onClickOutside) onClickOutside();
          setIsOutside(true);
        }
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);

  return { ref, isOutside };
};

export default useOnClickOutside;
