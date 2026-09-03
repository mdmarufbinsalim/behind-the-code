"use client";

import { motion } from "framer-motion";
import { SketchUnderline } from "@/components/sketch/SketchUnderline";
import type { about as AboutType } from "@content/about";

export function AboutSection({ about }: { about: typeof AboutType }) {
  return (
    <section id="about" className="site-px py-16">
      <div className="ml-auto max-w-2xl lg:text-right">
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
          className="font-hand relative mb-10 inline-block text-3xl sm:text-4xl"
        >
          {about.intro}
          <SketchUnderline
            className="absolute -bottom-3 left-0"
            width={380}
            height={18}
            delay={0.5}
          />
        </motion.h3>

        <div className="space-y-5 text-left">
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
