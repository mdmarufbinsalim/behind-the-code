"use client";

import { motion } from "framer-motion";

/**
 * Permissions as data, not as scattered if-checks. A role is just a list of
 * "action:subject" strings; the ability built from them is what every guard
 * actually asks.
 */
export function RbacDiagram({
  caption = "A permission is a string until request time - then it's a rule a guard can actually ask a question of.",
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
  const title = (label: string, cx: number, y: number, size = 17) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={size} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );
  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={12.5} fill="var(--ink)" opacity={0.7}>
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
          viewBox="0 0 1240 260"
          className="h-auto w-full min-w-[640px]"
          role="img"
          aria-label="Flow diagram: a role in the database holds permission codes such as update colon file. CaslAbilityFactory reads that role's codes for the current user and builds an ability object at request time. A guard then asks the ability whether the user can perform the requested action on the requested subject, and allows or rejects the request based on that single check."
        >
          <defs>
            <marker id="rb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#rb-arrow)">
            <path d="M300,110 L346,110" />
            <path d="M654,110 L700,110" />
            <path d="M1008,110 L1054,110" />
          </g>

          {box(20, 60, 280, 100, "role")}
          {title("Role", 160, 98, 15)}
          {sub('permission codes:', 160, 118)}
          {sub('"update:File", "read:User"', 160, 136)}

          {box(360, 40, 294, 140, "factory")}
          {title("CaslAbilityFactory", 507, 78, 15)}
          {sub("reads this user's role codes", 507, 100)}
          {sub("builds an ability, per request", 507, 118)}
          {sub("— not cached, never stale", 507, 136)}

          {box(714, 60, 294, 100, "ability")}
          {title("AppAbility", 861, 98, 15)}
          {sub("can(action, subject) → boolean", 861, 118)}

          {box(1068, 40, 152, 140, "guard")}
          {title("Guard", 1144, 90, 15)}
          {sub("allow", 1144, 118)}
          {sub("or 403", 1144, 138)}

          <text x={620} y={220} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            platform staff and tenant users share this exact same mechanism -
          </text>
          <text x={620} y={240} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            only the role table each one reads from is different
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
