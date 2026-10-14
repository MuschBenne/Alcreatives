import localFont from "next/font/local";

/**
 * Self-hosted Fontshare faces. Files live in app/fonts/ and are served from our
 * own domain, so there is no external font request on first paint.
 *
 * Only the weights the site actually sets are here. Both 700s were preloaded on
 * every page and used by nothing: the type scale in globals.css asks for 400 and
 * 500, and the only weight class in the codebase is the wordmark's semibold,
 * which is Clash 600.
 */
export const clashDisplay = localFont({
  src: [
    { path: "./fonts/ClashDisplay-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  preload: true,
});

export const satoshi = localFont({
  src: [
    { path: "./fonts/Satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});
