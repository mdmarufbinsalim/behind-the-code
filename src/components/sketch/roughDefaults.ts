import type { Options } from "roughjs/bin/core";

export const roughStroke = "#0a0a0a";

export const roughDefaults: Options = {
  stroke: roughStroke,
  strokeWidth: 2,
  roughness: 1.8,
  bowing: 1.4,
  fill: "none",
};

export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}
