import Link from "next/link";
import type { Project } from "@/data/types";
import { MediaFrame } from "@/components/media/MediaFrame";

type ProjectCardProps = {
  project: Project;
  sizes?: string;
  /** Overrides the cover's own ratio, e.g. to keep a grid row even. */
  ratio?: string;
  priority?: boolean;
  /**
   * Where the card sits in the page's outline. h3 under a SectionHeading on the
   * home page; h2 in the work grid, which has no h2 of its own and so jumped
   * straight from the page title to h3.
   */
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({
  project,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  ratio,
  priority = false,
  headingLevel: Heading = "h3",
}: ProjectCardProps) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <MediaFrame
          media={project.cover}
          ratio={ratio ?? project.cover.ratio ?? "4/5"}
          sizes={sizes}
          priority={priority}
          hoverPlay
          zoomOnHover
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-4 translate-y-2 rounded-full border border-hairline bg-bg/70 px-4 py-2 opacity-0 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100"
        >
          <span className="type-label">View</span>
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
        <div className="min-w-0">
          {/* Two lines rather than truncate: real project names run long, and a
              clipped title reads as a bug. Still capped so nothing runs away. */}
          <Heading className="type-headline line-clamp-2 text-balance transition-opacity duration-300 group-hover:opacity-60">
            {project.title}
          </Heading>
          <p className="type-label mt-2 text-muted">
            {[project.client, project.category].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>
    </Link>
  );
}
