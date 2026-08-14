"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { BentoCard } from "@/components/bento-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/utils";

interface ProjectsGridV2Props {
  projects: Project[];
  startIndex?: number;
  className?: string;
}

function getSecondaryLink(project: Project) {
  if (project.live.trim()) {
    return {
      href: project.live,
      label: project.liveLabel ?? "Live demo",
      external: !project.live.startsWith("/"),
    };
  }

  if (project.href.trim()) {
    return {
      href: project.href,
      label: "GitHub",
      external: true,
    };
  }

  return null;
}

export function ProjectsGridV2({
  projects,
  startIndex = 0,
  className,
}: ProjectsGridV2Props) {
  const router = useRouter();

  return (
    <BentoCard className={cn("col-span-12", className)} index={startIndex}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Selected Work
          </CardTitle>
          <CardDescription>
            Projects that best represent my product judgment, implementation
            range, and shipped results.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {projects.map((project) => {
            const secondaryLink = getSecondaryLink(project);

            return (
              <motion.div
                key={project.name}
                className="group relative flex h-full cursor-pointer flex-col gap-4 overflow-hidden rounded-none border-2 border-border bg-background/60 p-4 shadow-[inset_1px_1px_0_oklch(1_0_0_/_0.22),inset_-1px_-1px_0_oklch(0.18_0.035_48_/_0.28)] transition-[border-color,background-color] duration-150 hover:border-primary hover:bg-background/85"
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/projects/${project.slug}`)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg font-black tracking-tight text-foreground">
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="shrink-0 font-mono text-[0.6rem]"
                      >
                        {project.year}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3 max-w-[46ch] text-sm/relaxed">
                      {project.description}
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 font-mono text-[0.6rem]",
                        project.status === "complete"
                          ? "border-signal-green/45 text-signal-green"
                          : project.status === "wip"
                            ? "border-primary/55 text-primary"
                            : "text-muted-foreground",
                      )}
                    >
                      {project.status === "complete"
                        ? "COMPLETE"
                        : project.status === "wip"
                          ? "WIP"
                          : "ARCHIVED"}
                    </Badge>
                    {project.published ? (
                      <Badge
                        variant="outline"
                        className="shrink-0 border-signal-cyan/45 font-mono text-[0.6rem] text-signal-cyan"
                      >
                        Published
                      </Badge>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                  {project.stack.length > 5 ? (
                    <Badge variant="secondary">
                      +{project.stack.length - 5}
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-auto flex min-h-11 flex-wrap items-end justify-between gap-2 pt-2">
                  {secondaryLink ? (
                    <Button
                      asChild
                      size="sm"
                      variant="default"
                      className="gap-1.5"
                    >
                      <Link
                        href={secondaryLink.href}
                        target={secondaryLink.external ? "_blank" : undefined}
                        rel={
                          secondaryLink.external
                            ? "noopener noreferrer"
                            : undefined
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        {secondaryLink.label}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}

                  <div className="pointer-events-none ml-auto inline-flex items-center gap-1.5 rounded-none border border-primary bg-primary/10 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary transition-[transform,opacity] lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <span className="lg:hidden">Tap to open</span>
                    <span className="hidden lg:inline">Open project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </BentoCard>
  );
}
