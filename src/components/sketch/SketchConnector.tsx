"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  GHOST_DASH,
  GHOST_OPACITY,
  GHOST_STROKE,
  SKETCH_STROKE,
} from "@/components/sketch/stroke";

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

  return <ConnectorSvg box={box} linePath={linePath} headPath={headPath} />;
}

// Split out so the ref `useScroll` tracks exists on this component's very
// first render — the parent renders nothing until it has measured.
function ConnectorSvg({
  box,
  linePath,
  headPath,
}: {
  box: Box;
  linePath: string;
  headPath: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  // The line draws itself as the arrow's own span scrolls through the
  // viewport: nothing at the moment it appears from the bottom, complete
  // by the time its tip has climbed to the middle of the screen.
  const { scrollYProgress } = useScroll({
    // useScroll's target is typed for HTML elements; an SVG root tracks fine.
    target: svgRef as unknown as RefObject<HTMLElement>,
    offset: ["start 0.92", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  // The head only lands in the last stretch, once the line has arrived.
  const headLength = useTransform(progress, [0.84, 1], [0, 1], { clamp: true });

  return (
    <svg
      ref={svgRef}
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
      {/* Ghost: the whole route, dotted and faint, always visible so the
          scroll-drawn stroke reads as tracing a path that was already there. */}
      <path
        d={linePath}
        stroke="var(--ink)"
        strokeWidth={GHOST_STROKE}
        strokeOpacity={GHOST_OPACITY}
        strokeDasharray={GHOST_DASH}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={headPath}
        stroke="var(--ink)"
        strokeWidth={GHOST_STROKE}
        strokeOpacity={GHOST_OPACITY}
        strokeDasharray={GHOST_DASH}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d={linePath}
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
        style={{ pathLength: progress }}
      />
      <motion.path
        d={headPath}
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
        style={{ pathLength: headLength }}
      />
    </svg>
  );
}
