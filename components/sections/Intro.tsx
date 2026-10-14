import { site } from "@/data/site";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Reveal, RevealLine } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// The stills moved to data/site.ts so the data-integrity test can see them —
// a Node test cannot import this file, so as literals here they were checked by
// nothing at all.
const { portrait, landscape, row } = site.introStills;

export function Intro() {
  return (
    <section className="shell py-24 md:py-36">
      <SectionHeading index="01" title="Approach" />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7 lg:flex lg:flex-col">
          <p className="type-statement text-balance">
            <RevealLine>Working with cars,</RevealLine>
            <RevealLine delay={0.08}>available light and whatever</RevealLine>
            <RevealLine delay={0.16}>motion the moment gives.</RevealLine>
          </p>
          <Reveal delay={0.2}>
            <p className="type-body mt-8 max-w-xl text-muted">{site.intro}</p>
          </Reveal>
          {/* On desktop the frame is taken out of flow and fills whatever height
              the portrait leaves, so both columns end on the same line. In flow
              it would add its own height to the row and push the portrait. */}
          <Reveal delay={0.25} className="mt-10 lg:relative lg:mt-12 lg:min-h-64 lg:flex-1">
            <MediaFrame
              media={landscape}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="w-full lg:absolute lg:inset-0 lg:h-full"
            />
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:pt-16">
          <Reveal>
            <MediaFrame
              media={portrait}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full"
            />
          </Reveal>
        </div>
      </div>

      {/* Three across at every width: stacked on a phone they would run three
          screens tall, and the point of the row is seeing them together.
          Full width on desktop too, on Alvin's call. It used to sit inset by a
          sixth and run two thirds wide, which left it floating under a grid
          spanning the whole shell; the outer edges line up with the two frames
          above now. The phone layout never had the inset — it was lg-only. */}
      <div className="mt-8 grid grid-cols-3 gap-2 md:mt-16 md:gap-6">
        {row.map((media, index) => (
          <Reveal key={media.src} delay={0.1 + index * 0.08}>
            {/* 22vw was right while the row ran two thirds wide. At full width
                each frame is a whole third of the shell, and an understated hint
                has the browser pick the 640 variant and upscale it — the same
                kind of lying number as the srcset descriptor fixed earlier. */}
            <MediaFrame
              media={media}
              sizes="(min-width: 1024px) 31vw, 33vw"
              className="w-full"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
