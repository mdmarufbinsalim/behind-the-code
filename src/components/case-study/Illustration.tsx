"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useElementSize } from "@/components/sketch/useElementSize";
import { GHOST_DASH, GHOST_OPACITY, GHOST_STROKE } from "@/components/sketch/stroke";

/**
 * A hand-drawn illustration in the same pen as the hero.
 *
 * With a `src` it renders the drawing: black line art on transparency, so it
 * gets inverted rather than dimmed in dark mode — the strokes go white and the
 * paper stays the page.
 *
 * Without one it reserves the slot, drawn in the same faint dotted stroke the
 * scroll-drawn marks trace over, so an undrawn illustration reads as "to come"
 * rather than as a broken image.
 */
export function Illustration({
  src,
  alt,
  caption,
  label,
  note,
  ratio = "16 / 7",
  width = 1536,
  height = 1024,
}: {
  src?: string;
  alt?: string;
  caption?: string;
  label?: string;
  note?: string;
  ratio?: string;
  width?: number;
  height?: number;
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
      {src ? (
        <Image
          src={src}
          alt={alt ?? label ?? ""}
          width={width}
          height={height}
          className="w-full dark:invert"
        />
      ) : (
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
      )}

      {caption && (
        <figcaption className="font-hand mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
