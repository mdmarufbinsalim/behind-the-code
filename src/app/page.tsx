import { Nav } from "@/components/Nav";
import { HomeContent } from "@/components/HomeContent";
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
        <HomeContent caseStudies={caseStudies} experience={experience} about={about} />
      </main>
      <Footer />
    </>
  );
}
