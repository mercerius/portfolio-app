"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import type { Project } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectModalShellProps {
  project: Project;
  children: React.ReactNode;
}

const statusLabel: Record<Project["status"], string> = {
  complete: "Complete",
  wip: "In Progress",
  archived: "Archived",
};

const statusClass: Record<Project["status"], string> = {
  complete: "text-emerald-500",
  wip: "text-amber-500",
  archived: "text-muted-foreground",
};

export function ProjectModalShell({
  project,
  children,
}: ProjectModalShellProps) {
  const router = useRouter();

  function requestClose() {
    router.back();
  }

  useEffect(() => {
    document.body.dataset.scrollLocked = "true";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        router.back();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.scrollLocked;
    };
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50"
      data-modal-root=""
      data-project-slug={project.slug}
    >
      <motion.div
        className="absolute inset-0 z-40 bg-black/72"
        data-modal-backdrop=""
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        }}
        onClick={requestClose}
      />

      <div
        className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none sm:p-6"
        data-modal-viewport=""
      >
        <motion.div
          className="pointer-events-auto flex max-h-[90svh] w-full max-w-lg flex-col overflow-hidden sm:max-w-2xl"
          data-modal-panel=""
          style={{ borderRadius: "1rem" }}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 280, damping: 28 },
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 8,
            transition: { duration: 0.15, ease: "easeIn" },
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} project details`}
        >
          <Card
            className="relative isolate h-full w-full overflow-hidden border-white/35 bg-white/88 shadow-[0_24px_80px_rgba(15,23,42,0.24)] backdrop-blur-none transition-none hover:translate-y-0 hover:shadow-[0_24px_80px_rgba(15,23,42,0.24)] dark:border-white/12 dark:bg-zinc-950/82 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] dark:hover:border-white/12 dark:hover:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            data-modal-surface=""
          >
            <CardHeader className="shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <CardTitle className="text-xl font-black tracking-tight text-foreground">
                    {project.name}
                  </CardTitle>
                  <Badge variant="outline" className="shrink-0 font-mono">
                    {project.year}
                  </Badge>
                  {project.published ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-sky-400/40 font-mono text-sky-400"
                    >
                      Published
                    </Badge>
                  ) : null}
                  <span
                    className={`shrink-0 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${statusClass[project.status]}`}
                  >
                    {statusLabel[project.status]}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-0.5 h-7 w-7 shrink-0 p-0"
                  onClick={requestClose}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 overflow-y-auto">
              {children}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
