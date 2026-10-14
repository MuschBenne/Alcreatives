import Link from "next/link";
import { site } from "@/data/site";
import { BackToTop } from "./BackToTop";
import { FooterYear } from "./FooterYear";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="shell grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-2">
          <p className="type-label mb-4 text-muted">{site.name}</p>
          <p className="type-body max-w-sm text-muted">{site.tagline}</p>
        </div>

        <div>
          <p className="type-label mb-4 text-muted">Contact</p>
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="text-sm transition-opacity hover:opacity-60"
              >
                {site.contact.email}
              </a>
            </li>
            <li className="text-sm text-muted">{site.contact.location}</li>
          </ul>
        </div>

        <div>
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
            <li>
              <Link href="/work" className="text-sm transition-opacity hover:opacity-60">
                Work
              </Link>
            </li>
            <li>
              <Link
                href="/behind-the-scenes"
                className="text-sm transition-opacity hover:opacity-60"
              >
                Behind the scenes
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-hairline py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-label text-muted">
          © <FooterYear built={new Date().getFullYear()} /> {site.name}
        </p>
        <div className="flex items-center gap-6">
          <p className="type-label text-muted">
            Website created by{" "}
            <a
              href={site.credit.href}
              target="_blank"
              rel="noreferrer"
              className="text-ink/70 transition-colors hover:text-ink"
            >
              {site.credit.label}
            </a>
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
