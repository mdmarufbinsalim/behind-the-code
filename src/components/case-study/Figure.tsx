"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SketchBox } from "@/components/sketch/SketchBox";
import { Lightbox } from "@/components/case-study/Lightbox";

/**
 * A screenshot inside a hand-drawn frame. Clicking it opens the full-size
 * version in place — the thumbnail morphs up into a fullscreen view rather than
 * dumping the raw file into a new tab.
 *
 * The product shots are light-UI, so in dark mode they get dimmed a touch: a
 * full-brightness white screenshot on the dark paper reads as a hole punched in
 * the page.
 */
export function Figure({
  src,
  alt,
  caption,
  width = 1907,
  height = 909,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const close = useCallback(() => setOpen(false), []);

  // Shared id drives the morph between thumbnail and fullscreen. Dropped when
  // the visitor asked for reduced motion, leaving a plain cross-fade.
  const layoutId = reduceMotion ? undefined : `figure-${src}`;

  return (
    <>
      <motion.figure
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="my-10"
      >
        <SketchBox className="p-2" padding={3}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open full size: ${alt}`}
            className="block w-full cursor-zoom-in"
          >
            <motion.span layoutId={layoutId} className="block">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full dark:brightness-[0.87]"
              />
            </motion.span>
          </button>
        </SketchBox>
        {caption && (
          <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
            {caption}
          </figcaption>
        )}
      </motion.figure>

      <AnimatePresence>
        {open && (
          <Lightbox src={src} alt={alt} caption={caption} layoutId={layoutId} onClose={close} />
        )}
      </AnimatePresence>
    </>
  );
}
