"use client";

import { useEffect, useState, type RefObject } from "react";
import { motion } from "framer-motion";

type Point = [number, number];
type Box = { top: number; left: number; width: number; height: number };

export function SketchConnector({
  fromRef,
  toRef,
  containerRef,
}: {
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [box, setBox] = useState<Box | null>(null);
  const [linePath, setLinePath] = useState("");
  const [headPath, setHeadPath] = useState("");

  useEffect(() => {
    const from = fromRef.current;
    const to = toRef.current;
    if (!from || !to) return;

    function measure() {
      const container = containerRef.current;
      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      const startX = fromRect.right - containerRect.left + 10;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      // The heading now sits on the right, so approach its top-left
      // corner from above — the line never travels through its own
      // text row, only toward it.
      const endX = toRect.left - containerRect.left - 14;
      const endY = toRect.top - containerRect.top - 6;

      if (endY - startY < 60 || endX - startX < 60) {
        setBox(null);
        return;
      }

      const margin = 40;
      const top = startY - margin;
      const left = startX - margin;
      const width = endX - startX + margin * 2;
      const height = endY - startY + margin * 2;

      setBox({ top, left, width, height });

      const sx = startX - left;
      const sy = startY - top;
      const ex = endX - left;
      const ey = endY - top;

      // Classic S-curve: both control points sit at the horizontal
      // midpoint, one level with the start, one level with the end.
      // Continuously varying curvature with a single inflection —
      // no seams, no jitter.
      const midX = sx + (ex - sx) * 0.5;
      const cp1: Point = [midX, sy];
      const cp2: Point = [midX, ey];

      setLinePath(
        `M ${sx} ${sy} C ${cp1[0]} ${cp1[1]}, ${cp2[0]} ${cp2[1]}, ${ex} ${ey}`
      );

      const angle = Math.atan2(ey - cp2[1], ex - cp2[0]);
      const headLen = 12;
      const spread = 0.45;
      const a1: Point = [
        ex - headLen * Math.cos(angle - spread),
        ey - headLen * Math.sin(angle - spread),
      ];
      const a2: Point = [
        ex - headLen * Math.cos(angle + spread),
        ey - headLen * Math.sin(angle + spread),
      ];

      setHeadPath(`M ${a1[0]} ${a1[1]} L ${ex} ${ey} L ${a2[0]} ${a2[1]}`);
    }

    // `from`/`to` are animated by framer-motion via CSS transforms, which
    // move getBoundingClientRect() results without firing resize/layout
    // events. Keep re-measuring on every frame for a bit after mount and
    // again once the target scrolls into view (its whileInView animation
    // kicks off then), so the arrow settles on the final, post-animation
    // positions instead of freezing on a mid-animation snapshot.
    let rafId: number | null = null;
    function settleFor(ms: number) {
      const stopAt = performance.now() + ms;
      function tick() {
        measure();
        if (performance.now() < stopAt) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null;
        }
      }
      if (rafId !== null) cancelAnimationFrame(rafId);
      tick();
    }

    settleFor(1500);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          settleFor(800);
        }
      },
      { threshold: 0 }
    );
    observer.observe(to);

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [fromRef, toRef, containerRef]);

  if (!box) return null;

  return (
    <svg
      className="pointer-events-none absolute hidden lg:block"
      style={{
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        overflow: "visible",
      }}
      aria-hidden="true"
    >
      <motion.path
        d={linePath}
        stroke="var(--ink)"
        strokeWidth={2}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, margin: "-120px" }}
        transition={{ duration: 1.54, ease: "easeInOut" }}
      />
      <motion.path
        d={headPath}
        stroke="var(--ink)"
        strokeWidth={2}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, margin: "-120px" }}
        transition={{ duration: 0.42, delay: 1.47, ease: "easeInOut" }}
      />
    </svg>
  );
}
