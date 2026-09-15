"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.54,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Internal hash links (nav, hero CTA, "back to the story", etc.)
    // should scroll smoothly through Lenis too, not just jump natively.
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a[href*='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const path = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex + 1);
      if (!hash) return;
      if (path && path !== window.location.pathname) return;

      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
      history.pushState(null, "", `#${hash}`);
    }

    document.addEventListener("click", onClick);

    // A fullscreen lightbox can't stop the page moving behind it by hiding
    // overflow, because Lenis scrolls the window itself.
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("lightbox:open", stop);
    window.addEventListener("lightbox:close", start);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("lightbox:open", stop);
      window.removeEventListener("lightbox:close", start);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // `html` has `overflow-x: clip` (see globals.css) to keep position: sticky
  // working, but that puts the root element in "overflow propagated to the
  // viewport" mode: its box height then tracks the viewport, not the
  // document's scroll height, so Lenis's own ResizeObserver-driven auto-resize
  // never notices a route change growing or shrinking the page. Force a
  // recalculation whenever the pathname changes so the wheel-scroll limit
  // matches the new page instead of the one Lenis was created on.
  useEffect(() => {
    lenisRef.current?.resize();
  }, [pathname]);

  return null;
}
