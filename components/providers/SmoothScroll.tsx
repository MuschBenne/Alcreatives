"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Lets any component pause the smooth scroll (used by the overlay menu). */
export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      // Lenis measures how far the page scrolls by watching <html> resize, and
      // <html> does not have to grow with its content — a fixed height on it
      // froze the measurement, and scrolling stopped partway down every long
      // page until the window was resized. The height is unpinned now, but the
      // dependency was fragile enough to be worth removing: we watch <body>
      // instead, which always grows.
      autoResize: false,
    });

    // Late-arriving media changes the page height without a navigation or a
    // load event, so an observer catches what explicit calls would miss.
    const remeasure = () => instance.resize();
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener("load", remeasure);

    const raf = (time: number) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
    setLenis(instance);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("load", remeasure);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Every route change starts at the top, instantly, with no easing artefact.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    // The new route is a different length; measure before anyone scrolls it.
    lenis?.resize();
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
