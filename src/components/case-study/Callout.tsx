"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { SketchBox } from "@/components/sketch/SketchBox";

/** A boxed aside for the moments where the interesting part of the story is. */
export function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-9"
    >
      <SketchBox className="px-6 py-5 sm:px-8" padding={4}>
        <p className="mb-2 text-xl font-medium">{label}</p>
        <div className="callout">{children}</div>
      </SketchBox>
    </motion.aside>
  );
}
