import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, getProjectsByCategory, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { WorkGrid } from "@/components/work/WorkGrid";
import { PageHeader } from "@/components/ui/PageHeader";

type Params = { params: Promise<{ category: string }> };

/**
 * A page per category, prerendered like every other route.
 *
 * Under /work/category/ rather than /work/ so it cannot collide with a project
 * slug — /work/[slug] would otherwise swallow /work/automotive and answer with
 * "project not found".
 */
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

/**
 * Anything outside the three categories is a 404, not a page.
 *
 * With the default (true), Next renders an unknown segment on demand: our
 * notFound() ran and the 404 body came back, but with a 200 status. Crawlers
 * read the status, not the heading, so that is a soft 404 — an invitation to
 * index an unlimited number of empty pages.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) return { title: "Not found" };

  const count = getProjectsByCategory(found.name).length;

  return pageMetadata({
    title: `${found.title} work`,
    description: `${found.lead} ${count} ${count === 1 ? "project" : "projects"} by Alvin Creatives.`,
    path: `/work/category/${found.slug}`,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  return (
    <div className="shell pt-32 pb-24 md:pt-44 md:pb-36">
      <PageHeader label="Selected work" title={found.title} lead={found.lead} />
      <WorkGrid
        projects={getProjectsByCategory(found.name)}
        active={found.slug}
        total={projects.length}
      />
    </div>
  );
}
