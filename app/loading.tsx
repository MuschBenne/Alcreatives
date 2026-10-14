export default function Loading() {
  return (
    <div className="shell flex flex-1 items-end pt-40 pb-32" aria-busy="true">
      <div className="w-full">
        <span className="sr-only">Loading</span>
        {/* Quiet skeleton in the site's own rhythm: a label, a heading, a frame. */}
        <div className="h-3 w-24 animate-pulse bg-surface-2" />
        <div className="mt-8 h-[clamp(2.75rem,9vw,8.5rem)] w-full max-w-3xl animate-pulse bg-surface-2" />
        <div className="mt-16 aspect-[16/9] w-full animate-pulse bg-surface" />
      </div>
    </div>
  );
}
