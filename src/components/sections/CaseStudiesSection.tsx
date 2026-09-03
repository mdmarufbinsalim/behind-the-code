"use client";

import type { RefObject } from "react";
import { motion } from "framer-motion";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import type { CaseStudy } from "@/lib/case-studies";

export function CaseStudiesSection({
  caseStudies,
  headingRef,
}: {
  caseStudies: CaseStudy[];
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section id="work" className="site-px py-16">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="mb-2 text-sm tracking-wide text-neutral-500 lg:text-right"
      >
        Selected work
      </motion.h2>
      <motion.h3
        ref={headingRef}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-12 max-w-2xl text-3xl font-medium sm:text-4xl lg:ml-auto lg:text-right"
      >
        A few systems worth telling the story of
      </motion.h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((cs, i) => (
          <CaseStudyCard key={cs.frontmatter.slug} frontmatter={cs.frontmatter} index={i} />
        ))}
      </div>
    </section>
  );
}
