"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SketchBox } from "@/components/sketch/SketchBox";
import type { CaseStudyFrontmatter } from "@/lib/case-studies";

export function CaseStudyCard({
  frontmatter,
  index,
}: {
  frontmatter: CaseStudyFrontmatter;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ rotate: index % 2 === 0 ? -0.6 : 0.6, y: -4 }}
    >
      <Link href={`/case-studies/${frontmatter.slug}`} className="block h-full">
        <SketchBox className="h-full p-6 sm:p-8" padding={4}>
          <p className="mb-3 text-sm text-neutral-500">
            {frontmatter.year} · {frontmatter.role}
          </p>
          <h3 className="font-hand mb-3 text-2xl leading-snug sm:text-3xl">
            {frontmatter.title}
          </h3>
          <p className="mb-6 text-neutral-600">{frontmatter.summary}</p>
          <div className="flex flex-wrap gap-2">
            {frontmatter.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </SketchBox>
      </Link>
    </motion.div>
  );
}
