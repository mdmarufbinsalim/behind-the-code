import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { AllProjects } from "@/components/case-study/AllProjects";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata = {
  title: "All work - Behind the Code",
  description: "Every case study, filterable by organisation and by stack.",
};

export default function AllCaseStudiesPage() {
  // Only the frontmatter crosses into the client component - the MDX bodies
  // would be a lot of bytes nobody on this page reads.
  const projects = getAllCaseStudies().map((cs) => cs.frontmatter);

  return (
    <>
      <Nav />
      <main className="site-px flex flex-1 flex-col py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
          <Link
            href="/#work"
            className="mb-10 inline-block text-sm text-neutral-500 hover:opacity-60 dark:text-neutral-400"
          >
            ← Back to the story
          </Link>

          <h1 className="mb-2 text-3xl leading-tight font-medium sm:text-5xl">All work</h1>
          <p className="mb-12 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
            Every case study, filterable by who it was for and what it was built with.
          </p>

          <AllProjects projects={projects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
