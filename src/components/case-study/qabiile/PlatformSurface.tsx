"use client";

import { motion } from "framer-motion";

/**
 * What Phase 1 amounts to from outside the code - the numbers that mean
 * something to someone who will never open the repo. The engineering-side
 * counts live in ApiSurface, behind the disclosure.
 */
const STATS = [
  { value: "5", label: "products in one: feed, short video, clans, auctions, messaging" },
  { value: "3", label: "clients - web, mobile and an admin console - on one shared API" },
  { value: "2", label: "languages, end to end, including what the server itself says" },
  { value: "6", label: "engineers, whose work I planned, reviewed and unblocked" },
];

export function PlatformSurface({
  caption = "Phase 1, as anyone outside the team would describe it.",
}: {
  caption?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10"
    >
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.value}>
            <div className="text-5xl font-semibold text-[var(--ink)] sm:text-6xl">{stat.value}</div>
            <p className="mt-3 text-sm leading-snug text-neutral-500 dark:text-neutral-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-8 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
