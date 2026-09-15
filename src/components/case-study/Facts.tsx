"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * The ten-second read at the top of a case study: what it is, who for, what
 * came out of it. Two columns on anything wider than a phone.
 *
 * Composed from <Fact> children rather than an array prop, because
 * next-mdx-remote strips JSX expression attributes — only plain string
 * attributes and children survive the trip through MDX.
 */
export function Facts({ children }: { children: ReactNode }) {
  return (
    <motion.dl
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-8 grid gap-x-10 gap-y-5 border-y border-neutral-200 py-7 sm:grid-cols-2 dark:border-neutral-800"
    >
      {children}
    </motion.dl>
  );
}

export function Fact({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <dt className="mb-1 text-xs tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {label}
      </dt>
      <dd className="text-[0.975rem] leading-relaxed">{value ?? children}</dd>
    </div>
  );
}
