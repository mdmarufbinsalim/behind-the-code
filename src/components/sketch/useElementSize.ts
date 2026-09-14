"use client";

import { useEffect, useRef, useState } from "react";

export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // offsetWidth/Height, not getBoundingClientRect: the rect reports the
    // *transformed* box, so measuring inside something Framer is scaling (a
    // card on hover, a figure morphing open into the lightbox) captures a
    // mid-animation size and draws the border at the wrong scale.
    const measure = () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height }
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();

    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
