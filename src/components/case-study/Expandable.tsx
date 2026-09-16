"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SKETCH_STROKE } from "@/components/sketch/stroke";

// Where the pinned bar sits, and the boundary a section counts as "read
// past" - Nav.tsx's height doesn't vary by content, so it's safe to
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
        <g className="origin-[14px_14px] transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-data-[open=true]/expandable:rotate-45">
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

const BAR_CLASSES =
  "z-30 flex items-center gap-3 border-b bg-white/90 py-3 backdrop-blur-sm dark:bg-[var(--paper)]/90";

/**
 * A section heading that doubles as its own disclosure control: `title` is
 * the section's `<h2>`, rendered inside the toggle itself so heading and
 * expand affordance sit on one line. `label` names the hidden material for
 * assistive tech only (the accessible name is "Show/Hide {label}" - the
 * visible text is just the title, so a screen reader announcement of the
 * heading text twice doesn't happen).
 *
 * A plain div driven by React state, not a native <details> - <details>'s
 * UA display:none-when-closed applies to *every* non-summary child, which
 * would hide the always-visible intro paragraph/figure between the toggle
 * and the collapsible <ExpandableDetail> region too, not just the region
 * itself.
 *
 * The toggle bar pins to the top of the viewport for exactly as long as
 * *this* section is open and still being scrolled through, not a moment
 * longer: a scroll-driven measurement (not CSS position: sticky, which was
 * tried first) tracks the section's own box directly, so pin/unpin and the
 * auto-collapse below share one boundary instead of two mechanisms that
 * could drift out of sync.
 */
// The grid-rows collapse transition (globals.css) - kept in sync with it so
// the post-close scroll waits for the same span rather than a hardcoded
// guess or a `transitionend` that a scroll-driven auto-collapse racing the
// click can cause to fire before the click's own handler runs.
const COLLAPSE_MS = 420;

export function Expandable({
  title,
  label,
  children,
}: {
  title: string;
  label: string;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState<{ left: number; width: number } | null>(null);

  // Opening reveals content below the always-visible intro/figure, which can
  // land off-screen - so an open scrolls to the top of what just appeared,
  // the same way closing scrolls to what's next. Also tells SmoothScroll to
  // resize (see there): without a native <details>, nothing else signals
  // that the document's scroll height just changed.
  useEffect(() => {
    window.dispatchEvent(new Event("case-study:expandable-toggle"));
    if (!open) return;
    const el = rootRef.current;
    // Waits out the same expand transition closing waits out (below) - measuring
    // before it finishes targets where the content's top *will* be, not where it
    // is yet, and Lenis commits to that stale position instead of the final one.
    const timer = window.setTimeout(() => {
      const detail = el?.querySelector<HTMLElement>(":scope > .expandable-rows");
      if (detail) {
        window.dispatchEvent(new CustomEvent("case-study:scroll-to", { detail }));
      }
    }, COLLAPSE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // A reader closing a section on purpose wants to land back on its own
  // top, not wherever the collapse happened to leave the viewport. Timed
  // off the click rather than the collapse's `transitionend`: that event
  // can already have fired - consumed by the auto-collapse below, which
  // runs on every scroll frame - before this handler even runs, since
  // Lenis keeps easing for a while after the wheel input that triggered it.
  function closeAndReturn() {
    const el = rootRef.current;
    if (!el) return;
    setOpen(false);
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("case-study:scroll-to", { detail: el }));
    }, COLLAPSE_MS);
  }

  // While open: track the section's own box against the nav line. Still
  // straddling it → pinned, positioned to match the section column
  // exactly. Fully scrolled past (bottom above the line) → read, so close
  // it back up rather than leave it open for a reader who's moved on.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !open) {
      setPin(null);
      return;
    }

    let ticking = false;
    let crossed = false;
    function measure() {
      ticking = false;
      const rect = el!.getBoundingClientRect();
      if (rect.bottom <= NAV_CLEARANCE) {
        // No forced scroll here, unlike the deliberate open/close above -
        // this fires while the reader (or another section's own open/close
        // scroll) is already moving past it. Snapping back to its top would
        // fight whatever scroll is already in flight.
        if (!crossed) {
          crossed = true;
          setOpen(false);
        }
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

  const toggleAria = `${open ? "Hide" : "Show"} ${label}`;

  function toggle() {
    if (open) {
      closeAndReturn();
    } else {
      setOpen(true);
    }
  }

  return (
    <div
      ref={rootRef}
      data-expandable
      data-open={open}
      className="group/expandable my-8"
    >
      {/* Stays in the layout (so nothing jumps) even while the pinned copy
          below is the one actually visible. */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={toggleAria}
        className={`cursor-pointer border-transparent text-left group-data-[open=true]/expandable:border-neutral-200/80 dark:group-data-[open=true]/expandable:border-neutral-800/80 ${BAR_CLASSES} ${pin ? "invisible" : ""}`}
      >
        <h2>{title}</h2>
        <ToggleIcon />
      </button>

      {pin && (
        <button
          type="button"
          onClick={closeAndReturn}
          aria-expanded={open}
          aria-label={toggleAria}
          style={{ top: NAV_CLEARANCE, left: pin.left, width: pin.width }}
          className={`fixed cursor-pointer border-neutral-200/80 text-left dark:border-neutral-800/80 ${BAR_CLASSES}`}
        >
          <h2>{title}</h2>
          <ToggleIcon />
        </button>
      )}

      {children}
    </div>
  );
}

/**
 * The material inside an `<Expandable>` that's actually hidden until
 * toggled - everything else passed as children stays visible always. Must
 * be a direct child of `<Expandable>`: the CSS collapse (globals.css) keys
 * off `[data-expandable] > .expandable-rows`.
 */
export function ExpandableDetail({ children }: { children: ReactNode }) {
  return (
    <div className="expandable-rows">
      <div className="expandable-clip">
        <div className="dotted-rule-v mt-5 pl-5">{children}</div>
      </div>
    </div>
  );
}
