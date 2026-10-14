import type { Metadata } from "next";
import { behindTheScenes } from "@/data/bts";
import { MediaFrame } from "@/components/media/MediaFrame";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Behind the scenes",
  description:
    "Phone frames from set: rigs, locations and the shots before the shot.",
  path: "/behind-the-scenes",
});

export default function BehindTheScenesPage() {
  return (
    <div className="shell pt-32 pb-24 md:pt-44 md:pb-36">
      <PageHeader
        label="From set"
        title="Behind the scenes"
      />

      {behindTheScenes.length === 0 ? (
        <p className="type-body py-20 text-center text-muted">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
          {behindTheScenes.map((media, index) => (
            <Reveal
              key={media.src}
              // Stagger across the row, not down the page, so a row lands as one.
              delay={(index % 3) * 0.08}
            >
              <MediaFrame
                media={media}
                sizes="(min-width: 768px) 33vw, 50vw"
                priority={index < 3}
                className="w-full"
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
