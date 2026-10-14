"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { useLenis } from "@/components/providers/SmoothScroll";
import { easeInOutQuart, easeOutExpo } from "@/lib/motion";

const links = [
  { href: "/work", label: "Work" },
  { href: "/behind-the-scenes", label: "Behind the scenes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on navigation — including browser back/forward. Adjusting state
  // during render is the supported pattern here; an effect would cascade.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the overlay and keep the keyboard inside it.
  useEffect(() => {
    if (!open) {
      lenis?.start();
      document.body.style.overflow = "";
      return;
    }

    lenis?.stop();
    document.body.style.overflow = "hidden";

    // The overlay says aria-modal, so the page behind it has to actually be
    // unreachable. Without this a screen reader walked straight out of the
    // dialog and through the whole page underneath. The header is left alone:
    // the button that closes the menu lives there.
    const behind = [document.querySelector("main"), document.querySelector("footer")].filter(
      (element): element is HTMLElement => element !== null,
    );
    behind.forEach((element) => element.setAttribute("inert", ""));

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      // The trigger is part of the cycle even though it is not in the panel:
      // it sits in <header> at z-50, above the overlay at z-40, and it is the
      // control that says "Close". Collecting only the panel's own elements
      // left a visible button no keyboard could reach — Escape was the only
      // way out. It goes first because that is where it sits in the document.
      const focusable = [
        triggerRef.current,
        ...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ].filter((element): element is HTMLElement => element !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      behind.forEach((element) => element.removeAttribute("inert"));
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !open
            ? "bg-bg/70 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            className="text-ink transition-opacity hover:opacity-60"
            aria-label={`${site.name}, home`}
          >
            <Wordmark className="text-sm md:text-base" />
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            // Only while the panel exists: the overlay is unmounted when
            // closed, so this otherwise pointed at an id that was not there.
            aria-controls={open ? "overlay-menu" : undefined}
            className="group -mr-2 flex items-center gap-3 px-2 py-2 text-ink"
          >
            <span className="type-label transition-opacity group-hover:opacity-60">
              {open ? "Close" : "Menu"}
            </span>
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="overlay-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            // overscroll-contain stops a scroll that reaches the end of the
            // menu from carrying on into the page behind it, which on iOS is
            // what makes an overlay feel broken.
            className="fixed inset-0 z-40 flex flex-col overscroll-contain bg-bg"
            initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={
              reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
            }
            // pointerEvents belongs in the exit target, not in a class keyed
            // on `open`: AnimatePresence freezes props while a child leaves, so
            // the class would never change and the closing overlay went on
            // swallowing clicks for the full 800 ms of its fade.
            exit={
              reduceMotion
                ? { opacity: 0, pointerEvents: "none" }
                : { clipPath: "inset(0 0 100% 0)", pointerEvents: "none" }
            }
            transition={{ duration: 0.8, ease: easeInOutQuart }}
          >
            <nav className="shell flex flex-1 flex-col justify-center pt-24 pb-12">
              <ul>
                {links.map((link, index) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.div
                      initial={reduceMotion ? { opacity: 0 } : { y: "110%" }}
                      animate={reduceMotion ? { opacity: 1 } : { y: "0%" }}
                      exit={reduceMotion ? { opacity: 0 } : { y: "110%" }}
                      transition={{
                        duration: 0.8,
                        ease: easeOutExpo,
                        delay: reduceMotion ? 0 : 0.15 + index * 0.07,
                      }}
                    >
                      <Link
                        href={link.href}
                        // Dimming the current page said "you are here" to
                        // people who can see it and to nobody else.
                        aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                        className={`type-hero block py-1 transition-opacity duration-300 hover:opacity-50 ${
                          pathname.startsWith(link.href) ? "opacity-50" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="shell flex flex-col gap-6 border-t border-hairline py-8 sm:flex-row sm:items-end sm:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 }}
            >
              <div>
                <p className="type-label mb-3 text-muted">Get in touch</p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-display text-lg tracking-tight transition-opacity hover:opacity-60"
                >
                  {site.contact.email}
                </a>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="type-label text-muted transition-colors hover:text-ink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
