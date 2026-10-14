"use client";

import { motion, useScroll, useTransform } from "motion/react";
import ReactDOM from "react-dom";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { site } from "@/data/site";
import { MediaFrame } from "@/components/media/MediaFrame";
import type { Media } from "@/data/types";
import { mediaUrl } from "@/lib/media";
import { easeOutExpo } from "@/lib/motion";

/**
 * The showreel, served from R2 like the rest of the media.
 *
 * There used to be a provider switch here so the hero could move to a hosted
 * player. Both options are gone: R2 answers Range requests, so the file streams
 * properly and the escape hatch stopped being one. A switch with a single
 * option is not a switch.
 */
const showreel: Media = {
  kind: "fileVideo",
  src: site.showreel.file,
  poster: site.showreel.poster,
  alt: site.showreel.alt,
};

export function Hero() {
  // The poster is the largest element on this page, and `priority` only
  // preloads next/image's own branch — a <video> poster gets nothing. This sat
  // in the root layout's <head>, so all eighteen routes fetched it at high
  // priority for the one that shows it. The Metadata API has no place for a
  // resource hint; ReactDOM.preload is what the docs point at instead, and it
  // hoists the same <link> into <head> from the page that needs it.
  ReactDOM.preload(mediaUrl(site.showreel.poster), {
    as: "image",
    fetchPriority: "high",
  });

  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax is the one thing here reduced motion should actually switch off
  // rather than merely render still, so it reads the hook. That hook is false
  // until after mount, so the markup never differs during hydration.
  // Media drifts slower than the page; text lifts and fades out.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 -z-10 h-[118%]"
        style={reduceMotion ? undefined : { y: mediaY }}
      >
        <MediaFrame
          media={showreel}
          ratio={null}
          priority
          sizes="100vw"
          className="h-full w-full"
        />
      </motion.div>

      {/* Legibility gradient. Strong at the bottom, barely there up top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.05) 32%, rgba(10,10,10,0.35) 72%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      <motion.div
        className="shell absolute inset-x-0 bottom-0 pb-12 md:pb-16"
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-4xl">
          {/* The location and availability line that used to sit above the
              headline is gone — it still reads on the contact page, in the
              footer and on the social card, where someone is actually looking
              for it. Over the showreel it was just words on a picture. */}

          {/* Two lines, animated separately. Swap the words, not the
              structure: each line has to fit on one row on a phone. */}
          <h1 className="type-hero">
            <span className="block overflow-hidden">
              <motion.span
                data-reveal
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.15 }}
              >
                Stills that
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                data-reveal
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.25 }}
              >
                move.
              </motion.span>
            </span>
          </h1>

          <motion.p
            data-reveal
            className="type-body mt-6 max-w-md text-ink/80"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            // No delay, and a shorter fade. This paragraph is the largest
            // element on the page, so it is what Largest Contentful Paint
            // measures — and an element does not count as painted until it is
            // visible. Waiting half a second before the fade even started put
            // LCP at 2712 ms on a throttled phone, past Google's 2.5 s mark,
            // while the hero poster had finished loading after 147 ms. We were
            // measuring our own animation rather than the site.
            transition={{ duration: 0.5, ease: easeOutExpo }}
          >
            {site.heroLine}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
