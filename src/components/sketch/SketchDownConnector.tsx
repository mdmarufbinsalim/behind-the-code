"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  GHOST_DASH,
  GHOST_OPACITY,
  GHOST_STROKE,
  SKETCH_STROKE,
} from "@/components/sketch/stroke";

// Two straight runs and one sharp corner: out to the right from the end of
// the call to action, then back down-left onto the section heading. Angular
// rather than curved, because on a narrow screen the same S-curve the desktop
// arrow uses has to double back on itself to reach a heading sitting at the
// same margin it started from.
const LINE = "M 8 6 L 122 84 L 30 154";
const HEAD = "M 36 141 L 30 155 L 44 151";

/**
 * The narrow-screen counterpart to SketchConnector, which needs horizontal
 * distance it doesn't have on a phone. Same idea: a faint dotted route with a
 * stroke drawn over it as you scroll, arrowhead landing last.
 */
export function SketchDownConnector({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  const { scrollYProgress } = useScroll({
    // useScroll's target is typed for HTML elements; an SVG root tracks fine.
    target: ref as unknown as RefObject<HTMLElement>,
    offset: ["start 0.98", "end 0.52"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const headLength = useTransform(progress, [0.86, 1], [0, 1], { clamp: true });

  return (
    <svg
      ref={ref}
      viewBox="0 0 140 168"
      width="140"
      height="168"
      className={className}
      aria-hidden="true"
    >
      {[LINE, HEAD].map((d) => (
        <path
          key={d}
          d={d}
          stroke="var(--ink)"
          strokeWidth={GHOST_STROKE}
          strokeOpacity={GHOST_OPACITY}
          strokeDasharray={GHOST_DASH}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="miter"
        />
      ))}
      <motion.path
        d={LINE}
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        style={{ pathLength: progress }}
      />
      <motion.path
        d={HEAD}
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        style={{ pathLength: headLength }}
      />
    </svg>
  );
}
