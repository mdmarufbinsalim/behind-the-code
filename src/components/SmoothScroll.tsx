"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // The browser's own scroll restoration fights Lenis on refresh — it
    // restores the native scrollY before Lenis has mounted, then Lenis
    // constructs from that already-scrolled position instead of the top.
    // Manual restoration plus the explicit reset below keeps refresh (and
    // route changes, handled in the effect below) landing at the top.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

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

    // Expandable: closing a section on purpose sends the reader on to
    // whatever comes next (see Expandable.tsx) rather than leaving them
    // wherever the collapse happened to land the viewport. -65 matches its
    // NAV_CLEARANCE, so the next section's top clears the nav the same way
    // the pinned toggle bar does.
    const onScrollTo = (e: Event) => {
      const target = (e as CustomEvent<HTMLElement>).detail;
      if (target) lenis.scrollTo(target, { offset: -65 });
    };
    window.addEventListener("case-study:scroll-to", onScrollTo);

    // Same ResizeObserver blind spot as the route-change one below: opening
    // or closing a <details> (Expandable) changes the document's scroll
    // height without changing html's own box, so Lenis never notices on its
    // own. `toggle` doesn't bubble, so this has to listen on the capture
    // phase to catch it from every <details> on the page. Expandable now
    // animates its height rather than snapping it (see globals.css), so the
    // scroll height at the instant `toggle` fires is still the pre-animation
    // one — resize again once that transition actually finishes.
    const onToggle = () => lenis.resize();
    document.addEventListener("toggle", onToggle, true);

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "grid-template-rows") lenis.resize();
    };
    document.addEventListener("transitionend", onTransitionEnd, true);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("lightbox:open", stop);
      window.removeEventListener("lightbox:close", start);
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("transitionend", onTransitionEnd, true);
      window.removeEventListener("case-study:scroll-to", onScrollTo);
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
  //
  // Next's router doesn't reset native scroll on a client-side navigation
  // the way a full load does, and Lenis tracks its own animated position on
  // top of that — so a route change also needs an explicit, immediate jump
  // to the top rather than relying on either of them to do it alone.
  useEffect(() => {
    lenisRef.current?.resize();
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
