import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkGrid } from "@/components/work/WorkGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { jsonLd, workIndexGraph } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected automotive, product and commercial photography and film projects.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className="shell pt-32 pb-24 md:pt-44 md:pb-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(workIndexGraph()) }}
      />
      <PageHeader
        label="Selected work"
        title="Work"
        lead="Campaigns, launches and brand films across automotive, product and commercial."
      />
      <WorkGrid projects={projects} active="all" total={projects.length} />
    </div>
  );
}
