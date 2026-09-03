import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { Footer } from "@/components/sections/Footer";
import { getAllCaseStudies } from "@/lib/case-studies";
import { experience } from "@content/experience";
import { about } from "@content/about";

export default function Home() {
  const caseStudies = getAllCaseStudies();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <CaseStudiesSection caseStudies={caseStudies} />
        <ExperienceSection experience={experience} />
        <AboutSection about={about} />
      </main>
      <Footer />
    </>
  );
}
