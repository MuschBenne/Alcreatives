import { site } from "@/data/site";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Capabilities() {
  return (
    <section className="shell py-24 md:py-36">
      <SectionHeading index="03" title="Capabilities" />

      <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
        {site.capabilities.map((capability, index) => (
          <Reveal key={capability.number} delay={index * 0.08}>
            <article className="group flex h-full flex-col">
              <MediaFrame
                media={{
                  kind: "image",
                  src: capability.image.src,
                  alt: capability.image.alt,
                  ratio: capability.image.ratio,
                }}
                sizes="(min-width: 768px) 33vw, 100vw"
                zoomOnHover
                className="w-full"
              />
              <div className="mt-5 flex items-baseline gap-4">
                <span className="type-label text-muted">{capability.number}</span>
                <h3 className="type-headline">{capability.title}</h3>
              </div>
              <p className="type-body mt-3 text-muted">{capability.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
