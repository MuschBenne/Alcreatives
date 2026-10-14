"use client";

import { useSyncExternalStore } from "react";

/**
 * The copyright year, corrected in the browser.
 *
 * Every route here is prerendered, so `new Date()` in a server component runs
 * once at build time and never again: on 1 January the footer would still show
 * last year until someone happened to deploy.
 *
 * `built` is that build-time value. It is what renders on the server and during
 * hydration, so there is nothing for React to disagree about; the client
 * snapshot then supplies today's, which differs only for the first visitors of
 * a new year. Same shape as lib/use-reduced-motion.ts, and unlike an effect
 * that calls setState it does not cost a second render to get there.
 */

/** Nothing to subscribe to: the year does not change while the tab is open. */
const subscribe = () => () => {};

export function FooterYear({ built }: { built: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => built,
  );

  return <>{year}</>;
}
