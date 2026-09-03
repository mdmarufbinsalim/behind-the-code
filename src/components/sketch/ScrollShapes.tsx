"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const SHAPES = [
  {
    name: "cube",
    viewBox: "0 0 90 80",
    size: 100,
    path: "M22,58 L22,28 L47,17 L72,28 L72,58 L47,69 Z M22,28 L47,39 L72,28 M47,39 L47,69",
  },
  {
    name: "pyramid",
    viewBox: "0 0 92 72",
    size: 90,
    path: "M46,8 L14,64 L79,64 Z M46,8 L46,64 M14,64 L46,37 L79,64",
  },
  {
    name: "sphere",
    viewBox: "0 0 80 80",
    size: 90,
    path:
      "M40,4 A36,36 0 1 1 39.9,4 M4,40 L76,40 M9,25 Q40,40 71,25 M9,55 Q40,40 71,55 M40,4 Q52,40 40,76 M40,4 Q28,40 40,76",
  },
  {
    name: "hexagon",
    viewBox: "0 0 80 90",
    size: 90,
    path:
      "M40,4 L74,24 L74,64 L40,84 L6,64 L6,24 Z M40,4 L40,44 M6,24 L40,44 M74,24 L40,44 M40,44 L40,84",
  },
  {
    name: "star",
    viewBox: "0 0 90 90",
    size: 90,
    path:
      "M45,4 L55,33 L86,33 L61,52 L70,82 L45,63 L20,82 L29,52 L4,33 L35,33 Z",
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
      style={{ rotate, y, top: `${placed.top}%`, right: placed.right }}
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
    const pool = [...SHAPES].sort(() => Math.random() - 0.5);
    const count = 3;
    const bands = 100 / count;

    const next: Placed[] = pool.slice(0, count).map((shape, i) => {
      const bandStart = i * bands;
      const direction = Math.random() > 0.5 ? 1 : -1;
      return {
        shape,
        top: bandStart + Math.random() * (bands - 20),
        right: 24 + Math.random() * 180,
        rotateFrom: direction * (Math.random() * 20),
        rotateTo: direction * (240 + Math.random() * 140),
        driftY: (Math.random() - 0.5) * 140,
      };
    });

    setPlacements(next);
  }, []);

  if (!placements) return null;

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {placements.map((p, i) => (
        <ShapeSvg key={p.shape.name + i} placed={p} progress={scrollYProgress} />
      ))}
    </div>
  );
}
