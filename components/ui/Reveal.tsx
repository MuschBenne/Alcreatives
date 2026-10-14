"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Distance in px the element travels up into place. */
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section" | "figure";
};

/**
 * On-scroll fade + rise.
 *
 * Reduced motion is handled in globals.css rather than by rendering something
 * else here: a branch on the media query produced different markup on the
 * server and in the browser, and React threw away the server render to fix it.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      // data-reveal is what the <noscript> rule in app/layout.tsx overrides.
      // motion writes `opacity: 0` straight into the server HTML, so without a
      // hook to target, a visitor without JS would see an empty page.
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: easeOutExpo, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * A single display line that clips up from below. Wrap each line separately
 * for the staggered editorial effect used on section headings.
 */
export function RevealLine({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    // The viewport trigger sits on the clip box, not on the line that moves.
    // IntersectionObserver measures an element's *transformed* box, so when
    // both lived on the same span the line was already pushed a full height
    // down and only counted as in view once you had scrolled past it. Under a
    // tall image that read as a blank gap. The clip box never moves, so it
    // reports the position the reader actually sees.
    // The clip box also reaches below the line: display type sets its
    // line-height under 1, so a box that ends at the line cuts off the tails
    // of g, j, p and y. The negative margin hands that space back, so lines
    // still stack exactly as tight as the type asks for.
    <motion.span
      className="-mb-[0.2em] block overflow-hidden pb-[0.2em]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      <motion.span
        // Stays on the moving line: the <noscript> rule in app/layout.tsx
        // clears the transform here when there is no JS to animate it away.
        data-reveal
        className={`block ${className ?? ""}`}
        // Far enough down to clear the taller clip box: at 110% the top of the
        // capitals showed under a line that had not revealed yet.
        variants={{ hidden: { y: "140%" }, visible: { y: "0%" } }}
        transition={{ duration: 1, ease: easeOutExpo, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
