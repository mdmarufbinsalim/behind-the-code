"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import rough from "roughjs";
import { roughDefaults, randomSeed } from "./roughDefaults";

type RoughPath = { d: string; stroke?: string; strokeWidth?: number };

export function SketchUnderline({
  className = "",
  width = 240,
  height = 16,
  strokeWidth = 3,
  delay = 0,
}: {
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  delay?: number;
}) {
  const generator = useMemo(() => rough.generator(), []);
  const [paths, setPaths] = useState<RoughPath[]>([]);

  useEffect(() => {
    const midY = height / 2;
    const drawable = generator.line(2, midY, width - 2, midY, {
      ...roughDefaults,
      strokeWidth,
      seed: randomSeed(),
      roughness: 2.4,
      bowing: 3,
    });
    setPaths(generator.toPaths(drawable));
  }, [width, height, strokeWidth, generator]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: delay + i * 0.06, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
