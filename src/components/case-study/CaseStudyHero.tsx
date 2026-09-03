"use client";

import { motion } from "framer-motion";
import { SketchUnderline } from "@/components/sketch/SketchUnderline";
import type { CaseStudyFrontmatter } from "@/lib/case-studies";

export function CaseStudyHero({ frontmatter }: { frontmatter: CaseStudyFrontmatter }) {
  return (
    <header>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 text-sm text-neutral-500 dark:text-neutral-400"
      >
        {frontmatter.year} · {frontmatter.role}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="relative max-w-2xl text-3xl leading-tight font-medium sm:text-5xl"
      >
        {frontmatter.title}
        <SketchUnderline
          className="absolute -bottom-3 left-0"
          width={160}
          height={16}
          delay={0.7}
        />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="mt-8 max-w-xl text-lg text-neutral-600"
      >
        {frontmatter.summary}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.24 }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {frontmatter.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </header>
  );
}
