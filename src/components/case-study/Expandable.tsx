"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SKETCH_STROKE } from "@/components/sketch/stroke";

// Where the pinned bar sits, and the boundary a section counts as "read
// past" — Nav.tsx's height doesn't vary by content, so it's safe to
// hardcode rather than plumb through as a variable.
const NAV_CLEARANCE = 65;

function ToggleIcon() {
  return (
    <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center">
      <svg viewBox="0 0 28 28" className="h-7 w-7 overflow-visible" aria-hidden="true">
        <ellipse
          cx="14"
          cy="14"
          rx="12.5"
          ry="11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={SKETCH_STROKE * 0.7}
          className="transition-transform duration-300 ease-out group-hover/expandable:scale-105"
        />
        <g className="origin-[14px_14px] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-open/expandable:rotate-45">
          <line
            x1="14"
            y1="8.5"
            x2="14"
            y2="19.5"
            stroke="currentColor"
            strokeWidth={SKETCH_STROKE * 0.7}
            strokeLinecap="round"
          />
          <line
            x1="8.5"
            y1="14"
            x2="19.5"
            y2="14"
            stroke="currentColor"
            strokeWidth={SKETCH_STROKE * 0.7}
            strokeLinecap="round"
          />
        </g>
      </svg>
    </span>
  );
}

function ToggleLabel({ label }: { label: string }) {
  return (
    <span>
      <span className="group-open/expandable:hidden">Show {label}</span>
      <span className="hidden group-open/expandable:inline">Hide {label}</span>
    </span>
  );
}

const BAR_CLASSES =
  "z-30 flex items-center justify-between gap-3 border-b bg-white/90 py-3 text-sm text-neutral-600 backdrop-blur-sm dark:bg-[var(--paper)]/90 dark:text-neutral-400";

/**
 * The deep material for a section: present in the DOM (so it's searchable
 * and printable) but collapsed by default, opened with a native <details>.
 * `label` names what's inside — rendered as "Show {label}" / "Hide {label}".
 *
 * The toggle bar pins to the top of the viewport for exactly as long as
 * *this* section is open and still being scrolled through, not a moment
 * longer: a scroll-driven measurement (not CSS position: sticky, which was
 * tried first) tracks the <details> box directly, so pin/unpin and the
 * auto-collapse below share one boundary instead of two mechanisms that
 * could drift out of sync.
 */
// The grid-rows collapse transition (globals.css) — kept in sync with it so
// the post-close scroll waits for the same span rather than a hardcoded
// guess or a `transitionend` that a scroll-driven auto-collapse racing the
// click can cause to fire before the click's own handler runs.
const COLLAPSE_MS = 420;

export function Expandable({ label, children }: { label: string; children: ReactNode }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const onToggle = () => setOpen(el.open);
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, []);

  // A reader closing a section on purpose wants to land on whatever comes
  // next, not wherever the collapse happened to leave the viewport. Timed
  // off the click rather than the collapse's `transitionend`: that event
  // can already have fired — consumed by the auto-collapse below, which
  // runs on every scroll frame — before this handler even runs, since
  // Lenis keeps easing for a while after the wheel input that triggered it.
  function closeAndAdvance() {
    const el = detailsRef.current;
    if (!el) return;
    el.open = false;
    const siblings = el.closest(".case-content")?.children;
    const target = siblings && Array.from(siblings)[Array.from(siblings).indexOf(el) + 1];
    if (target instanceof HTMLElement) {
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("case-study:scroll-to", { detail: target }));
      }, COLLAPSE_MS);
    }
  }

  // While open: track the section's own box against the nav line. Still
  // straddling it → pinned, positioned to match the <details> column
  // exactly. Fully scrolled past (bottom above the line) → read, so close
  // it back up rather than leave it open for a reader who's moved on.
  useEffect(() => {
    const el = detailsRef.current;
    if (!el || !open) {
      setPin(null);
      return;
    }

    let ticking = false;
    function measure() {
      ticking = false;
      const rect = el!.getBoundingClientRect();
      if (rect.bottom <= NAV_CLEARANCE) {
        el!.open = false;
        return;
      }
      const within = rect.top <= NAV_CLEARANCE;
      setPin(within ? { left: rect.left, width: rect.width } : null);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  return (
    <details ref={detailsRef} data-expandable className="group/expandable my-8">
      <div className="dotted-rule-h mb-5" aria-hidden="true" />

      {/* Stays in the layout (so nothing jumps) even while the pinned copy
          below is the one actually visible. */}
      <summary
        onClick={(e) => {
          // The native toggle is what should open it — only step in to
          // additionally advance the scroll when this click is the one
          // closing it.
          if (detailsRef.current?.open) {
            e.preventDefault();
            closeAndAdvance();
          }
        }}
        className={`cursor-pointer list-none border-transparent [&::-webkit-details-marker]:hidden group-open/expandable:border-neutral-200/80 dark:group-open/expandable:border-neutral-800/80 ${BAR_CLASSES} ${pin ? "invisible" : ""}`}
      >
        <ToggleLabel label={label} />
        <ToggleIcon />
      </summary>

      {pin && (
        <button
          type="button"
          onClick={closeAndAdvance}
          style={{ top: NAV_CLEARANCE, left: pin.left, width: pin.width }}
          className={`fixed cursor-pointer border-neutral-200/80 text-left dark:border-neutral-800/80 ${BAR_CLASSES}`}
        >
          <ToggleLabel label={label} />
          <ToggleIcon />
        </button>
      )}

      <div className="expandable-rows">
        <div className="expandable-clip">
          <div className="dotted-rule-v mt-5 pl-5">{children}</div>
        </div>
      </div>
    </details>
  );
}
