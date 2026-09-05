"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { ExperienceEntry } from "@content/experience";
import { TimelineWave } from "@/components/sketch/TimelineWave";
// Shapes temporarily disabled — see ScrollShapes.tsx (kept for later).
// import { ScrollShapes } from "@/components/sketch/ScrollShapes";

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.112 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

export function ExperienceSection({ experience }: { experience: ExperienceEntry[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useMemo(
    () => experience.map(() => ({ current: null }) as React.RefObject<HTMLElement | null>),
    [experience]
  );

  return (
    <section id="experience" ref={sectionRef} className="site-px relative py-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-2 text-sm tracking-wide text-neutral-500 dark:text-neutral-400"
      >
        Where I've worked
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.07 }}
        className="mb-14 max-w-2xl text-3xl font-medium sm:text-4xl"
      >
        A path through a few different problems
      </motion.h3>

      <div ref={containerRef} className="relative max-w-3xl">
        <TimelineWave containerRef={containerRef} dotRefs={dotRefs} />

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          variants={listVariants}
          className="space-y-14"
        >
          {experience.map((entry, i) => {
            return (
              <motion.li
                key={`${entry.company}-${entry.start}`}
                variants={itemVariants}
                className="relative pl-8 sm:pl-10"
              >
                <span
                  ref={dotRefs[i] as React.RefObject<HTMLSpanElement>}
                  className="absolute top-1.5 left-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-neutral-900 bg-white sm:h-[18px] sm:w-[18px] dark:border-neutral-100 dark:bg-neutral-950"
                />

                <p className="mb-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {entry.start} — {entry.end}
                </p>
                <h4 className="font-hand text-2xl">
                  {entry.role}{" "}
                  <span className="text-neutral-500 dark:text-neutral-400">
                    · {entry.company}
                  </span>
                </h4>
                <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
                  {entry.location}
                </p>
                <p className="mb-4 max-w-xl text-neutral-700 dark:text-neutral-300">
                  {entry.summary}
                </p>
                <ul className="list-outside list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
                  {entry.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
