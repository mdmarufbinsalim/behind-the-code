"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { SKETCH_STROKE } from "./stroke";

type Point = [number, number];

// A loose, hand-drawn scribble rectangle around the bounds — three overlapping
// passes with different jitter, like someone roughing in an outline before
// the "real" drawing (the actual image) settles into place underneath.
function scribbleRect(w: number, h: number, seed: number): string {
  const pad = 6;
  const corners: Point[] = [
    [pad, pad],
    [w - pad, pad],
    [w - pad, h - pad],
    [pad, h - pad],
    [pad, pad],
  ];
  const rand = (n: number) => Math.sin(seed * 999 + n * 57) * 0.5 + 0.5;
  let d = `M ${corners[0][0]} ${corners[0][1]} `;
  for (let i = 0; i < corners.length - 1; i++) {
    const [x1, y1] = corners[i];
    const [x2, y2] = corners[i + 1];
    const midx = (x1 + x2) / 2 + (rand(i) - 0.5) * 14;
    const midy = (y1 + y2) / 2 + (rand(i + 10) - 0.5) * 14;
    d += `Q ${midx} ${midy}, ${x2} ${y2} `;
  }
  return d;
}

const STROKE_DURATION = 0.9;
const STROKE_STAGGER = 0.12;

export function SketchReveal({
  children,
  width,
  height,
  delay = 0,
  triggerOnView = false,
  once = true,
  className = "",
}: {
  children: ReactNode;
  width: number;
  height: number;
  delay?: number;
  triggerOnView?: boolean;
  once?: boolean;
  className?: string;
}) {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    setPaths([1, 2, 3].map((seed) => scribbleRect(width, height, seed)));
  }, [width, height]);

  const imageDelay = delay + STROKE_STAGGER * 2 + STROKE_DURATION * 0.55;

  const imageVariants: Variants = {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      transition: {
        opacity: { duration: 0.3, delay: imageDelay },
        clipPath: { duration: 0.9, delay: imageDelay, ease: "easeInOut" },
      },
    },
  };

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0.9 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: [0.9, 0.9, 0],
      transition: {
        pathLength: {
          duration: STROKE_DURATION,
          delay: delay + i * STROKE_STAGGER,
          ease: "easeInOut",
        },
        opacity: {
          duration: STROKE_DURATION + 0.5,
          delay: delay + i * STROKE_STAGGER,
          times: [0, 0.7, 1],
        },
      },
    }),
  };

  const trigger = triggerOnView
    ? { whileInView: "visible", viewport: { once, margin: "-100px" } }
    : { animate: "visible" };

  return (
    <div className={`relative ${className}`}>
      <motion.div initial="hidden" variants={imageVariants} {...trigger}>
        {children}
      </motion.div>

      <motion.svg
        viewBox={`0 0 ${width} ${height}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        initial="hidden"
        {...trigger}
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            custom={i}
            d={d}
            stroke="var(--ink)"
            strokeWidth={SKETCH_STROKE}
            fill="none"
            strokeLinecap="round"
            variants={pathVariants}
          />
        ))}
      </motion.svg>
    </div>
  );
}
