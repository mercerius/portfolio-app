"use client";

import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlotApiPreview } from "@/components/slot-api-preview";
import type { Project } from "@/lib/data";

interface ProjectPageTabsProps {
  project: Project;
  children: ReactNode;
}

export function ProjectPageTabs({ project, children }: ProjectPageTabsProps) {
  return (
    <Tabs defaultValue="details">
      <TabsList className="mb-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="preview">Live Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="flex flex-col gap-6 mt-0">
        {children}
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        {project.livePreviewMode === "api-json" ? (
          <SlotApiPreview />
        ) : (
          <iframe
            src={project.live}
            title={`${project.name} live demo`}
            className="h-96 w-full rounded-none border-2 border-border bg-muted shadow-[inset_1px_1px_0_oklch(0.18_0.035_48_/_0.25)]"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
