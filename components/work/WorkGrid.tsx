"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { categories } from "@/data/projects";
import type { Project } from "@/data/types";
import { ProjectCard } from "./ProjectCard";
import { easeOutExpo } from "@/lib/motion";

/**
 * The filter is links, not buttons.
 *
 * It used to be React state: clicking a category changed what was on screen and
 * nothing else, so there was no address to link to, share, or index. A crawler
 * follows links, not click handlers. Each category is a page now, and the grid
 * simply renders whatever list it is given.
 */
export function WorkGrid({
  projects,
  active = "all",
  total,
}: {
  projects: Project[];
  /** Category slug, or "all" on /work. */
  active?: string;
  /** Count for the "All" tab, which a filtered page cannot work out itself. */
  total: number;
}) {
  const reduceMotion = useReducedMotion();

  const tabs = [
    { slug: "all", label: "All", href: "/work", count: total },
    ...categories.map((category) => ({
      slug: category.slug,
      label: category.title,
      href: `/work/category/${category.slug}`,
      count: undefined as number | undefined,
    })),
  ];

  return (
    <>
      <nav
        aria-label="Filter projects by category"
        className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-hairline pt-5 md:mb-16"
      >
        {tabs.map((tab) => {
          const isActive = tab.slug === active;
          return (
            <Link
              key={tab.slug}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`type-label transition-colors duration-300 ${
                isActive ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              {tab.count !== undefined ? (
                <sup className="ml-1 text-[0.6rem] opacity-60">{tab.count}</sup>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <motion.div
        layout={!reduceMotion}
        className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              // data-reveal was missing here, so motion wrote opacity: 0 into
              // the server HTML with nothing to clear it: the whole grid was
              // invisible without JavaScript, and the <noscript> rule in
              // app/layout.tsx could not reach it. It also takes the
              // reduced-motion rule in globals.css.
              data-reveal
              layout={!reduceMotion}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
            >
              <ProjectCard
                project={project}
                // This page has no section heading, so the cards are the second
                // level of its outline, not the third.
                headingLevel="h2"
                // Every cover is a portrait crop, so the grid keeps one shape
                // rather than letterboxing them into a landscape cell.
                ratio="4/5"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={index < 2}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {projects.length === 0 ? (
        <p className="type-body py-20 text-center text-muted">
          Nothing in this category yet.
        </p>
      ) : null}
    </>
  );
}
