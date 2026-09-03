"use client";

import { motion } from "framer-motion";
import { SketchCircle } from "@/components/sketch/SketchCircle";
import type { about as AboutType } from "@content/about";

export function AboutSection({ about }: { about: typeof AboutType }) {
  return (
    <section id="about" className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-sm tracking-wide text-neutral-500"
        >
          About
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-hand mb-10 text-3xl sm:text-4xl"
        >
          <SketchCircle delay={0.4}>{about.intro}</SketchCircle>
        </motion.h3>

        <div className="space-y-5">
          {about.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-neutral-700"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
