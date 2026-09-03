"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ExperienceEntry } from "@content/experience";
import { TimelineWave } from "@/components/sketch/TimelineWave";

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function ExperienceSection({ experience }: { experience: ExperienceEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useMemo(
    () => experience.map(() => ({ current: null }) as React.RefObject<HTMLElement | null>),
    [experience]
  );
  const [entriesReady, setEntriesReady] = useState(false);

  return (
    <section id="experience" className="site-px py-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-sm tracking-wide text-neutral-500"
      >
        Where I've worked
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-14 max-w-2xl text-3xl font-medium sm:text-4xl"
      >
        A path through a few different problems
      </motion.h3>

      <div ref={containerRef} className="relative max-w-3xl">
        {entriesReady && <TimelineWave containerRef={containerRef} dotRefs={dotRefs} />}

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={listVariants}
          className="space-y-14"
        >
          {experience.map((entry, i) => {
            const isLast = i === experience.length - 1;
            return (
              <motion.li
                key={`${entry.company}-${entry.start}`}
                variants={itemVariants}
                onAnimationComplete={isLast ? () => setEntriesReady(true) : undefined}
                className="relative pl-8 sm:pl-10"
              >
                <span
                  ref={dotRefs[i] as React.RefObject<HTMLSpanElement>}
                  className="absolute top-1.5 left-0 h-3.5 w-3.5 rounded-full border-2 border-neutral-900 bg-white sm:h-[18px] sm:w-[18px]"
                />

                <p className="mb-1 text-sm text-neutral-500">
                  {entry.start} — {entry.end}
                </p>
                <h4 className="font-hand text-2xl">
                  {entry.role} <span className="text-neutral-500">· {entry.company}</span>
                </h4>
                <p className="mb-3 text-sm text-neutral-500">{entry.location}</p>
                <p className="mb-4 max-w-xl text-neutral-700">{entry.summary}</p>
                <ul className="list-outside list-disc space-y-1 pl-5 text-sm text-neutral-600">
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
