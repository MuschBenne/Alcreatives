import { projects } from "@/data/projects";
import { site } from "@/data/site";
import type { Media, Project } from "@/data/types";
import { fullSize, mediaUrl } from "@/lib/media";

/**
 * Structured data, built from the same objects the pages render.
 *
 * The site had none. What makes it worth doing here rather than as boilerplate
 * is the source material: every image in data/projects.ts carries a
 * hand-written `alt`, so the gallery describes itself properly instead of
 * listing bare URLs.
 *
 * Nothing in here asserts a fact the data does not hold — no telephone, no
 * legal name, no postal address. Those fields were deliberately removed from
 * the site, and inventing them for a crawler would be the same lie told to a
 * different reader.
 */

const BUSINESS = `${site.url}#business`;
const PERSON = `${site.url}#person`;
const WEBSITE = `${site.url}#website`;

type Node = Record<string, unknown>;

/**
 * Serialises a graph for a <script type="application/ld+json">.
 *
 * `<` is escaped because an alt text containing `</script>` would otherwise
 * close the tag early and break the page.
 */
export function jsonLd(graph: Node[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c",
  );
}

/** Site-level facts. Rendered once in the root layout, so it stays general. */
export function siteGraph(): Node[] {
  return [
    {
      "@type": "ProfessionalService",
      "@id": BUSINESS,
      name: site.name,
      url: site.url,
      description: site.description,
      email: site.contact.email,
      image: mediaUrl(site.showreel.poster),
      founder: { "@id": PERSON },
      areaServed: { "@type": "City", name: "Stockholm" },
      address: { "@type": "PostalAddress", addressLocality: "Stockholm", addressCountry: "SE" },
      sameAs: site.socials.map((social) => social.href),
      knowsAbout: site.capabilities.map((capability) => capability.title),
    },
    {
      "@type": "Person",
      "@id": PERSON,
      name: site.name,
      jobTitle: "Photographer and filmmaker",
      url: site.url,
      worksFor: { "@id": BUSINESS },
      sameAs: site.socials.map((social) => social.href),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": BUSINESS },
      inLanguage: "en-GB",
    },
  ];
}

function imageNode(media: Media): Node {
  // Measured from the longest edge, which is what ingest caps. The old
  // assumption of a 1600-wide original described the 3:2 landscapes as
  // 1600x1067 and the 4:5 covers as 1600x2000; both are 2400 on their long
  // side. Image search reserves space from these numbers.
  const { width, height } = fullSize(media.ratio);
  return {
    "@type": "ImageObject",
    // The full-size file: 1600 is no longer a width we write, and image search
    // wants the largest one anyway.
    contentUrl: mediaUrl(media.src),
    caption: media.alt,
    description: media.alt,
    width,
    height,
    creator: { "@id": PERSON },
  };
}

/**
 * One case study.
 *
 * Films are described as part of the gallery but not as VideoObject: that type
 * requires an `uploadDate`, and no date for these clips exists in the data —
 * dating the work was deliberately dropped. Adding a date field to `Project`
 * makes this a two-line change; until then, claiming one would be inventing it.
 */
export function projectGraph(project: Project): Node[] {
  const stills = project.gallery.filter((media) => media.kind === "image");
  const url = `${site.url}/work/${project.slug}`;

  return [
    {
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: project.title,
      headline: project.title,
      description: project.summary,
      url,
      genre: project.category,
      creator: { "@id": PERSON },
      publisher: { "@id": BUSINESS },
      ...(project.client ? { sponsor: { "@type": "Organization", name: project.client } } : {}),
      associatedMedia: stills.map(imageNode),
      // `image` is the field Google reads for an image result, and a case whose
      // cover is a film used to have none at all — it fell back to nothing
      // rather than to the gallery it already carries.
      ...(project.cover.kind === "image"
        ? { image: imageNode(project.cover) }
        : stills.length > 0
          ? { image: imageNode(stills[0]) }
          : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Work", item: `${site.url}/work` },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
  ];
}

/** The work index, as an ordered list of the case studies it links to. */
export function workIndexGraph(): Node[] {
  return [
    {
      "@type": "CollectionPage",
      "@id": `${site.url}/work#collection`,
      name: "Work",
      url: `${site.url}/work`,
      isPartOf: { "@id": WEBSITE },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title,
          url: `${site.url}/work/${project.slug}`,
        })),
      },
    },
  ];
}
