import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectNeighbours, projects } from "@/data/projects";
import { site } from "@/data/site";
import { cardImageFor, pageMetadata } from "@/lib/metadata";
import { jsonLd, projectGraph } from "@/lib/schema";
import { MediaFrame } from "@/components/media/MediaFrame";
import { CaseGallery } from "@/components/work/CaseGallery";
import { Reveal, RevealLine } from "@/components/ui/Reveal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * An unknown slug is a 404, not a page.
 *
 * This predates the category pages: with the default (true), Next rendered any
 * made-up slug on demand, so notFound() produced the 404 body but the response
 * carried a 200 status. Crawlers read the status, so /work/anything-at-all
 * looked like a real page — a soft 404, and an open invitation to index an
 * unlimited number of empty ones.
 *
 * The `if (!project)` guards below stay: they are what tells TypeScript the
 * lookup can miss, even though it can no longer happen at runtime.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  // Built rather than taken straight from `summary`: the visible copy is now
  // three or four words by design, and "Vertical brand film" alone makes a
  // poor search result and a poorer link preview. This text is never rendered.
  const credit = project.client ? ` for ${project.client}` : "";
  const description = `${project.summary}${credit}. ${project.category} work by ${site.name}.`;

  return pageMetadata({
    title: project.title,
    // The tab read "BMW | Hedin Automotive | Alvin Creatives": the client sat
    // in the title and the root template appended the name after it. The
    // client is in the description instead, where it is not repeated.
    absoluteTitle: `${project.title} | ${site.name}`,
    description,
    path: `/work/${project.slug}`,
    image: cardImageFor(project),
    type: "article",
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getProjectNeighbours(slug);
  const { clipOf } = project.cover;
  const showCover = !clipOf || !project.gallery.some((media) => media.src === clipOf);

  return (
    // Tighter at the top than the other pages on purpose: the title and the
    // three facts introduce the work, then the cover follows straight after.
    <article className="pt-28 md:pt-32">
      {/* Every still in the gallery carries a hand-written alt, so the work
          describes itself here rather than listing bare URLs. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(projectGraph(project)) }}
      />
      {/* Title, client and what the job was. Nothing else: the work does the
          talking, and each fact is dropped rather than left blank. */}
      <header className="shell mb-8 md:mb-10">
        <h1 className="type-hero max-w-5xl text-balance">
          <RevealLine>{project.title}</RevealLine>
        </h1>

        <div className="mt-8 grid gap-6 border-t border-hairline pt-6 md:grid-cols-12 md:gap-8">
          {project.client ? (
            <Reveal className="md:col-span-4">
              <p className="type-label mb-2 text-muted">Client</p>
              <p className="text-sm">{project.client}</p>
            </Reveal>
          ) : null}
          <Reveal delay={0.06} className="md:col-span-6">
            <p className="type-label mb-2 text-muted">Project</p>
            <p className="text-sm">{project.summary}</p>
          </Reveal>
        </div>
      </header>

      {/* No Reveal on the cover: it is the first image on the page and should
          be painted, not faded in from black. A cover cut from one of the
          gallery films is left out, or that film would play twice. */}
      {showCover ? (
        <>
          <div className="shell">
            <MediaFrame
              media={project.cover}
              ratio={project.cover.ratio ?? "16/9"}
              sizes="100vw"
              priority
              className="w-full"
            />
          </div>

          <div className="py-10 md:py-14" />
        </>
      ) : null}

      <div className="shell">
        <CaseGallery gallery={project.gallery} />
      </div>

      <nav
        aria-label="Project navigation"
        className="shell mt-24 grid gap-px border-t border-hairline md:mt-36 md:grid-cols-2"
      >
        {previous ? (
          <Link
            href={`/work/${previous.slug}`}
            className="group flex flex-col gap-2 py-10 md:pr-8"
          >
            <span className="type-label text-muted">← Previous</span>
            <span className="type-headline transition-opacity group-hover:opacity-60">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col gap-2 border-t border-hairline py-10 md:items-end md:border-t-0 md:border-l md:pl-8"
          >
            <span className="type-label text-muted">Next →</span>
            <span className="type-headline transition-opacity group-hover:opacity-60 md:text-right">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
