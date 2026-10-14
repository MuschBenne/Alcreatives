import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { clients } from "@/data/clients";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal, RevealLine } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  // Its own description rather than the site's: without one this page and the
  // home page went to search with the same sentence, competing for the same
  // result with nothing to tell them apart.
  description:
    "Alvin Creatives is a Stockholm based photographer and filmmaker working across sports, cars, products and commercial work.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="shell pt-32 pb-24 md:pt-44 md:pb-36">
      <header className="mb-16 md:mb-24">
        <Reveal>
          <p className="type-label mb-6 text-muted">About</p>
        </Reveal>
        <h1 className="type-hero max-w-4xl text-balance">
          <RevealLine>{site.about.heading}</RevealLine>
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {/* In data/site.ts rather than written here, so the data-integrity
              test covers it like every other path. Why it is a behind-the-scenes
              frame rather than a portrait of Alvin is recorded there too. */}
          <MediaFrame
            media={site.about.portrait}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="w-full"
          />
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          {site.about.bio.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.08}>
              <p className="type-body mb-6 max-w-xl text-ink/85">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-12 border-t border-hairline pt-6">
              <p className="type-label mb-4 text-muted">Approach</p>
              <p className="type-body max-w-xl text-muted">{site.about.approach}</p>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-12 border-t border-hairline pt-6">
              <p className="type-label mb-5 text-muted">Select clients</p>
              <ul className="grid grid-cols-2 gap-y-2 sm:grid-cols-3">
                {clients.map((client) => (
                  <li key={client.name} className="text-sm text-ink/85">
                    {client.name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-12 border-t border-hairline pt-6">
              <Link href="/contact" className="group inline-flex items-baseline gap-3">
                <span className="type-headline transition-opacity group-hover:opacity-60">
                  Start a project
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
