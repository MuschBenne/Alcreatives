import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Numbered section header: small index on the left, title on the right. */
export function SectionHeading({
  index,
  title,
  action,
}: {
  index: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6 border-t border-hairline pt-5 md:mb-16">
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="type-label text-muted">{index}</span>
        <h2 className="type-label">{title}</h2>
      </div>
      {action}
    </Reveal>
  );
}
