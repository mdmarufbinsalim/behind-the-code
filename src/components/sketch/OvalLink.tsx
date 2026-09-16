"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GHOST_DASH, GHOST_OPACITY, GHOST_STROKE } from "@/components/sketch/stroke";

/**
 * A link circled by a clean oval that is always being drawn: a thick arc
 * travelling continuously around the ellipse, over the same faint dotted route
 * every other scroll-drawn stroke on this site traces. The dots mean the ring
 * never reads as broken - the part the pen hasn't reached yet is still there.
 */
export function OvalLink({
  href,
  children,
  label,
  width = 214,
  height = 72,
}: {
  href: string;
  children: ReactNode;
  /** Accessible name, when the visible text is shorter than the meaning. */
  label?: string;
  width?: number;
  height?: number;
}) {
  const rx = width / 2 - 2;
  const ry = height / 2 - 2;
  // Ramanujan's approximation - close enough that the dash pattern lines up.
  const h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
  const perimeter = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

  return (
    <Link
      href={href}
      aria-label={label}
      className="group relative inline-flex items-center justify-center"
      style={{ width, height }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        {/* the route, waiting to be drawn over */}
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={GHOST_STROKE}
          strokeDasharray={GHOST_DASH}
          strokeLinecap="round"
          opacity={GHOST_OPACITY}
        />
        <motion.ellipse
          cx={width / 2}
          cy={height / 2}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${perimeter * 0.62} ${perimeter * 0.38}`}
          initial={{ strokeDashoffset: perimeter }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3.6, ease: "linear", repeat: Infinity }}
        />
      </svg>
      <span className="font-hand relative text-xl transition-transform duration-300 group-hover:-translate-y-0.5">
        {children}
      </span>
    </Link>
  );
}
