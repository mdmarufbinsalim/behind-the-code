"use client";

import { motion } from "framer-motion";

/**
 * The size of the thing, in the four numbers that actually describe a backend.
 * A stat band rather than a diagram - there's no shape to draw here, just
 * scale.
 */
const STATS = [
  { value: "31", label: "NestJS modules, each owning its own entities and queues" },
  { value: "204", label: "REST endpoints behind one generated OpenAPI spec" },
  { value: "63", label: "TypeORM entities across 16 migrations" },
  { value: "6", label: "BullMQ workers: mail, media, search, payments, expiry" },
];

export function ApiSurface({
  caption = "Phase 1, as the API sees it.",
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
