"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function useElementIsUpTo(yLimit: number) {
  const [isUpTo, setIsUpTo] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (ref && ref.current) {
      const currentIsUpTo =
        ref.current.getBoundingClientRect().bottom <= yLimit;

      if (currentIsUpTo !== isUpTo) {
        setIsUpTo(currentIsUpTo);
      }
    }
  }, [isUpTo, ref, yLimit]);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { isUpTo, ref };
}

export default useElementIsUpTo;
