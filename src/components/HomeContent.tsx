"use client";

import { useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SketchConnector } from "@/components/sketch/SketchConnector";
import { SketchDownConnector } from "@/components/sketch/SketchDownConnector";
import type { CaseStudy } from "@/lib/case-studies";
import type { ExperienceEntry } from "@content/experience";
import type { about as AboutType } from "@content/about";

export function HomeContent({
  caseStudies,
  totalCaseStudies,
  experience,
  about,
}: {
  caseStudies: CaseStudy[];
  totalCaseStudies: number;
  experience: ExperienceEntry[];
  about: typeof AboutType;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const workHeadingRef = useRef<HTMLHeadingElement>(null);

  return (
    <div ref={containerRef} className="relative">
      <Hero ctaRef={ctaRef} />
      <SketchConnector fromRef={ctaRef} toRef={workHeadingRef} containerRef={containerRef} />
      {/* the same gesture where the diagonal one has no room to run */}
      <div className="site-px -mt-4 flex justify-end lg:hidden">
        <SketchDownConnector />
      </div>
      <CaseStudiesSection
        caseStudies={caseStudies}
        total={totalCaseStudies}
        headingRef={workHeadingRef}
      />
      <ExperienceSection experience={experience} />
      <AboutSection about={about} />
    </div>
  );
}
