"use client";

import { motion } from "framer-motion";

/**
 * The loop the whole product is built around: doing something earns Qabi and
 * EXP, EXP moves you up a tier, and the tier opens more of the platform. Every
 * arrow in here is a ledger write.
 */
export function EarningLoop({
  caption = "Watch a reel, finish a mission, win a hunt - it all lands in the same ledger.",
}: {
  caption?: string;
}) {
  const tiers = [
    { name: "Çırak", range: "1 - 50" },
    { name: "Kalfa", range: "51 - 100" },
    { name: "Ustad", range: "101 - 150" },
    { name: "more to come", range: "151+" },
  ];

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
          viewBox="0 0 1240 360"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="Loop diagram: an activity such as a mission, a reel or a hunt win writes a ledger entry, the ledger sums into the wallet's cached balances, EXP moves the user up a tier, and the tier unlocks more of the platform, which produces more activity."
        >
          <defs>
            <marker
              id="earn-arrow"
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

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#earn-arrow)">
            <path d="M262,120 L322,120" />
            <path d="M584,120 L644,120" />
            <path d="M906,120 L966,120" />
            {/* the return leg: tiers unlock more to do */}
            <path d="M1100,180 C1100,290 900,300 620,300 C380,300 150,296 140,186" />
          </g>

          <rect x={20} y={60} width={242} height={120} rx={10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
          <text x={141} y={106} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
            Activity
          </text>
          <text x={141} y={132} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            missions, reels, posts,
          </text>
          <text x={141} y={150} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            surveys, hunt wins
          </text>

          <rect x={322} y={60} width={262} height={120} rx={10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
          <text x={453} y={106} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
            Ledger entry
          </text>
          <text x={453} y={132} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            append-only, amount from
          </text>
          <text x={453} y={150} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            reward_settings at runtime
          </text>

          <rect x={644} y={60} width={262} height={120} rx={10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
          <text x={775} y={106} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
            Wallet
          </text>
          <text x={775} y={132} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            balance · heldBalance · exp
          </text>
          <text x={775} y={150} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            all of them sums, not edits
          </text>

          <rect x={966} y={60} width={254} height={120} rx={10} fill="var(--paper)" stroke="var(--ink)" strokeWidth={1.5} />
          <text x={1093} y={106} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
            EXP tier
          </text>
          <text x={1093} y={132} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            gates what the account
          </text>
          <text x={1093} y={150} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
            can reach
          </text>

          <text x={620} y={330} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.65}>
            a tier unlocks more to do, which earns more - the loop is the product
          </text>
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tiers.map((tier) => (
          <div key={tier.name} className="border-t border-neutral-200 pt-3 dark:border-neutral-800">
            <div className="text-lg font-semibold text-[var(--ink)]">{tier.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{tier.range} EXP</div>
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-6 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
