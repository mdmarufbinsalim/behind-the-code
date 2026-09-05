"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SKETCH_STROKE } from "@/components/sketch/stroke";

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

export function SketchUnderline({
  className = "",
  width = 240,
  height = 16,
  strokeWidth = SKETCH_STROKE,
  delay = 0,
}: {
  className?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  delay?: number;
}) {
  const [path, setPath] = useState("");

  useEffect(() => {
    const midY = height / 2;
    const amplitude = height * 0.34;
    const periods = 2.25 + Math.random() * 0.5;
    const phase = Math.random() * Math.PI * 2;
    const samples = 22;

    const points: Point[] = Array.from({ length: samples }, (_, i) => {
      const t = i / (samples - 1);
      const x = 2 + t * (width - 4);
      // Taper the amplitude to zero at both ends so the wave starts and
      // ends flat, like a hand-drawn flourish rather than a cut-off wave.
      const envelope = Math.sin(t * Math.PI);
      const y = midY + Math.sin(t * periods * Math.PI * 2 + phase) * amplitude * envelope;
      return [x, y];
    });

    setPath(smoothOpenPath(points));
  }, [width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ maxWidth: "100%" }}
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d={path}
        stroke="var(--ink)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.98, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}
