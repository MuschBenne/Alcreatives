/**
 * Clears the Cloudflare edge cache after a deploy.
 *
 * The site sends `cache-control: s-maxage=31536000`, so once a cache rule makes
 * the HTML eligible, the edge is entitled to hold a copy for a year. Without
 * this step a deploy would be invisible: the Worker updates, and visitors keep
 * getting the version that was cached first.
 *
 * Media is unaffected. It lives on R2 under a versioned prefix, so a new file
 * arrives at a new URL rather than replacing a cached one — which is why
 * purging everything is safe here.
 *
 * Reads CLOUDFLARE_API_TOKEN from .env.tooling the same way scripts/r2.sh does,
 * so no credentials are stored. Set CLOUDFLARE_ZONE_ID to skip the lookup.
 *
 * Not .env.local: the OpenNext adapter bakes every .env and .env.local value
 * into the Worker bundle it deploys, and this token is not a Worker secret, so
 * nothing shadows it there. .env.tooling is ignored by git under the same .env*
 * rule but is invisible to both the adapter and Next.
 */

import { readFile } from "node:fs/promises";

const API = "https://api.cloudflare.com/client/v4";

/** A value from the environment, falling back to .env.tooling. */
async function fromEnvFile(key) {
  if (process.env[key]) return process.env[key];

  const contents = await readFile(".env.tooling", "utf8").catch(() => "");
  const line = contents.split("\n").find((row) => row.startsWith(`${key}=`));
  return line?.slice(key.length + 1).trim();
}

async function call(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await response.json();
  if (!body.success) {
    const detail = JSON.stringify(body.errors ?? body).slice(0, 300);
    throw new Error(`${path} failed: ${detail}`);
  }
  return body.result;
}

const token = await fromEnvFile("CLOUDFLARE_API_TOKEN");
if (!token) {
  // Not fatal: the deploy itself already succeeded, and someone building
  // without the token should not have the build reported as broken.
  console.warn("  Cache not purged: no CLOUDFLARE_API_TOKEN. Purge by hand.");
  process.exit(0);
}

try {
  // The zone lookup lives inside the guard too. It sat above it and could
  // throw for three ordinary reasons — no CLOUDFLARE_ZONE_ID, a token without
  // Zone:Read, or an account with more than one zone — and each produced a raw
  // stack trace and exit 1 straight after a deploy that had already succeeded.
  // That is exactly the reading the message below exists to prevent.
  // Read the same way as the token, so setting it in .env.tooling is enough.
  // It used to come from process.env alone, which meant the documented escape
  // from needing Zone:Read on the token did not actually work.
  let zoneId = await fromEnvFile("CLOUDFLARE_ZONE_ID");

  if (!zoneId) {
    const zones = await call("/zones");
    if (zones.length !== 1) {
      throw new Error(
        `Expected exactly one zone, found ${zones.length}. Set CLOUDFLARE_ZONE_ID.`,
      );
    }
    zoneId = zones[0].id;
  }

  await call(`/zones/${zoneId}/purge_cache`, {
    method: "POST",
    body: JSON.stringify({ purge_everything: true }),
  });
  console.log("  Edge cache purged.");
} catch (error) {
  // The deploy already succeeded by the time this runs, so a stack trace here
  // reads as "the deploy failed", which is worse than useless. Say what
  // actually happened, and exit non-zero so it cannot pass unnoticed.
  console.error(`
  The site is deployed, but the edge cache was NOT purged.

  ${error.message}

  With an HTML cache rule in place this matters: the site sends
  s-maxage=31536000, so visitors can keep the previous version for a very long
  time. Purge by hand in the Cloudflare dashboard (Caching -> Configuration ->
  Purge Everything), or give the API token Zone -> Cache Purge so this step can
  do it.
`);
  process.exit(1);
}
