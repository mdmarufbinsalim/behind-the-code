"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SketchBox } from "@/components/sketch/SketchBox";

/**
 * A screenshot inside a hand-drawn frame. The product shots are light-UI, so in
 * dark mode they get dimmed a touch — a full-brightness white screenshot on the
 * dark paper reads as a hole punched in the page.
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
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      /* Screenshots are dense, so they break out of the prose column on wide
         screens rather than shrinking to its measure. */
      className="my-10 lg:-mx-20 xl:-mx-32"
    >
      <SketchBox className="p-2" padding={3}>
        <a href={src} target="_blank" rel="noreferrer" className="block">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full dark:brightness-[0.87]"
          />
        </a>
      </SketchBox>
      {caption && (
        <figcaption className="font-hand mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
