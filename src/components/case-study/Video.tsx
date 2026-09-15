"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SketchBox } from "@/components/sketch/SketchBox";

/**
 * A silent product recording, framed like the screenshots. Playback starts from
 * an effect rather than the autoplay attribute, so a visitor who asked for
 * reduced motion gets the poster frame and the controls instead of a moving
 * picture they didn't want.
 */
export function Video({
  src,
  poster,
  caption,
}: {
  src: string;
  poster?: string;
  caption?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.play().catch(() => {
      /* a browser that refuses autoplay just leaves the poster up */
    });
  }, []);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10"
    >
      <SketchBox className="p-2" padding={3}>
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          className="w-full dark:brightness-[0.87]"
        />
      </SketchBox>
      {caption && (
        <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
