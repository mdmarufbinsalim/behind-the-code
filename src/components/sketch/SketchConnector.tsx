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
    function measure() {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      const startX = fromRect.right - containerRect.left + 10;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.right - containerRect.left + 16;
      const endY = toRect.bottom - containerRect.top - toRect.height / 2;

      if (endY - startY < 60) {
        setBox(null);
        return;
      }

      // Route through the clear space to the right of both anchors,
      // well past the heading's own right edge, so the line never
      // crosses over any text — it only approaches from open space.
      const rightZoneX = Math.min(
        Math.max(startX, endX) + 130,
        containerRect.width - 24
      );

      const margin = 40;
      const top = startY - margin;
      const left = Math.min(startX, endX) - margin;
      const width = Math.max(rightZoneX, startX, endX) - left + margin;
      const height = endY - startY + margin * 2;

      setBox({ top, left, width, height });

      const sx = startX - left;
      const sy = startY - top;
      const ex = endX - left;
      const ey = endY - top;
      const rx = rightZoneX - left;

      // A single cubic Bezier, both control points pulled toward the
      // same rightward point — this has continuously varying curvature
      // by construction, so there's no seam where a straight run meets
      // a sharp turn (unlike a multi-segment spline through a "corner").
      const cp1: Point = [rx, sy + (ey - sy) * 0.18];
      const cp2: Point = [rx, ey - (ey - sy) * 0.18];

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

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
        stroke="#0a0a0a"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
      <motion.path
        d={headPath}
        stroke="#0a0a0a"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.3, delay: 1.05, ease: "easeInOut" }}
      />
    </svg>
  );
}
