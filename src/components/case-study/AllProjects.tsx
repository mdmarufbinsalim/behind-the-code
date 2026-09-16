"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { GHOST_DASH, GHOST_OPACITY, GHOST_STROKE } from "@/components/sketch/stroke";
import type { CaseStudyFrontmatter } from "@/lib/case-studies";

const ALL = "All";

/** Says back what the filters currently ask for, so the empty state isn't a shrug. */
function describe(org: string, year: string, stacks: string[]): string {
  const parts: string[] = [];
  if (org !== ALL) parts.push(`for ${org}`);
  if (year !== ALL) parts.push(`in ${year}`);
  if (stacks.length === 1) parts.push(`built with ${stacks[0]}`);
  else if (stacks.length > 1) parts.push(`built with ${stacks.slice(0, -1).join(", ")} or ${stacks.at(-1)}`);
  return parts.length ? `No work ${parts.join(" ")}.` : "No work matches.";
}

export function AllProjects({ projects }: { projects: CaseStudyFrontmatter[] }) {
  const [org, setOrg] = useState<string>(ALL);
  const [year, setYear] = useState<string>(ALL);
  const [stacks, setStacks] = useState<string[]>([]);
  const [stackOpen, setStackOpen] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);

  const organizations = useMemo(() => {
    const found = new Set<string>();
    projects.forEach((p) => p.organization && found.add(p.organization));
    return [ALL, ...[...found].sort()];
  }, [projects]);

  const years = useMemo(() => {
    const found = new Set<string>();
    projects.forEach((p) => p.year && found.add(p.year));
    return [ALL, ...[...found].sort((a, b) => Number(b) - Number(a))];
  }, [projects]);

  /** Every technology, commonest first - the useful ones shouldn't need scrolling to. */
  const allStacks = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [projects]);

  const shown = useMemo(
    () =>
      projects.filter((p) => {
        if (org !== ALL && p.organization !== org) return false;
        if (year !== ALL && p.year !== year) return false;
        // Any one of the selected technologies is enough: picking two is asking
        // "show me work in either of these", which is how people actually scan
        // a portfolio.
        return stacks.length === 0 || stacks.some((s) => p.stack.includes(s));
      }),
    [projects, org, year, stacks],
  );

  // Close the stack menu on an outside click or Escape, like any other menu.
  useEffect(() => {
    if (!stackOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!stackRef.current?.contains(e.target as Node)) setStackOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStackOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [stackOpen]);

  const toggleStack = (s: string) =>
    setStacks((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const filtering = org !== ALL || year !== ALL || stacks.length > 0;

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-10 flex flex-col items-stretch gap-3 border-y border-neutral-200 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4 dark:border-neutral-800">
        {/* organisation: few enough to sit in the open */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="w-10 shrink-0 text-xs tracking-wide text-neutral-400 uppercase sm:w-auto dark:text-neutral-500">
            For
          </span>
          {organizations.map((o) => {
            const active = org === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setOrg(o)}
                aria-pressed={active}
                className={`relative cursor-pointer text-sm transition-opacity hover:opacity-60 ${
                  active ? "" : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {o}
                {active && (
                  <motion.span
                    layoutId="org-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-[var(--ink)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden h-4 w-px bg-neutral-200 sm:block dark:bg-neutral-800" />

        {/* year: few, and people scan by it */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="w-10 shrink-0 text-xs tracking-wide text-neutral-400 uppercase sm:w-auto dark:text-neutral-500">
            Year
          </span>
          {years.map((y) => {
            const active = year === y;
            return (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                aria-pressed={active}
                aria-label={y === ALL ? "All years" : `Year ${y}`}
                className={`relative cursor-pointer text-sm transition-opacity hover:opacity-60 ${
                  active ? "" : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {y}
                {active && (
                  <motion.span
                    layoutId="year-underline"
                    className="absolute -bottom-1 left-0 h-px w-full bg-[var(--ink)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <span className="hidden h-4 w-px bg-neutral-200 sm:block dark:bg-neutral-800" />

        {/* stack: too many to leave lying around, so they live in a menu */}
        <div ref={stackRef} className="relative flex items-center gap-x-4">
          <span className="w-10 shrink-0 text-xs tracking-wide text-neutral-400 uppercase sm:hidden dark:text-neutral-500">
            Built
          </span>
          <button
            type="button"
            onClick={() => setStackOpen((v) => !v)}
            aria-expanded={stackOpen}
            className="flex cursor-pointer items-center gap-1.5 text-sm transition-opacity hover:opacity-60"
          >
            <span className={stacks.length ? "" : "text-neutral-500 dark:text-neutral-400"}>
              Stack{stacks.length > 0 && ` · ${stacks.length}`}
            </span>
            <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden="true">
              <path
                d="M1 1.5 L5 5.5 L9 1.5"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <AnimatePresence>
            {stackOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="absolute top-8 left-0 z-20 grid max-h-[60vh] w-[min(23rem,calc(100vw-3rem))] grid-cols-1 gap-x-4 gap-y-1 overflow-auto border border-neutral-200 bg-[var(--paper)] p-3 shadow-sm sm:grid-cols-2 dark:border-neutral-800"
              >
                {allStacks.map(({ name, count }) => {
                  const on = stacks.includes(name);
                  return (
                    <label
                      key={name}
                      className="flex cursor-pointer items-center gap-2 py-1 text-sm hover:opacity-60"
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleStack(name)}
                        className="h-3.5 w-3.5 accent-[var(--ink)]"
                      />
                      <span className={on ? "" : "text-neutral-600 dark:text-neutral-300"}>
                        {name}
                      </span>
                      <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4 border-t border-neutral-200 pt-3 text-sm text-neutral-500 sm:ml-auto sm:border-0 sm:pt-0 dark:border-neutral-800 dark:text-neutral-400">
          <span>
            {shown.length} {shown.length === 1 ? "project" : "projects"}
          </span>
          {filtering && (
            <button
              type="button"
              onClick={() => {
                setOrg(ALL);
                setYear(ALL);
                setStacks([]);
              }}
              className="cursor-pointer underline decoration-1 underline-offset-4 hover:opacity-60"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* what's actually on, and one click to take any of it off */}
      {stacks.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {stacks.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStack(s)}
              aria-label={`Remove ${s} filter`}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1 text-xs hover:opacity-60 dark:border-neutral-700"
            >
              {s}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {shown.length > 0 && (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((frontmatter, i) => (
              <motion.div
                key={frontmatter.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-full"
              >
                <CaseStudyCard frontmatter={frontmatter} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {shown.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex min-h-[18rem] flex-1 flex-col items-center justify-center gap-3 px-6 text-center"
          style={{
            border: `${GHOST_STROKE}px dashed var(--ink)`,
            borderRadius: "0.25rem",
            opacity: GHOST_OPACITY + 0.35,
          }}
        >
          <p className="font-hand text-2xl">Nothing here matches that. Yet.</p>
          <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
            {describe(org, year, stacks)}
          </p>
          <button
            type="button"
            onClick={() => {
              setOrg(ALL);
              setYear(ALL);
              setStacks([]);
            }}
            className="mt-2 cursor-pointer text-sm underline decoration-1 underline-offset-4 hover:opacity-60"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
