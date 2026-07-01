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
            Personal builds and academic projects that show how I design,
            implement, and ship software.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          {projects.map((project) => {
            return (
              <motion.div
                key={project.name}
                layoutId={`project-card-${project.name}`}
                className="flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-4"
                style={{ borderRadius: "1rem" }}
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
                        className={`shrink-0 font-mono text-[0.6rem] ${
                          project.status === "complete"
                            ? "border-emerald-500/30 text-emerald-500"
                            : project.status === "wip"
                              ? "border-amber-500/30 text-amber-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {project.year}
                      </Badge>
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
                      Click to expand
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
