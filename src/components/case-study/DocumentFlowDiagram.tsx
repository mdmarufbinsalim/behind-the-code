"use client";

import { motion } from "framer-motion";

/**
 * How a Clerkal note moves: voice, the record and the AI layer feed one Slate
 * document, which renders as two serialisations that merge back into a single
 * compiled note before it lands in the practice's PMS.
 */
export function DocumentFlowDiagram({
  caption = "One document. Two serialisations: the one you click, and the one the record keeps.",
}: {
  caption?: string;
}) {
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    key: string,
  ) => (
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

  const pill = (label: string, cx: number, cy: number) => (
    <g key={label}>
      <rect
        x={cx - 110}
        y={cy - 22}
        width={220}
        height={44}
        rx={22}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1.25}
        opacity={0.6}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize={17}
        fill="var(--ink)"
      >
        {label}
      </text>
    </g>
  );

  const pillCenters = [227, 301, 375, 449, 523];
  const pillLabels = ["button", "dropdown", "checkbox", "input", "grid"];

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10"
    >
      <svg
        viewBox="0 0 1400 680"
        className="h-auto w-full"
        role="img"
        aria-label="Flow diagram: voice, the database and the AI layer feed one Slate document (button, dropdown, checkbox, input, grid), which renders as an interactive note and a plain-text note, both merging into a compiled note that lands in the practice's PMS."
      >
        <defs>
          <marker
            id="doc-flow-arrow"
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

        <g
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.75}
          markerEnd="url(#doc-flow-arrow)"
        >
          <path d="M190,140 L276,140" />
          <path d="M190,340 L276,340" />
          <path d="M190,540 L276,540" />
          <path d="M580,340 C640,340 640,190 676,190" />
          <path d="M580,340 C640,340 640,490 676,490" />
          <path d="M940,190 C966,190 966,340 986,340" />
          <path d="M940,490 C966,490 966,340 986,340" />
          <path d="M1190,340 L1236,340" />
        </g>

        {box(30, 102, 160, 76, "voice")}
        {box(30, 302, 160, 76, "db")}
        {box(30, 502, 160, 76, "ai")}
        <text x={110} y={146} textAnchor="middle" fontSize={19} fill="var(--ink)">
          Voice input
        </text>
        <text x={110} y={346} textAnchor="middle" fontSize={19} fill="var(--ink)">
          Database
        </text>
        <text x={110} y={546} textAnchor="middle" fontSize={19} fill="var(--ink)">
          AI layer
        </text>

        {box(280, 90, 300, 500, "slate")}
        <text x={430} y={135} textAnchor="middle" fontSize={23} fontWeight={600} fill="var(--ink)">
          Slate document
        </text>
        <text
          x={430}
          y={162}
          textAnchor="middle"
          fontSize={14}
          fill="var(--ink)"
          opacity={0.6}
        >
          one root · five element types
        </text>
        {pillLabels.map((label, i) => pill(label, 430, pillCenters[i]))}

        {box(680, 135, 260, 110, "interactive")}
        <text x={810} y={178} textAnchor="middle" fontSize={21} fontWeight={600} fill="var(--ink)">
          Interactive note
        </text>
        <text x={810} y={206} textAnchor="middle" fontSize={15} fill="var(--ink)" opacity={0.7}>
          (clickable options)
        </text>

        {box(680, 435, 260, 110, "plaintext")}
        <text x={810} y={478} textAnchor="middle" fontSize={21} fontWeight={600} fill="var(--ink)">
          Plain-text note
        </text>
        <text x={810} y={506} textAnchor="middle" fontSize={15} fill="var(--ink)" opacity={0.7}>
          (clean prose)
        </text>

        {box(990, 280, 200, 120, "compiled")}
        <text x={1090} y={332} textAnchor="middle" fontSize={21} fontWeight={600} fill="var(--ink)">
          Compiled note
        </text>
        <text x={1090} y={360} textAnchor="middle" fontSize={15} fill="var(--ink)" opacity={0.7}>
          merged record
        </text>

        {box(1240, 290, 140, 100, "pms")}
        <text x={1310} y={332} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
          Practice's
        </text>
        <text x={1310} y={357} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
          PMS
        </text>
      </svg>

      {caption && (
        <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
