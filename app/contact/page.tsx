import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal, RevealLine } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Request a quote for automotive, product or commercial photography and film.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="shell pt-32 pb-24 md:pt-44 md:pb-36">
      <header className="mb-16 md:mb-24">
        <Reveal>
          <p className="type-label mb-6 text-muted">Contact</p>
        </Reveal>
        <h1 className="type-hero max-w-4xl">
          <RevealLine>Shoot</RevealLine>
          <RevealLine delay={0.08}>something?</RevealLine>
        </h1>
        <Reveal delay={0.15}>
          <p className="type-body mt-8 max-w-lg text-muted">
            Tell me about the car, the product or the campaign. Rough dates and a
            budget range are enough to start. I&apos;ll come back with a plan and a
            quote.
          </p>
        </Reveal>
      </header>

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <ContactForm />
        </Reveal>

        <aside className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.1}>
            <div className="border-t border-hairline pt-6">
              <p className="type-label mb-4 text-muted">Direct</p>
              <ul className="space-y-2">
                <li>
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="text-sm transition-opacity hover:opacity-60"
                  >
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 border-t border-hairline pt-6">
              <p className="type-label mb-4 text-muted">Elsewhere</p>
              <ul className="space-y-2">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm transition-opacity hover:opacity-60"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-10 border-t border-hairline pt-6">
              <p className="type-label mb-4 text-muted">Based in</p>
              <p className="text-sm">{site.contact.location}</p>
              <p className="mt-2 text-sm text-muted">{site.contact.availability}</p>
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
