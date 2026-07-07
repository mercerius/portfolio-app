"use client";

import { ExternalLink } from "lucide-react";
import { projects } from "@/lib/data";
import { ProjectModalShell } from "@/components/project-modal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlotApiPreview } from "@/components/slot-api-preview";
import { use } from "react";

interface ModalPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectModal({ params }: ModalPageProps) {
  const { slug } = use(params);

  const project = projects.find((p) => p.slug === slug);

  if (!project) return null;

  return (
    <ProjectModalShell project={project}>
      {!!project.livePreviewMode ? (
        <Tabs defaultValue="details">
          <TabsList className="mb-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0 flex flex-col gap-5">
            <ModalBody project={project} />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            {project.livePreviewMode === "api-json" ? (
              <SlotApiPreview />
            ) : (
              <iframe
                src={project.live}
                title={`${project.name} live demo`}
                className="h-96 w-full rounded-xl border border-border/60 bg-muted"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <ModalBody project={project} />
      )}
    </ProjectModalShell>
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
          <Button asChild size="sm" variant="link">
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
              {project.liveLabel ?? "Open Demo"}
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
