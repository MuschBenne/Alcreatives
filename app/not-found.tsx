import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

// Without this the 404 inherits the root's `index: true` and invites crawlers
// to index every mistyped URL as a real page.
//
// No canonical: this page is served at whatever address was mistyped, and it
// used to point at /404 — a URL that is not a route here and answers 404
// itself. Next adds its own noindex for a 404 status on top of ours.
export const metadata: Metadata = pageMetadata({
  title: "Not found",
  description: "That page has moved or never existed.",
  path: null,
  index: false,
});

export default function NotFound() {
  return (
    <div className="shell flex flex-1 flex-col justify-center pt-40 pb-32">
      <p className="type-label mb-6 text-muted">404</p>
      <h1 className="type-hero max-w-3xl">Nothing in frame.</h1>
      <p className="type-body mt-8 max-w-md text-muted">
        That page has moved or never existed. The work is still where you left it.
      </p>
      <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline pt-8">
        <Link href="/" className="type-label text-muted transition-colors hover:text-ink">
          Home →
        </Link>
        <Link
          href="/work"
          className="type-label text-muted transition-colors hover:text-ink"
        >
          Work →
        </Link>
        <Link
          href="/contact"
          className="type-label text-muted transition-colors hover:text-ink"
        >
          Contact →
        </Link>
      </div>
    </div>
  );
}
