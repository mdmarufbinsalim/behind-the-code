"use client";

import { motion } from "framer-motion";

/**
 * What one bid does to a wallet. The fork at the end is why the ledger is
 * append-only: nothing is edited in place, every outcome is another entry.
 */
export function EscrowLifecycle({
  caption = "A bid is a hold, not a payment. Only one of the two endings settles.",
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
          viewBox="0 0 1200 420"
          className="h-auto w-full min-w-[600px]"
          role="img"
          aria-label="Flow diagram: a bid is placed under a pessimistic write lock on the hunt row, which writes a held ledger entry against the bidder's wallet. When the hunt closes the hold either releases, if the bidder was outbid, or settles, if they won."
        >
          <defs>
            <marker
              id="escrow-arrow"
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

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#escrow-arrow)">
            <path d="M320,210 L436,210" />
            <path d="M700,210 C760,210 760,95 796,95" />
            <path d="M700,210 C760,210 760,325 796,325" />
          </g>

          {box(60, 150, 260, 120, "bid")}
          {title("Bid placed", 190, 200)}
          {sub("≥ current + 1, not your hunt", 190, 228)}

          {box(440, 150, 260, 120, "held")}
          {title("held", 570, 200)}
          {sub("ledger entry vs heldBalance", 570, 228)}

          {box(800, 40, 340, 110, "released")}
          {title("outbid → released", 970, 85)}
          {sub("hold returns to spendable balance", 970, 113)}

          {box(800, 270, 340, 110, "settled")}
          {title("won → settled", 970, 315)}
          {sub("Qabi transfers, EXP = floor(Qabi / 10)", 970, 343)}

          <text x={378} y={196} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
            row lock
          </text>
          <text x={772} y={168} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.7}>
            hunt closes
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
