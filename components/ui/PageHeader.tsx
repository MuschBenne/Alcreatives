import { Reveal, RevealLine } from "./Reveal";

/** Shared page opener: micro label, huge title, optional lead paragraph. */
export function PageHeader({
  label,
  title,
  lead,
}: {
  label: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-16 md:mb-24">
      <Reveal>
        <p className="type-label mb-6 text-muted">{label}</p>
      </Reveal>
      <h1 className="type-hero">
        <RevealLine>{title}</RevealLine>
      </h1>
      {lead ? (
        <Reveal delay={0.15}>
          <p className="type-body mt-8 max-w-xl text-muted">{lead}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
