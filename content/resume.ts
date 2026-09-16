export type ResumeJob = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResumeSchool = {
  institution: string;
  qualification: string;
  location?: string;
  date: string;
};

export type ResumeReference = {
  name: string;
  title: string;
  organization: string;
  email: string;
};

export const resume = {
  name: "Md. Maruf Bin Salim Bhuiyan",
  headline: "Software Engineer",
  location: "Dhaka, Bangladesh",
  phone: "+880 1726 442155",
  email: "mdmarufbinsalim@gmail.com",
  links: [
    { label: "marufspace.vercel.app", href: "https://marufspace.vercel.app/" },
    {
      label: "linkedin.com/in/md-maruf-bin-salim-bhuiyan",
      href: "https://www.linkedin.com/in/md-maruf-bin-salim-bhuiyan/",
    },
    { label: "github.com/mdmarufbinsalim", href: "https://github.com/mdmarufbinsalim" },
  ],
  summary:
    "Software engineer who designs and ships scalable systems where correctness matters - multi-tenant SaaS backends, domain-specific editors, and custom APIs on modern frameworks. Strong ownership of feature delivery end to end, from architecture decisions through production rollout.",
  skills: [
    { group: "Backend", items: ["NestJS", "Node.js", "Express", "Go", "REST API design", "WebSockets"] },
    { group: "Frontend", items: ["React", "Next.js", "Vue", "Nuxt.js", "TypeScript", "Redux Toolkit"] },
    { group: "Data", items: ["PostgreSQL", "MongoDB", "TypeORM", "Redis", "Database & schema design"] },
    { group: "Practice", items: ["Agile / Scrum", "Technical leadership", "Code review", "Scalable architecture", "Multi-tenancy", "Queues & background jobs"] },
    { group: "Platform", items: ["Docker", "AWS", "CI/CD (GitHub Actions)", "Git"] },
  ],
  experience: [
    {
      company: "Mediusware",
      role: "Software Engineer",
      location: "Dhaka, Bangladesh",
      start: "May 2025",
      end: "Present",
      bullets: [
        "Led a team of six across API, web and mobile in Agile cycles - sprint planning, code review, release - building a 31-module NestJS API of 204 endpoints and 6 background workers behind one generated OpenAPI contract.",
        "Architected a multi-tenant SaaS backend in NestJS with tenant isolation enforced at the framework level, alongside a modular, maintainable structure for an enterprise-grade product.",
        "Built a custom Slate-based text editor for clinicians on a Node.js and NoSQL backend, cutting per-keystroke re-renders across documents of 2,000+ custom elements to the single element that changed.",
        "Designed an in-app currency on an append-only ledger with escrowed bidding and row-level locking, so concurrent bids settle without double-spending a balance, and shipped it to production and staging behind automated CI/CD.",
      ],
    },
    {
      company: "abectiv s.r.o",
      role: "Full Stack Software Developer",
      location: "Czech Republic (remote)",
      start: "November 2023",
      end: "December 2024",
      bullets: [
        "Architected backend services in NestJS and PostgreSQL - scalable APIs, background jobs and automation workflows.",
        "Built internal tools in React and NestJS with role-based access and real-time data handling.",
        "Designed database schemas and optimised queries across trading and operational systems, improving performance and protecting data integrity.",
      ],
    },
    {
      company: "Kiuub Studio",
      role: "Full Stack Software Developer",
      location: "Slovakia (remote)",
      start: "April 2022",
      end: "August 2023",
      bullets: [
        "Architected Node.js backend systems integrated with WeWeb - scalable APIs, authentication flows and business logic for low-code and fully custom platforms.",
        "Built web scraping and automation tools for structured data extraction, feeding PostgreSQL and NoSQL systems.",
        "Worked with a distributed team of designers, low-code builders and product stakeholders on architecture and delivery.",
      ],
    },
    {
      company: "Independent - Fiverr / Upwork",
      role: "Software Engineer",
      location: "Remote",
      start: "January 2022",
      end: "November 2023",
      bullets: [
        "Delivered custom software and technical consulting for clients and enterprises using Next.js, Vue.js and modern JavaScript frameworks.",
        "Translated client requirements into scoped, delivered applications, from first conversation to handover.",
      ],
    },
  ] satisfies ResumeJob[],
  education: [
    {
      institution: "North South University",
      qualification: "BSc in Computer Science and Engineering",
      location: "Dhaka, Bangladesh",
      date: "January 2024",
    },
  ] satisfies ResumeSchool[],
  references: [
    {
      name: "Martin Nemeček",
      title: "CTO",
      organization: "Kiuub Studio",
      email: "hey@martinnemecek.com",
    },
    {
      name: "Ondrej Stepanek",
      title: "Founder",
      organization: "abectiv s.r.o",
      email: "obchod@abectiv.com",
    },
  ] satisfies ResumeReference[],
};
