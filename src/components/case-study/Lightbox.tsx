"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { SKETCH_STROKE } from "@/components/sketch/stroke";
import { SketchBox } from "@/components/sketch/SketchBox";

/** Hand-drawn close mark - two strokes that don't quite meet, like the rest of the site's pen. */
function SketchX() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="overflow-visible">
      <path
        d="M4.5 4 L21.5 22"
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22 4.5 L4 21.5"
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Lightbox({
  src,
  alt,
  caption,
  layoutId,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  layoutId?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    // Lenis drives the window scroll itself, so hiding overflow isn't enough -
    // SmoothScroll listens for these and parks the scroller while we're open.
    window.dispatchEvent(new Event("lightbox:open"));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      window.dispatchEvent(new Event("lightbox:close"));
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-4 bg-[var(--paper)]/97 px-4 py-16 backdrop-blur-sm sm:px-10"
    >
      <motion.div
        layoutId={layoutId}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 240, damping: 30 }}
        className="cursor-default"
      >
        {/* Same pen and stroke weight as the thumbnail's frame, but drawn
            already: stroking it on while the box is still morphing to its
            final size makes the line chase the image. */}
        <SketchBox className="p-2" padding={3} animate={false}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block max-h-[78vh] max-w-full object-contain dark:brightness-[0.87]"
          />
        </SketchBox>
      </motion.div>

      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="max-w-2xl text-center text-lg text-neutral-500 dark:text-neutral-400"
        >
          {caption}
        </motion.p>
      )}

      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        autoFocus
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.3 }}
        whileHover={{ rotate: 6 }}
        className="absolute top-5 right-5 cursor-pointer p-2 sm:top-8 sm:right-8"
      >
        <SketchX />
      </motion.button>
    </motion.div>,
    document.body,
  );
}
