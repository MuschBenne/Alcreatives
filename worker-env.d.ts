/**
 * The Cloudflare bindings this Worker actually has.
 *
 * `wrangler types` generates a file like this, and the npm script that ran it
 * was removed when the Worker had no bindings worth typing. For one binding a
 * hand-written augmentation beats a generator plus a gitignored artifact that
 * has to be regenerated before anyone can typecheck: this states exactly the
 * one method the contact route calls, and nothing else.
 *
 * Deliberately not named cloudflare-env.d.ts — that name is in .gitignore from
 * the generator's day, so a declaration written there would be untracked and
 * would go missing in CI and in a fresh clone.
 *
 * @opennextjs/cloudflare declares CloudflareEnv globally; this extends it.
 */

interface WorkerRateLimiter {
  /** `success: false` once the key has passed the configured limit. */
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

declare global {
  interface CloudflareEnv {
    /**
     * Optional because it is absent under `next dev` and in tests, and because
     * it only exists once a deploy has carried wrangler.jsonc's `ratelimits`
     * entry. The route falls back to its in-memory counter when it is missing.
     */
    CONTACT_RATE_LIMITER?: WorkerRateLimiter;
  }
}

export {};
