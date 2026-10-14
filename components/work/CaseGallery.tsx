import type { Media } from "@/data/types";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";

/** Landscape media runs wide; portrait and square media pair up side by side. */
function isWide(media: Media) {
  const [w, h] = (media.ratio ?? "3/2").split("/").map(Number);
  if (!w || !h) return true;
  return w / h > 1.2;
}

type Row = { type: "wide"; items: [Media] } | { type: "pair"; items: Media[] };

function buildRows(gallery: Media[]): Row[] {
  const rows: Row[] = [];
  let pending: Media[] = [];

  const flush = () => {
    if (pending.length > 0) {
      rows.push({ type: "pair", items: pending });
      pending = [];
    }
  };

  for (const media of gallery) {
    if (isWide(media)) {
      flush();
      rows.push({ type: "wide", items: [media] });
    } else {
      pending.push(media);
      if (pending.length === 2) flush();
    }
  }
  flush();

  return rows;
}

export function CaseGallery({ gallery }: { gallery: Media[] }) {
  const rows = buildRows(gallery);

  return (
    <div className="space-y-8 md:space-y-16">
      {rows.map((row, index) =>
        row.type === "wide" ? (
          <Reveal key={index}>
            <MediaFrame
              media={row.items[0]}
              sizes="(min-width: 1024px) 90vw, 100vw"
              className="w-full"
            />
          </Reveal>
        ) : (
          <div
            key={index}
            className={`grid gap-8 md:gap-6 ${
              row.items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2"
            }`}
          >
            {row.items.map((media, itemIndex) => (
              <Reveal
                key={media.src}
                delay={itemIndex * 0.08}
                // A lone portrait frame sits off-centre rather than stretching.
                className={
                  row.items.length === 1 ? "md:col-span-1 md:col-start-1" : undefined
                }
              >
                <MediaFrame
                  media={media}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="w-full"
                />
              </Reveal>
            ))}
          </div>
        ),
      )}
    </div>
  );
}
