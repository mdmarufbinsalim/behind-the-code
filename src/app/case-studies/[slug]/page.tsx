import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { getAllCaseStudies, getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.frontmatter.title} — Behind the Code`,
    description: caseStudy.frontmatter.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  const others = getAllCaseStudies().filter((cs) => cs.frontmatter.slug !== slug);

  return (
    <>
      <Nav />
      <main className="flex-1 site-px py-12">
        <div className="mx-auto max-w-3xl">
          <Link href="/#work" className="mb-10 inline-block text-sm text-neutral-500 hover:opacity-60">
            ← Back to the story
          </Link>

          <CaseStudyHero frontmatter={caseStudy.frontmatter} />

          <div className="case-content mt-10">
            <MDXRemote source={caseStudy.content} />
          </div>

          {others.length > 0 && (
            <div className="mt-20 border-t border-neutral-200 pt-10">
              <p className="mb-4 text-sm text-neutral-500">Read another one</p>
              <div className="flex flex-col gap-3">
                {others.map((cs) => (
                  <Link
                    key={cs.frontmatter.slug}
                    href={`/case-studies/${cs.frontmatter.slug}`}
                    className="font-hand text-2xl underline decoration-2 underline-offset-4 hover:opacity-70"
                  >
                    {cs.frontmatter.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
