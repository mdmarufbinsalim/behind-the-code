"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useElementSize } from "./useElementSize";

type Point = [number, number];

function catmullRomLoop(points: Point[]): string {
  const n = points.length;
  let d = `M ${points[0][0]} ${points[0][1]} `;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]} `;
  }
  return d + "Z";
}

export function SketchCircle({
  children,
  className = "",
  strokeWidth = 2.5,
  paddingX = 14,
  paddingY = 10,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  strokeWidth?: number;
  paddingX?: number;
  paddingY?: number;
  delay?: number;
}) {
  const { ref, size } = useElementSize<HTMLSpanElement>();
  const jitter = useMemo(
    () => Array.from({ length: 16 }, () => 0.985 + Math.random() * 0.03),
    []
  );

  const path = useMemo(() => {
    if (size.width < 4 || size.height < 4) return "";
    const w = size.width + paddingX * 2;
    const h = (size.height + paddingY * 2) * 1.1;
    const cx = w / 2;
    const cy = h / 2;
    const rx = w / 2;
    const ry = h / 2;

    const points: Point[] = jitter.map((j, i) => {
      const angle = (i / jitter.length) * Math.PI * 2 - Math.PI / 2;
      return [cx + Math.cos(angle) * rx * j, cy + Math.sin(angle) * ry * j];
    });

    return catmullRomLoop(points);
  }, [size, paddingX, paddingY, jitter]);

  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        className="pointer-events-none absolute overflow-visible"
        style={{
          left: -paddingX,
          top: -paddingY * 1.1,
          width: size.width + paddingX * 2,
          height: (size.height + paddingY * 2) * 1.1,
        }}
        aria-hidden="true"
      >
        {path && (
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
            transition={{ duration: 0.7, delay, ease: "easeInOut" }}
          />
        )}
      </svg>
      <span ref={ref} className="relative">
        {children}
      </span>
    </span>
  );
}
