"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useElementSize } from "@/components/sketch/useElementSize";
import { GHOST_DASH, GHOST_OPACITY, GHOST_STROKE } from "@/components/sketch/stroke";

/**
 * A reserved slot for a hand-drawn illustration that hasn't been drawn yet.
 * Deliberately looks unfinished — the same faint dotted route the scroll-drawn
 * strokes trace over — so it reads as "to come", not as a broken image.
 */
export function Illustration({
  label,
  note,
  ratio = "16 / 7",
}: {
  label: string;
  note?: string;
  ratio?: string;
}) {
  const { ref, size } = useElementSize<HTMLDivElement>();

  const path = useMemo(() => {
    if (size.width < 4 || size.height < 4) return "";
    const p = 3;
    const [x0, y0, x1, y1] = [p, p, size.width - p, size.height - p];
    return `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1} L ${x0} ${y1} Z`;
  }, [size]);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-10 lg:-mx-20 xl:-mx-32"
    >
      <div
        ref={ref}
        style={{ aspectRatio: ratio }}
        className="relative flex w-full flex-col items-center justify-center gap-2 px-6 text-center"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {path && (
            <path
              d={path}
              fill="none"
              stroke="var(--ink)"
              strokeWidth={GHOST_STROKE}
              strokeDasharray={GHOST_DASH}
              strokeLinecap="round"
              opacity={GHOST_OPACITY}
            />
          )}
        </svg>
        <p className="font-hand text-xl text-neutral-500 dark:text-neutral-400">{label}</p>
        {note && (
          <p className="max-w-md text-sm text-neutral-400 dark:text-neutral-500">{note}</p>
        )}
      </div>
    </motion.figure>
  );
}
