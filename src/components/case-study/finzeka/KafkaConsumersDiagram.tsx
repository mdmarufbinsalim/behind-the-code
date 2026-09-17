"use client";

import { motion } from "framer-motion";

/**
 * One producer, two topics, two consumers that don't know about each other -
 * each with its own scaling, its own failure domain, and no way for a slow
 * consumer to slow down the request that triggered it.
 */
export function KafkaConsumersDiagram({
  caption = "The API never waits for either of these - it publishes and moves on.",
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
  const title = (t: string, cx: number, y: number, size = 16) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={size} fontWeight={600} fill="var(--ink)">
      {t}
    </text>
  );
  const sub = (t: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={12.5} fill="var(--ink)" opacity={0.7}>
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
          aria-label="Flow diagram: finzeka-core publishes onto two Kafka topics and returns immediately. The audit-events topic is consumed independently by finzeka-auditlogs, which persists events and serves the audit query and export endpoints. The document-parsing topic is consumed independently by finzeka-documentparser, which extracts document contents and reports back. Neither consumer can slow down the request that published the event, and a failure in one does not affect the other."
        >
          <defs>
            <marker id="kc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#kc-arrow)">
            <path d="M256,140 C300,140 300,80 344,80" />
            <path d="M256,200 C300,200 300,260 344,260" />
            <path d="M600,80 L646,80" />
            <path d="M600,260 L646,260" />
          </g>

          {box(20, 130, 236, 80, "core")}
          {title("finzeka-core", 138, 172, 15)}
          {sub("publishes, returns immediately", 138, 195)}

          {box(344, 30, 256, 100, "audit-topic", true)}
          {title("audit-events", 472, 70, 14)}
          {sub("Kafka topic", 472, 92)}

          {box(344, 210, 256, 100, "doc-topic", true)}
          {title("document-parsing", 472, 250, 14)}
          {sub("Kafka topic", 472, 272)}

          {box(650, 20, 570, 120, "auditlogs")}
          {title("finzeka-auditlogs", 935, 62, 16)}
          {sub("consumes independently, persists events,", 935, 84)}
          {sub("serves the audit query + export endpoints", 935, 104)}

          {box(650, 200, 570, 120, "docparser")}
          {title("finzeka-documentparser", 935, 242, 16)}
          {sub("consumes independently, extracts contents,", 935, 264)}
          {sub("reports back through the API", 935, 284)}

          <text x={620} y={370} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            neither consumer can slow the request that published the event -
          </text>
          <text x={620} y={392} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            and a failure in one has no effect on the other
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
