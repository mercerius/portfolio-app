"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { projects } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use } from "react";

interface ModalPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectModal({ params }: ModalPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;
    document.body.dataset.scrollLocked = "true";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.back();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.scrollLocked;
    };
  }, [project, router]);

  if (!project) return null;

  const hasLiveDemo =
    !!project.live.trim() &&
    project.live !== "/" &&
    !project.live.includes("github.com");

  const statusLabel: Record<typeof project.status, string> = {
    complete: "Complete",
    wip: "In Progress",
    archived: "Archived",
  };

  const statusClass: Record<typeof project.status, string> = {
    complete: "text-emerald-500",
    wip: "text-amber-500",
    archived: "text-muted-foreground",
  };

  return (
    <AnimatePresence>
      {mounted && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => router.back()}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              layoutId={`project-card-${project.name}`}
              className="w-full max-w-lg sm:max-w-2xl max-h-[90svh] overflow-y-auto pointer-events-auto"
              style={{ borderRadius: "1rem" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label={`${project.name} project details`}
            >
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <CardTitle className="text-xl font-black tracking-tight text-foreground">
                        {project.name}
                      </CardTitle>
                      <Badge variant="outline" className="font-mono shrink-0">
                        {project.year}
                      </Badge>
                      <span
                        className={`text-[0.6rem] font-bold uppercase tracking-[0.2em] shrink-0 ${statusClass[project.status]}`}
                      >
                        {statusLabel[project.status]}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 shrink-0 mt-0.5"
                      onClick={() => router.back()}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                  {hasLiveDemo ? (
                    <Tabs defaultValue="details">
                      <TabsList className="mb-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="preview">Live Preview</TabsTrigger>
                      </TabsList>

                      <TabsContent
                        value="details"
                        className="flex flex-col gap-5 mt-0"
                      >
                        <ModalBody project={project} />
                      </TabsContent>

                      <TabsContent value="preview" className="mt-0">
                        <iframe
                          src={project.live}
                          title={`${project.name} live demo`}
                          className="w-full h-96 rounded-xl border border-border/60 bg-muted"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <ModalBody project={project} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function ModalBody({ project }: { project: (typeof projects)[number] }) {
  const hasLiveDemo =
    !!project.live.trim() &&
    project.live !== "/" &&
    !project.live.includes("github.com");

  return (
    <>
      <p className="text-sm/relaxed text-muted-foreground">
        {project.longDescription}
      </p>

      <Separator />

      <div className="flex flex-col gap-2">
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Highlights
        </p>
        <ul className="flex flex-col gap-1.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm/relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="secondary">
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {project.href && (
          <Button asChild size="sm" variant="outline">
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              View Source
            </a>
          </Button>
        )}
        {hasLiveDemo && (
          <Button asChild size="sm" variant="default">
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              Open Demo
            </a>
          </Button>
        )}
        {project.live === "/" && (
          <Badge
            variant="outline"
            className="self-center text-[0.6rem] uppercase tracking-[0.15em] font-normal"
          >
            You&apos;re viewing it →
          </Badge>
        )}
      </div>
    </>
  );
}
