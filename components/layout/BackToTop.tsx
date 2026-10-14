"use client";

import { useLenis } from "@/components/providers/SmoothScroll";

export function BackToTop() {
  const lenis = useLenis();

  return (
    <button
      type="button"
      onClick={() => {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="type-label text-muted transition-colors hover:text-ink"
    >
      Back to top ↑
    </button>
  );
}
