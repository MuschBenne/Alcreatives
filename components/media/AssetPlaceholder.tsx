/**
 * Shown wherever a real asset has not landed yet. It is deliberately quiet and
 * on-brand rather than a loud "broken image", and it names the exact file to
 * drop in so Alvin can fill the site by filename alone.
 */
export function AssetPlaceholder({
  path,
  alt,
  kind,
}: {
  path: string;
  alt: string;
  kind: "image" | "video";
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden bg-surface p-4 sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 20% 0%, #1c1c1c 0%, #101010 45%, #0b0b0b 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #f5f4f2 0 1px, transparent 1px 9px)",
        }}
      />
      <span className="type-label relative z-10 text-muted">
        {kind === "video" ? "Video" : "Still"}
      </span>
      <div className="relative z-10 min-w-0">
        <p className="type-label mb-2 text-muted/70">Awaiting asset</p>
        <p className="truncate font-sans text-xs text-ink/70 sm:text-sm">{path}</p>
        <p className="mt-1 truncate font-sans text-xs text-muted">{alt}</p>
      </div>
    </div>
  );
}
