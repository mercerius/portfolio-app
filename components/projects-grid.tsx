"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BentoCard } from "@/components/bento-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/data";

interface ProjectsGridProps {
  projects: Project[];
  /** Grid stagger offset — pass the index of the first project in the overall grid */
  startIndex?: number;
}

/**
 * Renders project cards in the bento grid with:
 * - Entrance animations via BentoCard
 * - Per-card layoutId for shared layout expand animation
 * - AnimatePresence overlay when a card is clicked
 */
export function ProjectsGrid({ projects, startIndex = 0 }: ProjectsGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProject = projects.find((p) => p.name === selected) ?? null;

  function hasLiveDemo(live: string, href: string): boolean {
    if (!live.trim()) return false;
    if (live === href) return false;
    return !live.includes("github.com");
  }

  function open(name: string) {
    setSelected(name);
  }

  function close() {
    setSelected(null);
  }

  // Close on Escape; also clean up scroll lock on unmount
  useEffect(() => {
    if (!selected) return;
    document.body.dataset.scrollLocked = "true";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.scrollLocked;
    };
  }, [selected]);

  return (
    <>
      {projects.map((project, i) => (
        <BentoCard
          key={project.name}
          className="col-span-12 md:col-span-4"
          index={startIndex + i}
        >
          {/*
           * The layoutId element must wrap the visible card surface so framer-motion
           * can animate it from the grid position to the expanded overlay position.
           * Fading out when selected prevents a "ghost" card underneath the overlay.
           */}
          <motion.div
            layoutId={`project-card-${project.name}`}
            className="h-full cursor-pointer"
            style={{ borderRadius: "1rem" }}
            animate={{ opacity: selected === project.name ? 0 : 1 }}
            transition={{ duration: 0.12 }}
            onClick={() => open(project.name)}
          >
            <Card className="h-full flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-base font-black tracking-tight text-foreground">
                  {project.name}
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1">
                  {project.stack.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
                <p className="text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground/70">
                  Tap / click to expand
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </BentoCard>
      ))}

      <AnimatePresence>
        {selected && selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            {/* Expanded card — matches the layoutId of the clicked grid card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
              <motion.div
                layoutId={`project-card-${selected}`}
                className="w-full max-w-lg max-h-[90svh] overflow-y-auto pointer-events-auto"
                style={{ borderRadius: "1rem" }}
                role="dialog"
                aria-modal="true"
                aria-label={`${selected} project details`}
              >
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl font-black tracking-tight text-foreground">
                        {selectedProject.name}
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={close}
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-sm/relaxed mt-1">
                      {selectedProject.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <div>
                      <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.stack.map((s) => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={selectedProject.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Source ↗
                        </a>
                      </Button>
                      {hasLiveDemo(
                        selectedProject.live,
                        selectedProject.href,
                      ) && (
                        <Button asChild size="sm" variant="default">
                          <a
                            href={selectedProject.live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo ↗
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
