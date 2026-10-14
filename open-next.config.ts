import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Cheap pages without a cold start.
 *
 * A zone-level Cache Rule cannot help here, which cost a detour to find out:
 * Cloudflare runs Workers *before* the edge cache, so a rule never sees a
 * request the Worker answers itself. Measured on the live site — every static
 * asset came back `cf-cache-status: HIT` while HTML carried no such header at
 * all, because assets are served by Workers Assets and pages by the script.
 * Cloudflare's own docs say it plainly: with the whole project on Workers, the
 * Cache API is the only way to cache what the Worker returns.
 *
 * Cache interception is that, one layer up. A request for a prerendered route
 * is answered straight from the incremental cache without starting NextServer,
 * which is exactly the cost the baseline showed: the home page had a median of
 * 114 ms but a 90th percentile of 264 ms and a worst case of 704 ms, and that
 * spread is cold starts.
 *
 * The cache reads from Workers Static Assets, so nothing has to be
 * provisioned — no R2 bucket, no KV namespace. It is read-only and cannot
 * revalidate, which suits this site exactly: every route is prerendered at
 * build time and the only dynamic one is /api/contact, which is a POST and
 * never cached. The day a route starts revalidating, this has to become the R2
 * or KV implementation instead.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
