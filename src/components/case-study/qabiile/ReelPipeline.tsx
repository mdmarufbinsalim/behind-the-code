"use client";

import { motion } from "framer-motion";

/**
 * What happens between an admin uploading a video and a user being able to
 * watch it. None of it happens in the request that uploaded the file.
 */
export function ReelPipeline({
  caption = "The upload returns immediately. The reel becomes playable later, on its own time.",
}: {
  caption?: string;
}) {
  const box = (x: number, y: number, w: number, h: number, key: string) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill="var(--paper)"
      stroke="var(--ink)"
      strokeWidth={1.5}
    />
  );

  const title = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={19} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );

  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={13.5} fill="var(--ink)" opacity={0.7}>
      {label}
    </text>
  );

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10"
    >
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 1240 260"
          className="h-auto w-full min-w-[660px]"
          role="img"
          aria-label="Flow diagram: an admin upload lands in S3 and the request returns; a BullMQ worker picks the job up, runs ffmpeg to produce multi-rendition HLS and a thumbnail, writes them back to S3, and only then is the reel marked playable."
        >
          <defs>
            <marker
              id="reel-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#reel-arrow)">
            <path d="M252,110 L292,110" />
            <path d="M544,110 L584,110" />
            <path d="M836,110 L876,110" />
          </g>

          {box(20, 50, 232, 120, "upload")}
          {title("Admin upload", 136, 98)}
          {sub("S3 put, request returns", 136, 124)}

          {box(292, 50, 252, 120, "queue")}
          {title("BullMQ job", 418, 98)}
          {sub("reels processor picks it up", 418, 124)}

          {box(584, 50, 252, 120, "ffmpeg")}
          {title("ffmpeg", 710, 98)}
          {sub("HLS renditions + thumbnail", 710, 124)}

          {box(876, 50, 344, 120, "playable")}
          {title("reel goes playable", 1048, 98)}
          {sub("renditions back in S3, row flipped", 1048, 124)}

          <text x={620} y={216} textAnchor="middle" fontSize={14} fill="var(--ink)" opacity={0.65}>
            the same shape as every other slow thing here: mail, search indexing, payments, hunt
            expiry
          </text>
        </svg>
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
