"use client";

import type { RefObject } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SketchUnderline } from "@/components/sketch/SketchUnderline";
import { SketchCircle } from "@/components/sketch/SketchCircle";

export function Hero({ ctaRef }: { ctaRef?: RefObject<HTMLAnchorElement | null> }) {
  return (
    <section className="site-px grid gap-12 pt-24 pb-28 sm:pt-32 sm:pb-40 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-8">
      <div className="flex flex-col items-start">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14 }}
          className="mb-3 text-sm tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Software engineer, based in{" "}
          <SketchCircle delay={1.1} paddingX={10} paddingY={6} className="mx-2.5">
            Dhaka
          </SketchCircle>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.84, delay: 0.28 }}
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
          transition={{ duration: 0.7, delay: 0.56 }}
          className="mt-8 max-w-xl text-lg text-neutral-600 dark:text-neutral-400"
        >
          Md. Maruf Bin Salim Bhuiyan — clinical editors, multi-tenant SaaS
          backends, and the unglamorous infrastructure that has to hold up
          when no one is looking. This is the story behind a few of them.
        </motion.p>

        <motion.a
          ref={ctaRef}
          href="#work"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.84 }}
          className="font-hand mt-10 text-xl underline decoration-2 underline-offset-4"
        >
          See the case studies ↓
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.84, delay: 0.42, ease: "easeOut" }}
        className="hidden justify-self-end lg:block"
      >
        <Image
          src="/hero-image.png"
          alt="Doodle illustration of a developer at a dual-monitor desk, surrounded by notes reading Build, Ship, Improve and Clean Code, Better UX, Happy Users"
          width={620}
          height={620}
          priority
          className="w-full max-w-[560px] dark:hidden"
        />
        <Image
          src="/hero-image-dark.png"
          alt="Doodle illustration of a developer at a dual-monitor desk, surrounded by notes reading Build, Ship, Improve and Clean Code, Better UX, Happy Users"
          width={620}
          height={620}
          priority
          className="hidden w-full max-w-[560px] dark:block"
        />
      </motion.div>
    </section>
  );
}
