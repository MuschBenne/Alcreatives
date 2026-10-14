"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Whether the visitor asked for less motion — always false on the server and
 * through hydration, then the real answer.
 *
 * motion's own `useReducedMotion` returns the true value on the first client
 * render, so every component that branched on it rendered different markup than
 * the server had sent. React threw the whole tree away and rebuilt it in the
 * browser, which is the slowest possible path for the visitors least able to
 * absorb it.
 *
 * `getServerSnapshot` returning false is the entire trick: server and first
 * client render agree, and the value flips after mount. Use this only where
 * reduced motion changes *behaviour* — whether a video autoplays, whether a
 * layout animates. Where it only changes how something looks, let the CSS in
 * globals.css neutralise the animation and keep the markup identical.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
