"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SketchUnderline } from "@/components/sketch/SketchUnderline";
import type { about as AboutType } from "@content/about";

export function AboutSection({ about }: { about: typeof AboutType }) {
  return (
    <section id="about" className="site-px py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <Image
            src="/about-image.png"
            alt="Doodle illustration of the developer leaning back in his chair, feet up on the desk, hands behind his head, thinking — a lightbulb, a code bracket, and a question mark float above him"
            width={780}
            height={780}
            className="w-full max-w-[700px] dark:hidden"
          />
          <Image
            src="/about-image-dark.png"
            alt="Doodle illustration of the developer leaning back in his chair, feet up on the desk, hands behind his head, thinking — a lightbulb, a code bracket, and a question mark float above him"
            width={780}
            height={780}
            className="hidden w-full max-w-[700px] dark:block"
          />
        </motion.div>

        <div className="max-w-2xl lg:text-right">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-2 text-sm tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            About
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
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
                viewport={{ once: false, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-neutral-700 dark:text-neutral-300"
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
