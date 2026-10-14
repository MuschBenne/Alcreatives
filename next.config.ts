import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Stills are resized once by sharp in `npm run media`, not per request.
    // See lib/image-loader.ts for why there is no optimisation service here.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // The widths ingest actually writes (IMAGE_WIDTHS in lib/media.ts) plus the
    // full-size original, so next/image never builds a srcset entry that would
    // resolve to a file nobody generated.
    //
    // The last number is a promise about the original, and it has to be one the
    // narrowest original can keep. Ingest caps the *longest* edge at 2400, so a
    // 2:3 portrait — 117 of the 134 stills — is only 1600 wide. Claiming 2400
    // made the browser pick that candidate for a 2200px slot and then upscale
    // what arrived. 1600 is exact for those and understates the 3:2 landscapes,
    // which merely fetches more pixels than promised: never the other way round.
    deviceSizes: [640, 1080, 1600],
  },
  /**
   * Response headers for every route.
   *
   * Here rather than as a Cloudflare Transform Rule, which would also work: a
   * rule clicked in a dashboard is invisible to whoever reads this repository,
   * and in six months "why does the site do that" gets asked here, not there.
   *
   * They do reach the HTML, which was the open question: prerendered pages are
   * answered by the Worker out of the incremental cache, and a request carrying
   * `x-opennext-cache: HIT` carries all three of these too. So no zone Transform
   * Rule is needed, and they stay here where they are visible to whoever reads
   * this file.
   *
   * One exception, measured rather than assumed: `/_next/static/*` does not get
   * them. A unique query string still comes back `cf-cache-status: HIT` with no
   * security headers, so it is not a stale edge copy — that path simply never
   * runs `headers()`. Workers Assets served by the Worker, such as /icon.png,
   * do get them. This is left alone deliberately: those are hashed, immutable
   * chunks with a fixed content-type, where `nosniff` protects against nothing
   * and `X-Frame-Options` on a stylesheet means nothing at all.
   *
   * `/:path*` is the documented pattern for everything, and `*` means zero or
   * more segments, so it covers "/" as well as nested paths.
   *
   * Two absences, both deliberate. HSTS belongs in Cloudflare's SSL/TLS
   * settings: it governs how the domain may be reached at all rather than what
   * this app returns, and it is sticky — a long max-age that outlives a broken
   * certificate has no easy way back, which is why the ramp-up and the warning
   * in Cloudflare's own UI are worth more than a line here. And no CSP: the
   * nonce-based one Next documents requires dynamic rendering, which would undo
   * the prerendering this whole site is built on. That trades measurable speed
   * for protection against injection into pages that carry no user content.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stops the browser guessing a file's type and running as script
          // something that was never served as one.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Keeps the full URL from reaching Instagram or LinkedIn when a
          // visitor clicks out. Browsers default to this; this pins it.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Clickjacking is thin here — the only action on the site is the
          // contact form — but this also stops the work being framed inside
          // someone else's page and read as part of it.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  // BKM and Zenzi & Helio became one product reel. Their old case study URLs
  // were live and shared, so they land on it rather than on a 404.
  async redirects() {
    return [
      { source: "/work/bkm", destination: "/work/product-photography", permanent: true },
      { source: "/work/zenzi-helio", destination: "/work/product-photography", permanent: true },
    ];
  },
};

export default nextConfig;

// Gives `next dev` the same Cloudflare bindings the deployed Worker gets, so
// local development is not a different runtime from production.
initOpenNextCloudflareForDev();
