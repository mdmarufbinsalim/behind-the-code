"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// startViewTransition isn't in every TS lib.dom yet; feature-detected below.
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

const SWEEP_MS = 800;
// Short and front-loaded: the circle leaves the button fast and eases into the
// corners, so the switch reads as instant while the sweep is still legible.
const SWEEP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function applyTheme(next: boolean) {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function toggle() {
    const next = !isDark;
    const button = buttonRef.current;
    const doc = document as DocumentWithViewTransition;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!button || !doc.startViewTransition || reducedMotion) {
      applyTheme(next);
      return;
    }

    // Circle centred on the toggle, sized to whichever screen corner is
    // furthest away, so at full radius it always covers the whole viewport.
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const pinhole = `circle(0px at ${x}px ${y}px)`;
    const fullScreen = `circle(${radius}px at ${x}px ${y}px)`;

    // Going dark, night spreads out of the button: clip the incoming theme
    // open. Going light, day is already everywhere and the dark page drains
    // back into the button: clip the *outgoing* theme shut instead, with the
    // stacking flipped (see globals.css) so it stays on top as it shrinks.
    const root = document.documentElement;
    const goingDark = next;
    root.dataset.themeSweep = goingDark ? "expand" : "collapse";

    // flushSync: the browser snapshots the DOM the moment this callback
    // returns, so React has to have committed the class change by then.
    const transition = doc.startViewTransition(() => {
      flushSync(() => applyTheme(next));
    });

    transition.ready.then(() => {
      root.animate(
        { clipPath: goingDark ? [pinhole, fullScreen] : [fullScreen, pinhole] },
        {
          duration: SWEEP_MS,
          easing: SWEEP_EASING,
          // Without this the clip is dropped the moment the animation ends,
          // and the snapshot flashes back to full-screen for the frame or two
          // before the browser tears the pseudo tree down — a dark blink at
          // the end of the collapse.
          fill: "forwards",
          pseudoElement: goingDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      );
    });

    transition.finished.finally(() => {
      delete root.dataset.themeSweep;
    });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex h-8 w-8 items-center justify-center text-neutral-900 dark:text-neutral-100 ${className}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden="true">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth={1.6} />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6M18.5 18.5l-1.6-1.6M7.1 7.1 5.5 5.5"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
