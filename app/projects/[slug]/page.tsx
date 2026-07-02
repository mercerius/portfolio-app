import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProjectPageTabs } from "@/components/project-page-tabs";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Jesse Neff`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const statusColor: Record<typeof project.status, string> = {
    complete: "text-emerald-500",
    wip: "text-amber-500",
    archived: "text-muted-foreground",
  };

  const hasLiveDemo =
    !!project.live.trim() &&
    project.live !== "/" &&
    !project.live.includes("github.com");

  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
          <Link href="/">← Back to portfolio</Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">
                {project.name}
              </CardTitle>
              <Badge variant="outline" className="font-mono">
                {project.year}
              </Badge>
              <span
                className={`text-[0.65rem] font-bold uppercase tracking-[0.2em] ${statusColor[project.status]}`}
              >
                {project.status}
              </span>
            </div>
            <p className="text-sm/relaxed text-muted-foreground mt-1">
              {project.description}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            {hasLiveDemo ? (
              <ProjectPageTabs project={project}>
                <ProjectDetails project={project} hasLiveDemo={hasLiveDemo} />
              </ProjectPageTabs>
            ) : (
              <ProjectDetails project={project} hasLiveDemo={hasLiveDemo} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProjectDetails({
  project,
  hasLiveDemo,
}: {
  project: (typeof projects)[number];
  hasLiveDemo: boolean;
}) {
  return (
    <>
      <p className="text-sm/relaxed">{project.longDescription}</p>

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
              View Source ↗
            </a>
          </Button>
        )}
        {hasLiveDemo && (
          <Button asChild size="sm" variant="default">
            <Link href={project.live}>Live Demo ↗</Link>
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
