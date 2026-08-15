"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BentoCard } from "@/components/bento-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data";

interface ProjectsGridProps {
  projects: Project[];
  /** Grid stagger offset — pass the index of the first project in the overall grid */
  startIndex?: number;
}

export function ProjectsGrid({ projects, startIndex = 0 }: ProjectsGridProps) {
  const router = useRouter();

  return (
    <BentoCard className="col-span-12" index={startIndex}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Selected Work
          </CardTitle>
          <CardDescription>
            Personal and academic projects that show how I approach product
            decisions, technical trade-offs, and shipping.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          {projects.map((project) => {
            return (
              <motion.div
                key={project.name}
                className="flex h-full cursor-pointer flex-col gap-3 rounded-none border-2 border-border bg-background/55 p-4 shadow-[inset_1px_1px_0_oklch(1_0_0_/_0.22),inset_-1px_-1px_0_oklch(0.18_0.035_48_/_0.28)]"
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/projects/${project.slug}`)}
              >
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base font-black tracking-tight text-foreground">
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="shrink-0 font-mono text-[0.6rem]"
                      >
                        {project.year}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`shrink-0 font-mono text-[0.6rem] ${
                          project.status === "complete"
                            ? "border-signal-green/45 text-signal-green"
                            : project.status === "wip"
                              ? "border-primary/55 text-primary"
                              : "text-muted-foreground"
                        }`}
                      >
                        {project.status === "complete"
                          ? "COMPLETE"
                          : project.status === "wip"
                            ? "WIP"
                            : "ARCHIVED"}
                      </Badge>
                      {project.published && (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-signal-cyan/45 font-mono text-[0.6rem] text-signal-cyan"
                        >
                          Published
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-4">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-1">
                      {project.stack.map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground/70">
                      Open project details
                    </p>
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
