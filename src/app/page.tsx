import { Nav } from "@/components/Nav";
import { HomeContent } from "@/components/HomeContent";
import { Footer } from "@/components/sections/Footer";
import { getAllCaseStudies } from "@/lib/case-studies";
import { experience } from "@content/experience";
import { about } from "@content/about";

export default function Home() {
  const all = getAllCaseStudies();
  // The home page is a story, not an index - it leads with three and hands the
  // rest to /case-studies.
  const caseStudies = all.slice(0, 3);
  const total = all.length;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <HomeContent caseStudies={caseStudies} totalCaseStudies={total} experience={experience} about={about} />
      </main>
      <Footer />
    </>
  );
}
