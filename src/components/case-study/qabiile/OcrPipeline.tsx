"use client";

import { motion } from "framer-motion";

/**
 * The NID OCR pipeline: a NestJS API and a Go worker passing work through two
 * plain Redis lists, each with a processing list behind it. The shape is the
 * argument - nothing is shared between the two languages except four key names
 * and a JSON payload.
 */
export function OcrPipeline({
  caption = "Two runtimes, one queue, and no shared library between them.",
}: {
  caption?: string;
}) {
  const box = (x: number, y: number, w: number, h: number, key: string) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill="var(--paper)"
      stroke="var(--ink)"
      strokeWidth={1.5}
    />
  );

  const ghost = (x: number, y: number, w: number, h: number, key: string) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill="none"
      stroke="var(--ink)"
      strokeWidth={1.25}
      strokeDasharray="6 7"
      opacity={0.55}
    />
  );

  const title = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={21} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );

  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={15} fill="var(--ink)" opacity={0.7}>
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
          viewBox="0 0 1200 560"
          className="h-auto w-full min-w-[620px]"
          role="img"
          aria-label="Flow diagram: the NestJS API presigns image URLs and pushes a JSON job onto the Redis list nidocr jobs; the Go OCR worker pops it with BRPOPLPUSH, reads the card's MRZ and VIZ, and pushes a result onto nidocr results; the API's results loop pops that and matches it against the user's claim. Each list has a processing list behind it so a crash mid-job loses nothing."
        >
          <defs>
            <marker
              id="ocr-arrow"
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

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#ocr-arrow)">
            <path d="M320,120 L466,120" />
            <path d="M730,120 L876,120" />
            <path d="M1010,180 C1010,290 940,360 736,360" />
            <path d="M470,360 L326,360" />
          </g>

          {box(60, 60, 260, 120, "api")}
          {title("NestJS API", 190, 110)}
          {sub("presign S3 urls, RPUSH job", 190, 138)}

          {box(470, 60, 260, 120, "jobs")}
          {title("{nidocr}:jobs", 600, 110)}
          {sub("plain Redis list", 600, 138)}
          {ghost(470, 196, 260, 46, "jobs-processing")}
          <text x={600} y={225} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.65}>
            {"{nidocr}:jobs:processing"}
          </text>

          {box(880, 60, 260, 120, "worker")}
          {title("Go OCR worker", 1010, 110)}
          {sub("MRZ + VIZ, upscale retry", 1010, 138)}

          {box(470, 300, 260, 120, "results")}
          {title("{nidocr}:results", 600, 350)}
          {sub("plain Redis list", 600, 378)}
          {ghost(470, 436, 260, 46, "results-processing")}
          <text x={600} y={465} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.65}>
            {"{nidocr}:results:processing"}
          </text>

          {box(60, 300, 260, 120, "loop")}
          {title("Results loop", 190, 350)}
          {sub("match claim, set status", 190, 378)}

          <text x={393} y={106} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
            rpush
          </text>
          <text x={803} y={106} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
            brpoplpush
          </text>
          <text x={900} y={300} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
            rpush result
          </text>
          <text x={398} y={346} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
            brpoplpush
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
