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
    <>
      {projects.map((project, i) => {
        const isLast = i === projects.length - 1;
        return (
          <BentoCard
            key={project.name}
            className={
              isLast ? "col-span-12" : "col-span-12 sm:col-span-6 md:col-span-4"
            }
            index={startIndex + i}
          >
            <motion.div
              layoutId={`project-card-${project.name}`}
              className="h-full cursor-pointer"
              style={{ borderRadius: "1rem" }}
              onClick={() => router.push(`/projects/${project.slug}`)}
            >
              <Card
                className={`h-full ${
                  isLast
                    ? "flex flex-col md:flex-row md:items-start md:gap-8"
                    : "flex flex-col justify-between"
                }`}
              >
                <div
                  className={
                    isLast ? "flex flex-col flex-1 min-w-0" : "contents"
                  }
                >
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle
                        className={`font-black tracking-tight text-foreground ${
                          isLast ? "text-xl" : "text-base"
                        }`}
                      >
                        {project.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`font-mono text-[0.6rem] shrink-0 ${
                          project.status === "complete"
                            ? "text-emerald-500 border-emerald-500/30"
                            : project.status === "wip"
                              ? "text-amber-500 border-amber-500/30"
                              : "text-muted-foreground"
                        }`}
                      >
                        {project.year}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardContent
                  className={`flex flex-col gap-3 ${
                    isLast
                      ? "md:min-w-70 md:border-l md:border-border/40 md:pl-8"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  {isLast && project.live === "/" ? (
                    <Badge
                      variant="outline"
                      className="w-fit text-[0.6rem] uppercase tracking-[0.15em] font-normal"
                    >
                      You&apos;re viewing it →
                    </Badge>
                  ) : (
                    <p className="text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground/70">
                      Click to expand
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </BentoCard>
        );
      })}
    </>
  );
}
