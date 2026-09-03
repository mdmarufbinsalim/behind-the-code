"use client";

import { motion } from "framer-motion";
import type { ExperienceEntry } from "@content/experience";

export function ExperienceSection({ experience }: { experience: ExperienceEntry[] }) {
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

      <div className="relative max-w-3xl">
        <div className="absolute top-2 bottom-2 left-[7px] w-px bg-neutral-300 sm:left-[9px]" />

        <ol className="space-y-14">
          {experience.map((entry, i) => (
            <motion.li
              key={`${entry.company}-${entry.start}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative pl-8 sm:pl-10"
            >
              <span className="absolute top-1.5 left-0 h-3.5 w-3.5 rounded-full border-2 border-neutral-900 bg-white sm:h-[18px] sm:w-[18px]" />

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
          ))}
        </ol>
      </div>
    </section>
  );
}
