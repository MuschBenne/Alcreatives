import { projects } from "@/data/projects";
import { site } from "@/data/site";

/**
 * A plain-text summary of the site for language models, in the llms.txt shape.
 *
 * Generated from the same data the pages render rather than written as a static
 * file in public/, so it cannot quietly drift the first time a project is added
 * or a client is renamed — which is exactly what a hand-written copy would do.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.contact.location}. ${site.contact.availability}.`,
    `Contact: ${site.contact.email}`,
    "",
    "## Work",
    "",
    ...projects.map((project) => {
      const credit = project.client ? ` for ${project.client}` : "";
      return `- [${project.title}](${site.url}/work/${project.slug}): ${project.summary}${credit}. ${project.category}.`;
    }),
    "",
    "## Pages",
    "",
    `- [Work](${site.url}/work): every project.`,
    `- [About](${site.url}/about): who Alvin is and how he works.`,
    `- [Behind the scenes](${site.url}/behind-the-scenes): phone frames from set.`,
    `- [Contact](${site.url}/contact): project enquiries.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
