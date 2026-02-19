import { RefObject, useCallback, useEffect, useRef } from "react";

const useScrollListener = (
  element: RefObject<HTMLDivElement>,
  handleScroll: (e: Event) => void,
  throttle = 5000,
) => {
  const scrollingTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const listenToScroll = useCallback(
    (e: Event) => {
      element.current?.removeEventListener("scroll", listenToScroll); // unregister the event
      clearTimeout(scrollingTimer.current); // clear previous timeout instance
      scrollingTimer.current = setTimeout(
        () => element.current?.addEventListener("scroll", listenToScroll), // re-register the event after a certain time
        throttle,
      );
      handleScroll(e); // call the handler logic (this is asyncchronous and will not wait for the setTimeout to run!)
    },
    [throttle, element, handleScroll],
  );

  useEffect(() => {
    const currentElement = element.current;
    if (currentElement) {
      currentElement.addEventListener("scroll", listenToScroll);
    }
    return () => {
      currentElement?.removeEventListener("scroll", listenToScroll);
      clearTimeout(scrollingTimer.current);
    };
  }, [listenToScroll, element]);
};

export default useScrollListener;
