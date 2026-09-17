import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { resume } from "@content/resume";

export const metadata = {
  title: "Resume - Md. Maruf Bin Salim Bhuiyan",
  description:
    "Software engineer in Dhaka - multi-tenant SaaS backends, domain-specific editors, and the APIs behind them.",
};

const PDF = "/md-maruf-bin-salim-bhuiyan-resume.pdf";

/**
 * Link marks. They carry aria-hidden and no text of their own: an applicant
 * tracking system reads the label and the href beside them, and a parser that
 * ignores vector art loses nothing.
 */
function LinkMark({ kind }: { kind: "site" | "linkedin" | "github" }) {
  const common = {
    width: 9.5,
    height: 9.5,
    viewBox: "0 0 16 16",
    fill: "currentColor",
    "aria-hidden": true as const,
    // Tailwind's preflight sets svg { display: block }, which would push the
    // icon onto its own line inside the (inline) <a> - force it back inline
    // rather than relying on the browser default.
    style: { display: "inline-block", flexShrink: 0 },
  };

  if (kind === "linkedin") {
    return (
      <svg {...common}>
        <path d="M2.4 0A2.4 2.4 0 0 0 0 2.4v11.2A2.4 2.4 0 0 0 2.4 16h11.2a2.4 2.4 0 0 0 2.4-2.4V2.4A2.4 2.4 0 0 0 13.6 0H2.4Zm1.3 5.3h2.2v7.2H3.7V5.3Zm1.1-3.4c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3ZM7.4 5.3h2.1v1c.3-.6 1-1.2 2.1-1.2 1.6 0 2.6 1 2.6 3.1v4.3h-2.2V8.6c0-1-.4-1.6-1.2-1.6-.7 0-1.2.5-1.3 1.1v4.4H7.4V5.3Z" />
      </svg>
    );
  }

  if (kind === "github") {
    return (
      <svg {...common}>
        <path d="M8 0a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-1-.9-1.2-.9-1.2-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .6-.2 2.1.8a7.3 7.3 0 0 1 3.8 0c1.5-1 2.1-.8 2.1-.8.5 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3-1.8 3.7-3.6 3.9.4.3.7.9.7 1.8v2.6c0 .2.1.5.6.4A8 8 0 0 0 8 0Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm5.4 4.8h-2a12 12 0 0 0-.9-2.3 6.5 6.5 0 0 1 2.9 2.3ZM8 1.5c.5.6 1.1 1.7 1.5 3.3h-3C6.9 3.2 7.5 2.1 8 1.5ZM1.7 9.6a6.6 6.6 0 0 1 0-3.2h2.3a15.6 15.6 0 0 0 0 3.2H1.7Zm.9 1.6h2a12 12 0 0 0 .9 2.3 6.5 6.5 0 0 1-2.9-2.3Zm2-6.4h-2a6.5 6.5 0 0 1 2.9-2.3 12 12 0 0 0-.9 2.3ZM8 14.5c-.5-.6-1.1-1.7-1.5-3.3h3c-.4 1.6-1 2.7-1.5 3.3Zm1.8-4.9H6.2a14 14 0 0 1 0-3.2h3.6a14 14 0 0 1 0 3.2Zm.7 3.9a12 12 0 0 0 .9-2.3h2a6.5 6.5 0 0 1-2.9 2.3Zm1.5-3.9a15.6 15.6 0 0 0 0-3.2h2.3a6.6 6.6 0 0 1 0 3.2H12Z" />
    </svg>
  );
}

/**
 * One column, real headings, no tables and no text trapped in images - the
 * layout an applicant tracking system can actually read. The same markup is
 * what gets printed to the downloadable PDF, so the two can't drift.
 */
export default function ResumePage() {
  return (
    <>
      <div className="print:hidden">
        <Nav />
      </div>

      <main className="site-px flex-1 py-12 print:p-0">
        <div className="mx-auto max-w-[210mm]">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <Link
              href="/"
              className="text-sm text-neutral-500 hover:opacity-60 dark:text-neutral-400"
            >
              ← Back to the story
            </Link>
            <a
              href={PDF}
              download
              className="text-sm underline decoration-1 underline-offset-4 hover:opacity-60"
            >
              Download PDF
            </a>
          </div>

          <article className="resume border border-neutral-200 bg-white p-[14mm] text-black print:border-0 print:p-0 dark:border-neutral-800">
            <header className="resume-head">
              <h1>{resume.name}</h1>
              <p className="resume-contact">
                {resume.headline} · {resume.location}
              </p>
              <p className="resume-contact">{resume.phone}</p>
              <p className="resume-contact">
                <a href={`mailto:${resume.email}`}>{resume.email}</a>
              </p>
              <p className="resume-contact resume-links">
                {resume.links.map((link) => (
                  <a key={link.href} href={link.href} className="resume-link">
                    <LinkMark kind={link.kind} />
                    {link.label}
                  </a>
                ))}
              </p>
            </header>

            <section>
              <h2>Summary</h2>
              <p>{resume.summary}</p>
            </section>

            <section>
              <h2>Skills</h2>
              <ul className="resume-skills two-up">
                {resume.skills.map((skill) => (
                  <li key={skill.group}>
                    <strong>{skill.group}:</strong> {skill.items.join(", ")}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Experience</h2>
              {resume.experience.map((job) => (
                <div key={`${job.company}-${job.start}`} className="resume-entry">
                  <div className="resume-entry-head">
                    <h3>
                      {job.role}, {job.company}
                    </h3>
                    <span className="resume-dates">
                      {job.start} - {job.end}
                    </span>
                  </div>
                  <p className="resume-meta">{job.location}</p>
                  <ul className="resume-bullets">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>
                        {/* A literal character rather than list-style: disc - a CSS
                            marker doesn't reliably survive into a PDF's text layer,
                            so some extractors read a bulleted list as an unmarked
                            paragraph. This one always comes through, and it's left
                            in the accessibility tree rather than aria-hidden so a
                            tag-tree-based extractor sees it too. */}
                        {"\u2022 "}
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section>
              <h2>Education</h2>
              {resume.education.map((school) => (
                <div key={school.institution} className="resume-entry">
                  <div className="resume-entry-head">
                    <h3>
                      {school.qualification}, {school.institution}
                    </h3>
                    <span className="resume-dates">{school.date}</span>
                  </div>
                  {school.location && <p className="resume-meta">{school.location}</p>}
                </div>
              ))}
            </section>

            <section>
              <h2>References</h2>
              <ul className="resume-skills">
                {resume.references.map((ref) => (
                  <li key={ref.email}>
                    <strong>{ref.name}</strong>, {ref.title}, {ref.organization} -{" "}
                    <a href={`mailto:${ref.email}`}>{ref.email}</a>
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
