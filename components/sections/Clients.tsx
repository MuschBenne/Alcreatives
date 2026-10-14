import { clients } from "@/data/clients";
import { ClientLogo } from "@/components/ui/ClientLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Clients() {
  // The track is rendered twice so the loop is seamless at -50%.
  const track = [...clients, ...clients];

  return (
    <section className="py-24 md:py-36">
      <div className="shell">
        <SectionHeading index="04" title="Selected clients" />
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <ul className="marquee-track flex w-max items-center gap-12 md:gap-20">
          {track.map((client, index) => (
            <li
              key={`${client.name}-${index}`}
              className="flex shrink-0 items-center"
              aria-hidden={index >= clients.length}
            >
              <ClientLogo client={client} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
