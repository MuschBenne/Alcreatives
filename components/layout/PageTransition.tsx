"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";
import { easeOutExpo } from "@/lib/motion";

/**
 * Routes fade in on navigation, keyed by pathname, while the header and footer
 * stay fixed in place. Kept to opacity only so nothing shifts under the user.
 *
 * The first render deliberately skips the fade. `initial={{ opacity: 0 }}` is
 * written into the server HTML, so using it here would ship every page
 * invisible and leave the whole site blank until hydration finishes — a long
 * wait in dev, and permanent if JS never arrives.
 */
/** The store never changes, so the subscription is a no-op. */
const subscribeToNothing = () => () => {};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // False while rendering on the server and through hydration, true afterwards.
  // `initial` is only read when the keyed div mounts, so the first paint gets no
  // fade and every later route change does.
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  return (
    <motion.div
      key={pathname}
      // data-reveal so the reduced-motion rule in globals.css makes the fade
      // instant, rather than this component rendering a different tree.
      data-reveal
      initial={isHydrated ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
