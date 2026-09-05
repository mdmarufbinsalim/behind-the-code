"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GHOST_DASH,
  GHOST_OPACITY,
  GHOST_STROKE,
  SKETCH_STROKE,
} from "@/components/sketch/stroke";

type Point = [number, number];

// Layout position of `el` inside `container`, walking the offsetParent chain.
// Deliberately not getBoundingClientRect(): the entries are animated with CSS
// transforms (and re-animate every time they re-enter the viewport), which
// would move the measured dots out from under an already-drawn path. Offsets
// ignore transforms, so the wave always lands on the dots' resting positions.
function offsetWithin(el: HTMLElement, container: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return [x, y];
}

function smoothOpenPath(points: Point[]): string {
  let d = `M ${points[0][0]} ${points[0][1]} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]} `;
  }
  return d;
}

export function TimelineWave({
  containerRef,
  dotRefs,
}: {
  containerRef: RefObject<HTMLElement | null>;
  dotRefs: RefObject<HTMLElement | null>[];
}) {
  const [path, setPath] = useState("");
  const [box, setBox] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const bowSeeds = useMemo(
    () => dotRefs.map(() => 0.5 + Math.random() * 0.5),
    [dotRefs]
  );

  useEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const dots = dotRefs.map((r) => r.current).filter(Boolean) as HTMLElement[];
      if (dots.length < 2) return;

      const dotPoints: Point[] = dots.map((dot) => {
        const [x, y] = offsetWithin(dot, container);
        return [x + dot.offsetWidth / 2, y + dot.offsetHeight / 2];
      });

      const amplitude = 10;
      const points: Point[] = [dotPoints[0]];
      for (let i = 0; i < dotPoints.length - 1; i++) {
        const [x0, y0] = dotPoints[i];
        const [x1, y1] = dotPoints[i + 1];
        const side = i % 2 === 0 ? 1 : -1;
        const bowX = (x0 + x1) / 2 + side * amplitude * bowSeeds[i];
        const bowY = (y0 + y1) / 2;
        points.push([bowX, bowY]);
        points.push([x1, y1]);
      }

      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      const margin = 20;
      const left = Math.min(...xs) - margin;
      const top = Math.min(...ys) - margin;
      const width = Math.max(...xs) - left + margin;
      const height = Math.max(...ys) - top + margin;

      setBox({ top, left, width, height });
      setPath(smoothOpenPath(points.map(([x, y]) => [x - left, y - top])));
    }

    // Offsets are already final at mount, so no waiting on entrance
    // animations. A ResizeObserver covers everything that does move the dots
    // for real: reflow, a web font swapping in, the viewport changing.
    measure();
    const observer = new ResizeObserver(measure);
    const container = containerRef.current;
    if (container) observer.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, dotRefs, bowSeeds]);

  if (!path) return null;

  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
      aria-hidden="true"
    >
      {/* Ghost: the full route, dotted and faint, so the scroll-drawn stroke
          reads as tracing a path that was already there. */}
      <path
        d={path}
        stroke="var(--ink)"
        strokeWidth={GHOST_STROKE}
        strokeOpacity={GHOST_OPACITY}
        strokeDasharray={GHOST_DASH}
        fill="none"
        strokeLinecap="round"
      />
      <motion.path
        d={path}
        stroke="var(--ink)"
        strokeWidth={SKETCH_STROKE}
        fill="none"
        strokeLinecap="butt"
        style={{ pathLength }}
      />
    </svg>
  );
}
