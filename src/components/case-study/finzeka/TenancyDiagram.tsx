"use client";

import { motion } from "framer-motion";

/**
 * How one request ends up talking to the right tenant's data. The schema
 * switch happens once, early, and everything after it - repositories,
 * services, controllers - just uses the connection it was handed.
 */
export function TenancyDiagram({
  caption = "One Postgres database, one schema per tenant, chosen by subdomain before a single query runs.",
}: {
  caption?: string;
}) {
  const box = (x: number, y: number, w: number, h: number, key: string, dashed = false) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill={dashed ? "none" : "var(--paper)"}
      stroke="var(--ink)"
      strokeWidth={dashed ? 1.25 : 1.5}
      strokeDasharray={dashed ? "6 7" : undefined}
      opacity={dashed ? 0.75 : 1}
    />
  );
  const title = (label: string, cx: number, y: number, size = 18) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={size} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );
  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
      {label}
    </text>
  );

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10"
    >
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 1240 420"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="Flow diagram: a request arrives at acme.finzeka.com, middleware reads the subdomain and marks the request as tenant-scoped, a query runner connects and runs SET search_path TO the tenant's schema, every repository for the rest of the request uses that same connection, and it is released when the request finishes. A second request for a different subdomain repeats the process against a different schema in the same database."
        >
          <defs>
            <marker id="tn-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#tn-arrow)">
            <path d="M232,80 L278,80" />
            <path d="M544,80 L590,80" />
            <path d="M856,80 L902,80" />
            <path d="M1010,140 C1010,220 1010,220 1010,266" />
          </g>

          {box(20, 30, 212, 100, "req")}
          {title("acme.finzeka", 126, 68, 15)}
          {sub(".com/api/...", 126, 88)}

          {box(282, 30, 262, 100, "mw")}
          {title("Scope middleware", 413, 68, 15)}
          {sub("subdomain → slug", 413, 88)}

          {box(594, 30, 262, 100, "runner")}
          {title("Query runner", 725, 68, 15)}
          {sub('SET search_path TO "acme"', 725, 88)}

          {box(906, 30, 240, 100, "acme")}
          {title("acme schema", 1026, 68, 15)}
          {sub("this request only", 1026, 88)}

          {/* the shared database, with several tenant schemas inside it */}
          {box(700, 240, 460, 150, "db")}
          {title("one Postgres database", 930, 268, 15)}
          {box(730, 290, 130, 70, "s1")}
          {sub("acme", 795, 330)}
          {box(872, 290, 130, 70, "s2")}
          {sub("globex", 937, 330)}
          {box(1014, 290, 130, 70, "s3")}
          {sub("initech", 1079, 330)}

          <text x={360} y={370} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            every repository in this request reuses that one connection
          </text>
          <text x={360} y={392} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            and it is released when the request finishes
          </text>
        </svg>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
