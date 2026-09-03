"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { motion } from "framer-motion";
import rough from "roughjs";
import { roughDefaults, randomSeed } from "./roughDefaults";

type RoughPath = { d: string; stroke?: string; strokeWidth?: number };
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
  const generator = useMemo(() => rough.generator(), []);
  const [box, setBox] = useState<Box | null>(null);
  const [paths, setPaths] = useState<RoughPath[]>([]);

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

      const margin = 90;
      const top = Math.min(startY, endY) - margin;
      const left = Math.min(startX, endX) - margin;
      const width = Math.abs(endX - startX) + margin * 2;
      const height = Math.abs(endY - startY) + margin * 2;

      if (width < 20 || height < 20) {
        setBox(null);
        return;
      }

      setBox({ top, left, width, height });

      const sx = startX - left;
      const sy = startY - top;
      const ex = endX - left;
      const ey = endY - top;

      const dx = ex - sx;
      const dy = ey - sy;
      const dist = Math.hypot(dx, dy) || 1;
      const bendAmount = Math.min(dist * 0.18, 70);
      const nx = -dy / dist;
      const ny = dx / dist;
      const side = ex > sx ? 1 : -1;
      const midX = (sx + ex) / 2 + nx * bendAmount * side;
      const midY = (sy + ey) / 2 + ny * bendAmount * side;

      const curveOpts = {
        ...roughDefaults,
        strokeWidth: 2,
        seed: randomSeed(),
        roughness: 0.9,
        bowing: 0.4,
        disableMultiStroke: true,
        curveFitting: 0.98,
      };

      const curve = generator.curve(
        [
          [sx, sy],
          [midX, midY],
          [ex, ey],
        ],
        curveOpts
      );

      const angle = Math.atan2(ey - midY, ex - midX);
      const headLen = 11;
      const spread = 0.5;
      const a1: [number, number] = [
        ex - headLen * Math.cos(angle - spread),
        ey - headLen * Math.sin(angle - spread),
      ];
      const a2: [number, number] = [
        ex - headLen * Math.cos(angle + spread),
        ey - headLen * Math.sin(angle + spread),
      ];

      const head = generator.linearPath([a1, [ex, ey], a2], {
        ...roughDefaults,
        strokeWidth: 2,
        seed: randomSeed(),
        roughness: 0.7,
        disableMultiStroke: true,
      });

      setPaths([...generator.toPaths(curve), ...generator.toPaths(head)]);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [fromRef, toRef, containerRef, generator]);

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
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.1, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}
