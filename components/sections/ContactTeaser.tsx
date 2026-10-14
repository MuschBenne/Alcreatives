import Link from "next/link";
import { site } from "@/data/site";
import { Reveal, RevealLine } from "@/components/ui/Reveal";

export function ContactTeaser() {
  return (
    <section className="shell border-t border-hairline py-24 md:py-36">
      <Link href="/contact" className="group block">
        <p className="type-hero">
          <RevealLine>Shoot</RevealLine>
          <RevealLine delay={0.08}>
            <span className="inline-flex items-baseline gap-4">
              something?
              <span
                aria-hidden
                className="inline-block text-[0.5em] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3"
              >
                →
              </span>
            </span>
          </RevealLine>
        </p>
      </Link>

      <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
        <a
          href={`mailto:${site.contact.email}`}
          className="type-label text-muted transition-colors hover:text-ink"
        >
          {site.contact.email}
        </a>
        <span className="type-label text-muted">{site.contact.availability}</span>
      </Reveal>
    </section>
  );
}
