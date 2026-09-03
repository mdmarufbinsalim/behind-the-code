"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { motion } from "framer-motion";

type Point = [number, number];

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

      const containerRect = container.getBoundingClientRect();
      const dotPoints: Point[] = dots.map((dot) => {
        const r = dot.getBoundingClientRect();
        return [
          r.left - containerRect.left + r.width / 2,
          r.top - containerRect.top + r.height / 2,
        ];
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

    // This component only mounts once the caller confirms every dot's
    // entrance animation has finished, so the first measurement already
    // reflects final positions. Keep one extra pass for a web font that
    // might still be swapping in.
    measure();
    const fontSettleTimer = setTimeout(measure, 250);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(fontSettleTimer);
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
      <motion.path
        d={path}
        stroke="#0a0a0a"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}
