"use client";

import { motion } from "framer-motion";

/**
 * How three codebases stay honest about one API: the spec is emitted from the
 * code that serves the traffic, and everything downstream is generated from it.
 */
export function ContractFlow({
  caption = "One source of truth, and no hand-written client types anywhere downstream.",
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

  const title = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={20} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );

  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
      {label}
    </text>
  );

  const step = (label: string, cx: number) => (
    <text x={cx} y={38} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
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
          viewBox="0 0 1240 220"
          className="h-auto w-full min-w-[620px]"
          role="img"
          aria-label="Flow diagram: the API's DTOs are exported as an OpenAPI spec, the spec generates the shared contracts package, and the web and mobile apps consume it as typed clients."
        >
          <defs>
            <marker
              id="contract-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#contract-arrow)">
            <path d="M290,120 L336,120" />
            <path d="M606,120 L652,120" />
            <path d="M962,120 L1008,120" />
          </g>

          {box(20, 60, 270, 120, "dto")}
          {title("API DTOs", 155, 110)}
          {sub("validated at the edge", 155, 138)}

          {box(340, 60, 266, 120, "spec", true)}
          {title("openapi.json", 473, 110)}
          {sub("OpenAPI 3.0", 473, 138)}

          {box(656, 60, 306, 120, "contracts")}
          {title("contracts package", 809, 110)}
          {sub("generated TS types", 809, 138)}

          {box(1012, 60, 212, 120, "clients")}
          {title("Web + mobile", 1118, 110)}
          {sub("typed clients", 1118, 138)}

          {step("openapi:export", 313)}
          {step("openapi-typescript", 629)}
          {step("consumed by", 985)}
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
