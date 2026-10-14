import type { Metadata, Viewport } from "next";
import { clashDisplay, satoshi } from "./fonts";
import "./globals.css";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { jsonLd, siteGraph } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  // Inherited by every page, so the home page gets one without a metadata
  // export of its own. `pageMetadata()` overrides it everywhere else.
  alternates: { canonical: "/" },
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${satoshi.variable} antialiased`}
    >
      <head>
        {/* Media comes from R2 behind its own domain, so the first image needs
            a DNS lookup and a TLS handshake this document's connection cannot
            reuse. The largest element on the home page is the hero poster:
            without this the move to R2 would make it land later, not sooner. */}
        <link rel="preconnect" href="https://media.alcreatives.com" />
        {/* The hero poster used to be preloaded here. It is the largest element
            on the home page — but only on the home page, and <head> in the root
            layout ships on all eighteen routes. Seventeen of them fetched a
            1920x1080 JPEG at high priority and competed with their own LCP
            image over it. Hero does it now, where the poster is rendered. */}
        {/*
          Reveal animations are driven by motion, which writes their hidden
          starting state (`opacity: 0`, a transform) directly into the server
          HTML. Without JS those styles never get animated away and the page
          reads as blank. This puts everything back on screen instead.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Site-level facts only — who this is, where, and what the site is.
            Anything page-specific belongs on the page, or every route would
            claim to be the home page. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph()) }}
        />
      </head>
      {/* No h-full on <html>: Lenis measures how far the page scrolls by
          watching <html> resize. Pinned to the viewport it never resized, so
          after moving from a short page to a long one the scroll stopped where
          the short page ended. The body takes its minimum height from the
          viewport instead, which keeps the footer down on short pages. */}
      <body className="flex min-h-svh flex-col bg-bg text-ink">
        <SmoothScroll>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </SmoothScroll>
        {/* Cloudflare Web Analytics, added by hand.
            This used to say it was injected at the edge for the zone and that no
            script was needed here. That was not true in production: the zone has
            Web Analytics enabled with auto-install on, and the delivered HTML
            still contained no beacon at all, so nobody was counting anything.
            The likely reason is the one that bit the security headers too —
            prerendered pages are answered by the Worker from its own cache,
            which is not the path Cloudflare's HTML rewriter sits on — but the
            manual snippet works whatever the cause, and is what the dashboard
            offers for exactly this case.
            Still nothing that follows people around: no cookies, no
            fingerprinting, and the token below is public by design. */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "22d88e4528b04d6ea57737da66d933ac"}'
        />
      </body>
    </html>
  );
}
