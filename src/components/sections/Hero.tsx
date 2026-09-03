"use client";

import { motion } from "framer-motion";
import { SketchUnderline } from "@/components/sketch/SketchUnderline";

export function Hero() {
  return (
    <section className="flex min-h-[85vh] flex-col items-start justify-center px-6 sm:px-10">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-3 text-sm tracking-wide text-neutral-500"
      >
        Software engineer, based in Dhaka
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl text-4xl leading-tight font-medium sm:text-6xl"
      >
        I build the systems{" "}
        <span className="relative inline-block">
          behind the product
          <SketchUnderline
            className="absolute -bottom-2 left-0"
            width={340}
            height={18}
            delay={0.9}
          />
        </span>
        .
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 max-w-xl text-lg text-neutral-600"
      >
        Md. Maruf Bin Salim Bhuiyan — clinical editors, multi-tenant SaaS
        backends, and the unglamorous infrastructure that has to hold up
        when no one is looking. This is the story behind a few of them.
      </motion.p>

      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="font-hand mt-10 text-xl underline decoration-2 underline-offset-4"
      >
        See the case studies ↓
      </motion.a>
    </section>
  );
}
