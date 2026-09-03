"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const SHAPES = [
  {
    name: "cube",
    viewBox: "0 0 90 80",
    size: 150,
    path: "M22,58 L22,28 L47,17 L72,28 L72,58 L47,69 Z M22,28 L47,39 L72,28 M47,39 L47,69",
  },
  {
    name: "pyramid",
    viewBox: "0 0 92 72",
    size: 135,
    path: "M46,8 L14,64 L79,64 Z M46,8 L46,64 M14,64 L46,37 L79,64",
  },
  {
    name: "sphere",
    viewBox: "0 0 80 80",
    size: 135,
    path:
      "M40,4 A36,36 0 1 1 39.9,4 M4,40 L76,40 M9,25 Q40,40 71,25 M9,55 Q40,40 71,55 M40,4 Q52,40 40,76 M40,4 Q28,40 40,76",
  },
] as const;

type Placed = {
  shape: (typeof SHAPES)[number];
  top: number;
  right: number;
  rotateFrom: number;
  rotateTo: number;
  driftY: number;
};

function ShapeSvg({
  placed,
  progress,
}: {
  placed: Placed;
  progress: MotionValue<number>;
}) {
  const rotate = useTransform(progress, [0, 1], [placed.rotateFrom, placed.rotateTo]);
  const y = useTransform(progress, [0, 1], [0, placed.driftY]);

  return (
    <motion.svg
      viewBox={placed.shape.viewBox}
      width={placed.shape.size}
      height={placed.shape.size}
      style={{ rotate, y, top: placed.top, right: placed.right }}
      className="absolute"
    >
      <path
        d={placed.shape.path}
        stroke="#0a0a0a"
        strokeWidth={2}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

const MIN_GAP = 180;
const RIGHT_MIN = 60;
const RIGHT_MAX = 480;
const TOP_MARGIN = 70;
const MAX_ATTEMPTS = 60;

export function ScrollShapes({
  scrollTargetRef,
}: {
  scrollTargetRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });

  const [placements, setPlacements] = useState<Placed[] | null>(null);

  useEffect(() => {
    const el = scrollTargetRef.current;
    const height = el?.getBoundingClientRect().height ?? 900;
    const bottomBound = Math.max(height - TOP_MARGIN, TOP_MARGIN + 200);

    const pool = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 3);
    const centers: { top: number; right: number }[] = [];
    const next: Placed[] = [];

    for (const shape of pool) {
      let top = TOP_MARGIN;
      let right = RIGHT_MIN;
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        top = TOP_MARGIN + Math.random() * (bottomBound - TOP_MARGIN);
        right = RIGHT_MIN + Math.random() * (RIGHT_MAX - RIGHT_MIN);
        const clear = centers.every(
          (c) => Math.hypot(c.top - top, c.right - right) > MIN_GAP
        );
        if (clear) break;
      }

      centers.push({ top, right });
      const direction = Math.random() > 0.5 ? 1 : -1;
      next.push({
        shape,
        top,
        right,
        rotateFrom: direction * (Math.random() * 20),
        rotateTo: direction * (240 + Math.random() * 140),
        driftY: (Math.random() - 0.5) * 60,
      });
    }

    setPlacements(next);
  }, [scrollTargetRef]);

  if (!placements) return null;

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {placements.map((p, i) => (
        <ShapeSvg key={p.shape.name + i} placed={p} progress={scrollYProgress} />
      ))}
    </div>
  );
}
