import { RefObject, useEffect, useRef } from "react";

export const useClickOutside = (
  handler: () => void
): RefObject<HTMLElement> => {
  const domNodeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!domNodeRef?.current?.contains(event.target as Element)) {
        handler();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
  return domNodeRef;
};
