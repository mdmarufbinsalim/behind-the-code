"use client";

import { motion } from "framer-motion";

/**
 * The same shape used twice: a facade the rest of the app calls, one
 * interface, and a provider chosen once at wiring time rather than
 * scattered through the codebase as if/else on an environment variable.
 */
export function AdapterFacadeDiagram({
  caption = "Mail and files are unrelated features that share one decision: pick the provider once, at the edge, not at every call site.",
}: {
  caption?: string;
}) {
  const box = (x: number, y: number, w: number, h: number, key: string, dashed = false) => (
    <rect
      key={key}
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill={dashed ? "none" : "var(--paper)"}
      stroke="var(--ink)"
      strokeWidth={dashed ? 1.25 : 1.5}
      strokeDasharray={dashed ? "6 7" : undefined}
      opacity={dashed ? 0.75 : 1}
    />
  );
  const title = (label: string, cx: number, y: number, size = 17) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={size} fontWeight={600} fill="var(--ink)">
      {label}
    </text>
  );
  const sub = (label: string, cx: number, y: number) => (
    <text x={cx} y={y} textAnchor="middle" fontSize={12.5} fill="var(--ink)" opacity={0.7}>
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
          viewBox="0 0 1240 460"
          className="h-auto w-full min-w-[680px]"
          role="img"
          aria-label="Two parallel flows. Top: a service calls MailerManager, which holds one MailProvider interface, wired at module load to the SmtpProvider implementation, with SendGrid or SES available as a second implementation behind the same interface. Bottom: a service calls the file uploader facade, which holds one FileUploadAdapter interface, wired to either the local disk adapter or the S3 adapter depending on config, with the caller never knowing which one is behind it."
        >
          <defs>
            <marker id="af-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--ink)" />
            </marker>
          </defs>

          <g fill="none" stroke="var(--ink)" strokeWidth={1.75} markerEnd="url(#af-arrow)">
            {/* mail row */}
            <path d="M232,80 L278,80" />
            <path d="M544,80 L590,80" />
            <path d="M902,105 C950,105 950,60 998,60" />
            <path d="M902,80 L950,80" />
            <path d="M902,55 C950,55 950,100 998,100" />
            {/* file row */}
            <path d="M232,320 L278,320" />
            <path d="M544,320 L590,320" />
            <path d="M902,320 L950,297" />
            <path d="M902,320 L950,343" />
          </g>

          {/* MAIL */}
          {title("Mail", 20, 30, 14)}
          {box(20, 40, 212, 80, "svc1")}
          {sub("a service", 126, 85)}

          {box(282, 40, 262, 80, "manager")}
          {title("MailerManager", 413, 78, 15)}
          {sub("facade the app calls", 413, 100)}

          {box(594, 20, 308, 120, "iface1", true)}
          {title("MailProvider", 748, 55, 14)}
          {sub("interface — send(options)", 748, 76)}

          {box(1000, 20, 220, 50, "smtp")}
          {sub("SmtpProvider (live)", 1110, 50)}
          {box(1000, 80, 220, 50, "sendgrid", true)}
          {sub("SendGrid — same interface", 1110, 110)}

          {/* FILES */}
          {title("Files", 20, 270, 14)}
          {box(20, 280, 212, 80, "svc2")}
          {sub("a service", 126, 325)}

          {box(282, 280, 262, 80, "facade2")}
          {title("Upload facade", 413, 318, 15)}
          {sub("facade the app calls", 413, 340)}

          {box(594, 260, 308, 120, "iface2", true)}
          {title("FileUploadAdapter", 748, 295, 14)}
          {sub("interface — uploadSingle(...)", 748, 316)}

          {box(1000, 260, 220, 50, "local")}
          {sub("LocalFileAdapter (dev)", 1110, 290)}
          {box(1000, 320, 220, 50, "s3")}
          {sub("S3FileAdapter (prod)", 1110, 350)}

          <text x={620} y={420} textAnchor="middle" fontSize={13} fill="var(--ink)" opacity={0.7}>
            neither service knows or cares which implementation answers the call
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
