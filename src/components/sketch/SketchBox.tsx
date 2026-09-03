"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import rough from "roughjs";
import { useElementSize } from "./useElementSize";
import { roughDefaults, randomSeed } from "./roughDefaults";

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
  const seed = useMemo(randomSeed, []);
  const generator = useMemo(() => rough.generator(), []);

  const path = useMemo(() => {
    if (size.width < 4 || size.height < 4) return "";
    const w = size.width - padding * 2;
    const h = size.height - padding * 2;
    const rect = generator.rectangle(padding, padding, w, h, {
      ...roughDefaults,
      strokeWidth,
      seed,
    });
    return generator.toPaths(rect);
  }, [size, padding, strokeWidth, seed, generator]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {typeof path === "string"
          ? null
          : path.map((p, i) =>
              animate ? (
                <motion.path
                  key={i}
                  d={p.d}
                  stroke={p.stroke}
                  strokeWidth={p.strokeWidth}
                  fill={p.fill === "none" ? "none" : p.fill}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: "easeInOut" }}
                />
              ) : (
                <path
                  key={i}
                  d={p.d}
                  stroke={p.stroke}
                  strokeWidth={p.strokeWidth}
                  fill={p.fill === "none" ? "none" : p.fill}
                />
              )
            )}
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
