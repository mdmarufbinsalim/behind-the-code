"use client";

import { motion } from "framer-motion";

/**
 * Getting into Qabiile. Invite-only isn't a marketing line here - it is five
 * backend steps, two secrets with different lifetimes, and a token that is
 * only good for finishing the registration it was issued for.
 */
export function InviteFunnel({
  caption = "Five steps, three tokens, and no way in that doesn't start with an admin.",
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
    <text x={cx} y={y} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );

  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
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
          viewBox="0 0 1240 300"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="Flow diagram of the invite-only signup: an admin sends an invite, the user receives an emailed code, verifying it returns a short-lived registration token, completing registration issues the JWT pair, and onboarding - avatar, interests, clan - is submitted as one request."
        >
          <defs>
            <marker
              id="invite-arrow"
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

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#invite-arrow)">
            <path d="M242,150 L272,150" />
            <path d="M494,150 L524,150" />
            <path d="M746,150 L776,150" />
            <path d="M998,150 L1028,150" />
          </g>

          {box(20, 90, 222, 120, "admin")}
          {title("Admin invite", 131, 138)}
          {sub("email + one-time code", 131, 164)}

          {box(272, 90, 222, 120, "verify")}
          {title("verify-invite", 383, 138)}
          {sub("code checked, not the user", 383, 164)}

          {box(524, 90, 222, 120, "regtoken")}
          {title("registration token", 635, 138)}
          {sub("short-lived, single purpose", 635, 164)}

          {box(776, 90, 222, 120, "account")}
          {title("account created", 887, 138)}
          {sub("JWT pair, logged in", 887, 164)}

          {box(1028, 90, 192, 120, "onboard")}
          {title("onboarding", 1124, 138)}
          {sub("avatar, interests, clan", 1124, 164)}

          <text x={620} y={258} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.65}>
            onboarding arrives as one request, not five - a half-finished profile is not a state
            worth supporting
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
