"use client";

import { type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cubePath =
  "M22,58 L22,28 L47,17 L72,28 L72,58 L47,69 Z M22,28 L47,39 L72,28 M47,39 L47,69";
const pyramidPath =
  "M46,8 L14,64 L79,64 Z M46,8 L46,64 M14,64 L46,37 L79,64";

export function ScrollShapes({
  scrollTargetRef,
}: {
  scrollTargetRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });

  const cubeRotate = useTransform(scrollYProgress, [0, 1], [-15, 340]);
  const cubeY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const pyramidRotate = useTransform(scrollYProgress, [0, 1], [15, -300]);
  const pyramidY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <motion.svg
        viewBox="0 0 90 80"
        width={110}
        height={100}
        style={{ rotate: cubeRotate, y: cubeY }}
        className="absolute top-24 right-16"
      >
        <path
          d={cubePath}
          stroke="#0a0a0a"
          strokeWidth={2}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </motion.svg>

      <motion.svg
        viewBox="0 0 92 72"
        width={92}
        height={72}
        style={{ rotate: pyramidRotate, y: pyramidY }}
        className="absolute top-[420px] right-28"
      >
        <path
          d={pyramidPath}
          stroke="#0a0a0a"
          strokeWidth={2}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}
