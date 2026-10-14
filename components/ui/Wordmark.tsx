import { site } from "@/data/site";

/**
 * The logo. There is no mark, so the name set in Clash Display *is* the
 * identity — wide tracking, uppercase, with the two words weighted differently
 * so it reads as a lockup rather than as a line of text.
 *
 * Every place the name appears as a logo goes through here, so changing the
 * treatment is a one-file job.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  const [first, ...rest] = site.name.split(" ");

  return (
    <span
      className={`font-display uppercase leading-none whitespace-nowrap ${className}`}
    >
      <span className="font-semibold tracking-[0.2em]">{first}</span>
      {rest.length > 0 ? (
        // The trailing letter-space pushes the word right; the negative margin
        // takes that phantom gap back so the lockup stays optically centred.
        <span className="ml-[0.35em] mr-[-0.2em] font-normal tracking-[0.2em] text-ink/70">
          {rest.join(" ")}
        </span>
      ) : null}
    </span>
  );
}
