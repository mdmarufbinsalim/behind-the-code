"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GHOST_OPACITY, GHOST_STROKE, SKETCH_STROKE } from "@/components/sketch/stroke";

/**
 * Three mobile screens side by side in phone frames. The Qabiile app is the
 * surface most of this backend exists for, so the screens belong together in
 * one row rather than as three separate figures.
 */
export function PhoneRow({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-10"
    >
      <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-start sm:gap-6">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-6 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

export function Phone({
  src,
  alt,
  label,
  index = 0,
  width = 1170,
  height = 2532,
}: {
  src?: string;
  alt?: string;
  /** Shown under the phone, and inside it while there's no screenshot yet. */
  label: string;
  index?: number | string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Number(index) * 0.1, ease: "easeOut" }}
      className="flex w-full max-w-[15rem] flex-col items-center"
    >
      <div
        className="relative w-full overflow-hidden rounded-[1.75rem] p-2"
        style={{ border: `${SKETCH_STROKE}px solid var(--ink)` }}
      >
        {/* the speaker bar, so the frame reads as a phone at a glance */}
        <div
          className="absolute top-2.5 left-1/2 z-10 h-1 w-12 -translate-x-1/2 rounded-full"
          style={{ background: "var(--ink)", opacity: 0.55 }}
        />
        {src ? (
          <Image
            src={src}
            alt={alt ?? label}
            width={Number(width)}
            height={Number(height)}
            className="h-auto w-full rounded-[1.1rem]"
          />
        ) : (
          <div
            className="flex aspect-[9/19.5] w-full items-center justify-center rounded-[1.1rem] p-4 text-center"
            style={{
              border: `${GHOST_STROKE}px dashed var(--ink)`,
              opacity: GHOST_OPACITY,
            }}
          >
            <span className="text-sm leading-snug">{label}</span>
          </div>
        )}
      </div>
      <p className="mt-3 max-w-[15rem] text-center text-sm text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </motion.div>
  );
}
