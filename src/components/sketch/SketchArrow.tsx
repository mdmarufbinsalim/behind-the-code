"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import rough from "roughjs";
import { roughDefaults, randomSeed } from "./roughDefaults";

type RoughPath = { d: string; stroke?: string; strokeWidth?: number };

export function SketchArrow({
  className = "",
  width = 80,
  height = 60,
  direction = "down-right",
  delay = 0,
}: {
  className?: string;
  width?: number;
  height?: number;
  direction?: "down-right" | "down-left" | "right";
  delay?: number;
}) {
  const generator = useMemo(() => rough.generator(), []);
  const [paths, setPaths] = useState<RoughPath[]>([]);

  useEffect(() => {
    const opts = { ...roughDefaults, strokeWidth: 2.5, seed: randomSeed(), roughness: 2 };

    let start: [number, number];
    let end: [number, number];
    let head: [number, number][];

    if (direction === "right") {
      start = [4, height / 2];
      end = [width - 12, height / 2];
      head = [
        [width - 22, height / 2 - 10],
        [width - 4, height / 2],
        [width - 22, height / 2 + 10],
      ];
    } else if (direction === "down-left") {
      start = [width - 6, 6];
      end = [10, height - 12];
      head = [
        [10, height - 26],
        [4, height - 4],
        [26, height - 12],
      ];
    } else {
      start = [6, 6];
      end = [width - 10, height - 12];
      head = [
        [width - 24, height - 12],
        [width - 4, height - 4],
        [width - 12, height - 26],
      ];
    }

    const line = generator.line(start[0], start[1], end[0], end[1], opts);
    const headDrawable = generator.linearPath(head, opts);

    setPaths([...generator.toPaths(line), ...generator.toPaths(headDrawable)]);
  }, [width, height, direction, generator]);

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
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: delay + i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
