export type ExperienceEntry = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    company: "Mediusware",
    location: "Dhaka, Bangladesh",
    start: "May 2025",
    end: "Present",
    summary:
      "Building domain-specific systems where correctness isn't optional — clinical documentation and multi-tenant SaaS infrastructure.",
    highlights: [
      "Built a custom Slate-based text editor for doctors with a NoSQL Node.js backend, handling structured clinical documents at production scale.",
      "Architected a multi-tenant SaaS backend in NestJS with tenant isolation enforced at the framework level, not by convention.",
      "Owned complex feature delivery end to end, from architecture decisions to production rollout.",
    ],
  },
  {
    role: "Full Stack Software Developer",
    company: "abectiv s.r.o",
    location: "Czech Republic (remote)",
    start: "Nov 2023",
    end: "Dec 2024",
    summary:
      "Backend services and internal tooling for trading and operational systems, where query performance and data integrity were non-negotiable.",
    highlights: [
      "Architected backend services in NestJS and PostgreSQL — scalable APIs, background jobs, and automation workflows.",
      "Built internal tools in React and NestJS with role-based access and real-time data handling.",
      "Designed and optimized database schemas across trading and operational systems.",
    ],
  },
  {
    role: "Technical Consultant & Software Engineer",
    company: "Independent — Fiverr / Upwork",
    location: "Remote",
    start: "Jan 2022",
    end: "Nov 2023",
    summary:
      "Freelance technical consulting for individual clients and enterprises, across the full stack.",
    highlights: [
      "Delivered custom software using Next.js, Vue.js, and modern JavaScript frameworks.",
      "Built scalable backend systems in Node.js, NestJS, and Python.",
      "Designed REST APIs, automation workflows, and SQL/NoSQL-backed architectures for a wide range of client needs.",
    ],
  },
  {
    role: "Full Stack Software Developer",
    company: "Kiuub Studio",
    location: "Slovakia (remote)",
    start: "Apr 2022",
    end: "Aug 2023",
    summary:
      "Bridging a no-code frontend platform to real backend logic for a distributed, cross-functional team.",
    highlights: [
      "Architected Node.js backend systems integrated with WeWeb, building scalable APIs and authentication flows.",
      "Built web scraping and automation tools feeding PostgreSQL and NoSQL-based systems.",
      "Collaborated with a distributed team of designers, low-code builders, and product stakeholders on architecture and delivery.",
    ],
  },
];
