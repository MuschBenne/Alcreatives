import Link from "next/link";
import { featuredProjects } from "@/data/projects";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Asymmetric rhythm: wide / narrow, narrow / wide, with vertical offsets. */
const layout = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-24",
  "lg:col-span-5",
  "lg:col-span-7 lg:mt-16",
  "lg:col-span-6",
  "lg:col-span-6 lg:mt-20",
];

export function SelectedWork() {
  return (
    <section className="shell py-24 md:py-36">
      <SectionHeading
        index="02"
        title="Selected work"
        action={
          <Link
            href="/work"
            className="type-label text-muted transition-colors hover:text-ink"
          >
            View all work →
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-8">
        {featuredProjects.slice(0, 6).map((project, index) => (
          <Reveal
            key={project.slug}
            className={layout[index % layout.length]}
            delay={index % 2 === 1 ? 0.08 : 0}
          >
            <ProjectCard
              project={project}
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority={index === 0}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
