"use client";

import { motion } from "framer-motion";

/**
 * The failure mode a shared table has, and the one schema-per-tenant
 * structurally can't: one is a missed WHERE clause away from a leak, the
 * other doesn't have a path there at all.
 */
export function IsolationDiagram({
  caption = "Left: one missed WHERE clause, anywhere, ever. Right: no clause to miss.",
}: {
  caption?: string;
}) {
  const box = (x: number, y: number, w: number, h: number, key: string, opts: { dashed?: boolean; stroke?: string } = {}) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={9}
      fill="var(--paper)"
      stroke={opts.stroke ?? "var(--ink)"}
      strokeWidth={opts.dashed ? 1.25 : 1.5}
      strokeDasharray={opts.dashed ? "6 7" : undefined}
    />
  );
  const label = (t: string, cx: number, y: number, size = 13, weight = 600) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={size} fontWeight={weight} fill="var(--ink)">
      {t}
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
          aria-label="Two panels. Left, a shared table: rows from Acme, Globex and Initech sitting in one table, with a query missing its tenant filter shown reaching across into a row that is not its own, labelled one missed WHERE clause, anywhere, ever. Right, schema per tenant: three separate walled schemas, each a self-contained box, with a query aimed at Acme's schema shown structurally unable to reach the others, labelled no clause to miss - the wrong schema fails instead of leaking."
        >
          <defs>
            <marker id="iso-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="#c0392b" />
            </marker>
          </defs>

          {/* LEFT: shared table, a query reaching into the wrong row */}
          {label("One shared table", 300, 30, 15)}
          {box(60, 60, 480, 300, "table")}
          {label('"tenants" table', 300, 90, 12, 500)}

          {[0, 1, 2].map((i) => (
            <g key={`row-${i}`}>
              {box(90, 120 + i * 70, 420, 50, `row-${i}`, i === 1 ? { stroke: "#c0392b" } : {})}
              {label(["Acme row", "Globex row", "Initech row"][i], 300, 150 + i * 70, 13, 500)}
            </g>
          ))}

          <path d="M330,225 C420,225 420,155 500,150" fill="none" stroke="#c0392b" strokeWidth={2} markerEnd="url(#iso-arrow)" strokeDasharray="5 5" />
          <text x={355} y={385} textAnchor="middle" fontSize={12.5} fill="#c0392b">
            a query for Acme, missing its WHERE clause, reads Globex's row
          </text>

          {/* RIGHT: schema per tenant, structurally walled off */}
          {label("Schema per tenant", 940, 30, 15)}
          {box(700, 60, 480, 300, "outer", { dashed: true })}
          {label("one Postgres database", 940, 90, 12, 500)}

          {["acme", "globex", "initech"].map((name, i) => (
            <g key={name}>
              {box(730 + i * 155, 130, 135, 170, `sch-${name}`)}
              {label(name, 797 + i * 155, 220, 13, 600)}
            </g>
          ))}

          <path d="M797,190 L797,250" fill="none" stroke="var(--ink)" strokeWidth={2} markerEnd="url(#iso-arrow)" opacity={0.35} />
          <text x={940} y={385} textAnchor="middle" fontSize={12.5} fill="var(--ink)" opacity={0.75}>
            a connection is pointed at one schema - the others aren&apos;t reachable from it
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
