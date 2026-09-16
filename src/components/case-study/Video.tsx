"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SketchBox } from "@/components/sketch/SketchBox";

/**
 * A product recording, framed like the screenshots.
 *
 * It plays when it reaches the middle of the screen and pauses when it leaves,
 * and it tries to play with sound. Every browser refuses audible playback until
 * the visitor has interacted with the page, so the first attempt usually falls
 * back to muted and puts a "Play with sound" button over the frame; once any
 * click or keypress has happened, later attempts are allowed and it unmutes on
 * its own. Muting it by hand is remembered - we don't fight the visitor.
 *
 * Nothing autoplays at all for someone who asked for reduced motion.
 */
export function Video({
  src,
  poster,
  caption,
}: {
  src: string;
  poster?: string;
  caption?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  /** Set once the visitor has done something the autoplay policy counts. */
  const activated = useRef(false);
  /** Set if they mute it themselves - after that we never unmute for them. */
  const mutedByVisitor = useRef(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  /** Try to play audible; fall back to muted if the browser says no. */
  const playPreferablyAudible = useCallback(async (el: HTMLVideoElement) => {
    if (!mutedByVisitor.current && activated.current) {
      el.muted = false;
      try {
        await el.play();
        setNeedsGesture(false);
        return;
      } catch {
        // audible playback refused - fall through to muted
      }
    }
    el.muted = true;
    try {
      await el.play();
      setNeedsGesture(!mutedByVisitor.current);
    } catch {
      /* refused outright: the poster and the controls are still there */
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const markActivated = () => {
      activated.current = true;
    };
    window.addEventListener("pointerdown", markActivated, { once: true });
    window.addEventListener("keydown", markActivated, { once: true });

    // Remember a deliberate mute, and treat unmuting by hand as consent.
    const onVolumeChange = () => {
      if (el.muted) {
        if (!el.paused) mutedByVisitor.current = true;
      } else {
        mutedByVisitor.current = false;
        setNeedsGesture(false);
      }
    };
    el.addEventListener("volumechange", onVolumeChange);

    // Fires when the frame sits in the middle band of the viewport, which is
    // close enough to "centred" without demanding the whole thing be visible.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void playPreferablyAudible(el);
        else el.pause();
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener("volumechange", onVolumeChange);
      window.removeEventListener("pointerdown", markActivated);
      window.removeEventListener("keydown", markActivated);
    };
  }, [playPreferablyAudible]);

  const enableSound = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    activated.current = true;
    mutedByVisitor.current = false;
    el.muted = false;
    void el.play();
    setNeedsGesture(false);
  }, []);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="my-10"
    >
      <SketchBox className="p-2" padding={3}>
        <div className="relative">
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            controls
            preload="metadata"
            className="w-full dark:brightness-[0.87]"
          />
          {needsGesture && (
            <button
              type="button"
              onClick={enableSound}
              className="absolute top-3 right-3 flex cursor-pointer items-center gap-2 rounded-full bg-[var(--paper)]/90 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm hover:opacity-80"
            >
              <SpeakerIcon />
              Play with sound
            </button>
          )}
        </div>
      </SketchBox>
      {caption && (
        <figcaption className="mt-3 text-center text-lg text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
      <path
        d="M3 6h2.5L9 3v10L5.5 10H3z"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M11.5 6.2a3 3 0 0 1 0 3.6" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.2 4.6a5.4 5.4 0 0 1 0 6.8" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
