"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useElementSize } from "./useElementSize";

export function SketchBox({
  children,
  className = "",
  strokeWidth = 2,
  padding = 3,
  animate = true,
}: {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
  padding?: number;
  animate?: boolean;
}) {
  const { ref, size } = useElementSize<HTMLDivElement>();
  const jitter = useMemo(() => Array.from({ length: 4 }, () => [Math.random() - 0.5, Math.random() - 0.5]), []);

  const path = useMemo(() => {
    if (size.width < 4 || size.height < 4) return "";
    const x0 = padding;
    const y0 = padding;
    const x1 = size.width - padding;
    const y1 = size.height - padding;
    const j = jitter.map(([jx, jy]) => [jx * 3, jy * 3]);

    const corners = [
      [x0 + j[0][0], y0 + j[0][1]],
      [x1 + j[1][0], y0 + j[1][1]],
      [x1 + j[2][0], y1 + j[2][1]],
      [x0 + j[3][0], y1 + j[3][1]],
    ];

    return `M ${corners[0][0]} ${corners[0][1]} L ${corners[1][0]} ${corners[1][1]} L ${corners[2][0]} ${corners[2][1]} L ${corners[3][0]} ${corners[3][1]} Z`;
  }, [size, padding, jitter]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {path &&
          (animate ? (
            <motion.path
              d={path}
              stroke="#0a0a0a"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          ) : (
            <path
              d={path}
              stroke="#0a0a0a"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
