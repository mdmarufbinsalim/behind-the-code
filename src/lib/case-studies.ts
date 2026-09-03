import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudyFrontmatter = {
  title: string;
  slug: string;
  role: string;
  stack: string[];
  year: string;
  summary: string;
};

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  content: string;
};

export function getCaseStudySlugs(): string[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];
  return fs
    .readdirSync(CASE_STUDIES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as CaseStudyFrontmatter,
    content,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  return getCaseStudySlugs()
    .map((slug) => getCaseStudy(slug))
    .filter((cs): cs is CaseStudy => cs !== null)
    .sort((a, b) => Number(b.frontmatter.year) - Number(a.frontmatter.year));
}
