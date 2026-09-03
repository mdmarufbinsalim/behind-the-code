"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import rough from "roughjs";
import { useElementSize } from "./useElementSize";
import { roughDefaults, randomSeed } from "./roughDefaults";

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
  const seed = useMemo(randomSeed, []);
  const generator = useMemo(() => rough.generator(), []);

  const path = useMemo(() => {
    if (size.width < 4 || size.height < 4) return [];
    const w = size.width + paddingX * 2;
    const h = size.height + paddingY * 2;
    const cx = w / 2;
    const cy = h / 2;
    const ellipse = generator.ellipse(cx, cy, w, h * 1.15, {
      ...roughDefaults,
      strokeWidth,
      seed,
      roughness: 2.2,
      curveFitting: 0.9,
    });
    return generator.toPaths(ellipse);
  }, [size, paddingX, paddingY, strokeWidth, seed, generator]);

  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        className="pointer-events-none absolute overflow-visible"
        style={{
          left: -paddingX,
          top: -paddingY,
          width: size.width + paddingX * 2,
          height: size.height + paddingY * 2,
        }}
        aria-hidden="true"
      >
        {path.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <span ref={ref} className="relative">
        {children}
      </span>
    </span>
  );
}
