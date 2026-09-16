"use client";

import { motion } from "framer-motion";

/**
 * The tension the whole project turns on: most of a note is boilerplate,
 * retyped anyway, while the small part that actually varies is what gets
 * rushed. A stat callout, not a diagram - the split reads faster as two
 * numbers than as any shape.
 */
export function NinetyTenSplit({
  caption = "The same ninety percent, every visit. The ten percent that matters is what gets rushed.",
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
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <div className="text-6xl font-semibold text-[var(--ink)] opacity-35 sm:text-7xl">
            90%
          </div>
          <p className="mt-3 text-lg text-neutral-500 dark:text-neutral-400">
            identical to the last patient's note - typed by hand anyway
          </p>
        </div>
        <div>
          <div className="text-6xl font-semibold text-[var(--ink)] sm:text-7xl">10%</div>
          <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
            what actually varies clinically - the part that gets rushed
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-2.5 w-full gap-1">
        <div
          className="h-full rounded-full border border-[var(--ink)] opacity-35"
          style={{ flexBasis: "89%" }}
        />
        <div
          className="h-full rounded-full bg-[var(--ink)]"
          style={{ flexBasis: "9%" }}
        />
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
