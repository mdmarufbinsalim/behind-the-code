"use client";

import { motion } from "framer-motion";

/**
 * Phase 1 by codebase. Four repositories, two languages, one shared contract -
 * laid out as a matrix because the interesting thing isn't any single number,
 * it's how much surface four of these sit behind.
 */
const ROWS = [
  {
    name: "API",
    tech: "NestJS · PostgreSQL · Redis",
    stats: [
      ["31", "modules"],
      ["204", "endpoints"],
      ["63", "entities"],
      ["6", "background workers"],
    ],
  },
  {
    name: "Web",
    tech: "Next.js · App Router",
    stats: [
      ["39", "routes"],
      ["51", "shared components"],
      ["7", "admin screens"],
    ],
  },
  {
    name: "Mobile",
    tech: "Expo · React Native",
    stats: [
      ["37", "screens"],
      ["16", "feature modules"],
    ],
  },
  {
    name: "ID verification",
    tech: "Go · its own container",
    stats: [
      ["2", "reads per card: strip and printed face"],
      ["0", "lines shared with the API"],
    ],
  },
];

export function StackMatrix({
  caption = "Phase 1 by codebase: two languages, four deployables, one generated contract between them.",
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
      <div className="border-t border-neutral-200 dark:border-neutral-800">
        {ROWS.map((row) => (
          <div
            key={row.name}
            className="grid gap-4 border-b border-neutral-200 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8 dark:border-neutral-800"
          >
            <div>
              <div className="text-lg font-semibold text-[var(--ink)]">{row.name}</div>
              <div className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {row.tech}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {row.stats.map(([value, label]) => (
                <div key={label}>
                  <div className="text-3xl font-semibold text-[var(--ink)] sm:text-4xl">
                    {value}
                  </div>
                  <div className="mt-1 text-sm leading-snug text-neutral-500 dark:text-neutral-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">
        Web and mobile don't hand-write a single API type between them - both consume the same
        package, generated from the spec the API emits.
      </p>

      {caption && (
        <figcaption className="mt-6 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
