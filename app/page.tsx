import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeferredOilShaderBackground from "@/components/deferred-oil-shader-background";
import DeferredThemeToggle from "@/components/deferred-theme-toggle";
import { BentoCard } from "@/components/bento-card";
import { ProjectsGrid } from "@/components/projects-grid";
import Image from "next/image";
import {
  personal,
  status,
  skills,
  background,
  projects,
  education,
  exploring,
  footer,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <DeferredOilShaderBackground />
      <div
        className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-10 2xl:px-16"
        style={{ zIndex: 1 }}
      >
        <main id="main-content" className="mx-auto max-w-7xl">
          <div className="flex justify-end mb-4">
            <DeferredThemeToggle />
          </div>
          {/* 12-column bento grid */}
          <div className="grid grid-cols-12 gap-4 md:gap-5">
            {/* ── Hero ──────────────────────── col 1–8 */}
            <BentoCard className="col-span-12 md:col-span-8" index={0}>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-4">
                  {/* Identity row: lg → icon + name + title all inline; below lg → icon + stacked name/title */}
                  <div className="flex flex-row items-center gap-5 sm:gap-8">
                    <div className="flex h-24 w-24 sm:h-40 sm:w-40 shrink-0 items-center justify-center rounded-full ring-[3px] ring-primary/30 ring-offset-2 ring-offset-transparent overflow-hidden">
                      <Image
                        src="/icon.svg"
                        alt={personal.name}
                        width={160}
                        height={160}
                        loading="eager"
                      />
                    </div>
                    <div className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-4">
                      <h1 className="text-4xl font-black tracking-tight leading-none text-foreground sm:text-5xl sm:whitespace-nowrap">
                        {personal.name}
                      </h1>
                      <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
                        <span className="whitespace-nowrap">
                          {personal.title}
                        </span>
                        {" · "}
                        <span className="whitespace-nowrap">
                          {personal.location}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Bio + buttons: lg → two columns; smaller → stacked */}
                  <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                    <p className="text-sm/relaxed max-w-prose">
                      {personal.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
                      <div className="flex flex-row gap-2 lg:justify-end">
                        <Button asChild size="icon-sm" variant="secondary">
                          <a
                            href={personal.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                          >
                            <Image
                              src="/github-color.svg"
                              alt=""
                              width={16}
                              height={16}
                            />
                          </a>
                        </Button>
                        <Button asChild size="icon-sm" variant="secondary">
                          <a
                            href={personal.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                          >
                            <Image
                              src="/linkedin-color.svg"
                              alt=""
                              width={16}
                              height={16}
                            />
                          </a>
                        </Button>
                      </div>
                      <Button asChild size="sm" variant="secondary">
                        <a
                          href={personal.links.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download CV ↓
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="default">
                        <a href={`mailto:${personal.email}`}>Email me</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Status ────────────────────── col 9–12 */}
            <BentoCard className="col-span-12 md:col-span-4" index={1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pb-6">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 dark:bg-emerald-400" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    </span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      {status.label}
                    </span>
                  </div>
                  <Separator />
                  <dl className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground shrink-0">Type</dt>
                      <dd className="font-medium text-right">{status.type}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground shrink-0">
                        Location
                      </dt>
                      <dd className="font-medium text-right">
                        {status.location}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground shrink-0">Notice</dt>
                      <dd className="font-medium text-right">
                        {status.notice}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Skills ────────────────────── col 1–8 */}
            <BentoCard className="col-span-12 md:col-span-8" index={2}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="columns-1 sm:columns-2 lg:columns-3 gap-3">
                  {Object.entries(skills).map(([category, items]) => (
                    <div
                      key={category}
                      className="break-inside-avoid mb-3 flex flex-col gap-2 rounded-xl border border-border/60 bg-background/40 p-3"
                    >
                      <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {items.map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="text-sm font-light"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Education ─────────────────── col 9–12 */}
            <BentoCard className="col-span-12 md:col-span-4" index={3}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5 pb-6">
                  {/* Current degree */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-bold tracking-tight text-foreground">
                        {education.degree}
                      </p>
                      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                        {education.institution}
                      </p>
                      <Badge variant="outline" className="w-fit font-mono">
                        {education.year}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-center shrink-0 rounded-lg border border-border/60 bg-background/40 px-3 py-2 gap-0.5">
                      <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        GPA
                      </span>
                      <span className="font-mono font-bold tabular-nums text-foreground text-lg leading-none">
                        {education.gpa.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Planned */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Planned
                    </p>
                    <p className="text-sm font-bold tracking-tight text-muted-foreground">
                      B.S. Computer Science
                    </p>
                    <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      Western Governors University, Online
                    </p>
                    <Badge variant="outline" className="w-fit font-mono">
                      By 2027
                    </Badge>
                  </div>

                  {education.certifications.length > 0 && <Separator />}

                  {/* Certifications */}
                  {education.certifications.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Certifications
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {education.certifications.map((cert) => (
                          <div key={cert} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                            <span className="text-xs/relaxed text-muted-foreground">
                              {cert}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Projects ──────────────────── wide cards */}
            <ProjectsGrid projects={projects} startIndex={4} />

            {/* ── Currently exploring ───────── full width */}
            <BentoCard className="col-span-12" index={4 + projects.length}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Currently exploring
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {exploring.map(({ topic, progress }) => (
                    <div key={topic} className="flex flex-col gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        {topic}
                      </span>
                      <div className="h-0.75 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full animate-pulse rounded-full bg-linear-to-r from-primary/50 via-primary to-primary/70"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── About Me ──────────────────── last row */}
            <BentoCard className="col-span-12" index={5 + projects.length}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {background.title}
                  </CardTitle>
                  <CardDescription>{background.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
                    <div className="flex flex-col gap-4 pl-4 bg-background/40 rounded-xl border border-border/60 p-4">
                      <p className="max-w-3xl text-prose indent-4 font-light">
                        {background.narrative}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                        What my experience brings
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                        {background.strengths.map((strength) => (
                          <div
                            key={strength.title}
                            className="rounded-xl border border-border/60 bg-background/40 p-4"
                          >
                            <p className="text-sm font-semibold tracking-tight text-foreground">
                              {strength.title}
                            </p>
                            <p className="mt-1 text-xs/relaxed text-muted-foreground">
                              {strength.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BentoCard>
          </div>

          <footer className="mt-8 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-background">
            Last updated {footer.lastUpdated} · Built with {footer.builtWith}
          </footer>
        </main>
      </div>
    </>
  );
}
