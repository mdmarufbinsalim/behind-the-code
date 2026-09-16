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
                {resume.headline} · {resume.location} · {resume.phone} ·{" "}
                <a href={`mailto:${resume.email}`}>{resume.email}</a>
              </p>
              <p className="resume-contact">
                {resume.links.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 && " · "}
                    <a href={link.href}>{link.label}</a>
                  </span>
                ))}
              </p>
            </header>

            <section>
              <h2>Summary</h2>
              <p>{resume.summary}</p>
            </section>

            <section>
              <h2>Skills</h2>
              <ul className="resume-skills">
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
                  <ul>
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
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
