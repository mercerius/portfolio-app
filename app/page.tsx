import Image from "next/image";
import { BentoCard } from "@/components/bento-card";
import DeferredOilShaderBackground from "@/components/deferred-oil-shader-background";
import DeferredThemeToggle from "@/components/deferred-theme-toggle";
import { ProjectsGrid } from "@/components/projects-grid";
import { ProjectsGridV2 } from "@/components/projects-grid-v2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { projectsGridV2Flag } from "@/flags";
import {
  background,
  education,
  footer,
  personal,
  projects,
  skills,
  status,
} from "@/lib/data";

function HeroSection({ includeStatus }: { includeStatus: boolean }) {
  return (
    <BentoCard className="col-span-12 md:col-span-8" index={0}>
      <Card className="h-full">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-5 sm:gap-8">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full ring-[3px] ring-primary/30 ring-offset-2 ring-offset-transparent sm:h-40 sm:w-40">
              <Image
                src="/icon.svg"
                alt={personal.name}
                width={160}
                height={160}
                loading="eager"
              />
            </div>
            <div className="flex flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-4">
              <h1 className="text-4xl font-black leading-none tracking-tight text-foreground sm:text-5xl sm:whitespace-nowrap">
                {personal.name}
              </h1>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-primary">
                <span className="whitespace-nowrap">{personal.title}</span>
                {" · "}
                <span className="whitespace-nowrap">{personal.location}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-stretch">
            <p className="max-w-prose text-sm/relaxed">{personal.bio}</p>
            <div className="flex flex-wrap gap-2 lg:h-full lg:flex-col lg:flex-nowrap lg:justify-end">
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

          {includeStatus ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 dark:bg-emerald-400" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                </span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {status.label}
                </span>
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm min-[720px]:grid-cols-3">
                <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5">
                  <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Type
                  </dt>
                  <dd className="text-sm font-medium leading-snug text-foreground">
                    {status.type}
                  </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5">
                  <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Location
                  </dt>
                  <dd className="text-sm font-medium leading-snug text-foreground">
                    {status.location}
                  </dd>
                </div>
                <div className="flex min-w-0 flex-col gap-1 rounded-xl border border-border/50 bg-background/50 px-3 py-2.5">
                  <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Notice
                  </dt>
                  <dd className="text-sm font-medium leading-snug text-foreground">
                    {status.notice}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </BentoCard>
  );
}

function StatusSection() {
  return (
    <BentoCard className="col-span-12 md:col-span-4" index={1}>
      <Card>
        <CardHeader>
          <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-6">
          <div className="flex items-center place-content-between gap-2">
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
              <dt className="shrink-0 text-muted-foreground">Type</dt>
              <dd className="text-right font-medium">{status.type}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted-foreground">Location</dt>
              <dd className="text-right font-medium">{status.location}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted-foreground">Notice</dt>
              <dd className="text-right font-medium">{status.notice}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </BentoCard>
  );
}

function SkillsSection({ compact }: { compact: boolean }) {
  return (
    <BentoCard
      className={
        compact ? "col-span-12 lg:col-span-4" : "col-span-12 md:col-span-8"
      }
      index={compact ? 3 : 2}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent
          className={
            compact
              ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
              : "columns-1 gap-3 sm:columns-2 lg:columns-3"
          }
        >
          {Object.entries(skills).map(([category, items]) => (
            <div
              key={category}
              className="mb-3 flex break-inside-avoid flex-col gap-2 rounded-xl border border-border/60 bg-background/40 p-3"
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
  );
}

function EducationSection({ index }: { index: number }) {
  return (
    <BentoCard className="col-span-12 md:col-span-4" index={index}>
      <Card>
        <CardHeader>
          <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 pb-6">
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
            <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg border border-border/60 bg-background/40 px-3 py-2">
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                GPA
              </span>
              <span className="font-mono text-lg font-bold leading-none tabular-nums text-foreground">
                {education.gpa.toFixed(1)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5">
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Planned
            </p>
            <p className="text-sm font-bold tracking-tight text-muted-foreground">
              B.S. Software Engineering
            </p>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              Western Governors University, Online
            </p>
            <Badge variant="outline" className="w-fit font-mono">
              By 2027
            </Badge>
          </div>

          {education.certifications.length > 0 ? <Separator /> : null}

          {education.certifications.length > 0 ? (
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
          ) : null}
        </CardContent>
      </Card>
    </BentoCard>
  );
}

function AboutSection({ index }: { index: number }) {
  return (
    <BentoCard className="col-span-12" index={index}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {background.title}
          </CardTitle>
          <CardDescription>{background.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-3 lg:order-1">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                How I work
              </p>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
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
            <div className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-4 pl-4 lg:order-2">
              <p className="text-sm indent-4 font-light md:text-base md:leading-relaxed">
                {background.narrative}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </BentoCard>
  );
}

function ContactSection({ index }: { index: number }) {
  return (
    <BentoCard className="col-span-12" index={index}>
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center gap-6 py-12 text-center">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Get in touch
            </h2>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              {
                "I'm looking for software engineering roles where I can keep learning, ship useful software, and work with a team that cares about quality."
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 dark:bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {status.label}
            </span>
          </div>

          <a
            href={`mailto:${personal.email}`}
            className="font-mono text-2xl font-semibold text-primary transition-colors hover:underline underline-offset-4 sm:text-3xl"
          >
            {personal.email}
          </a>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="icon-sm" variant="secondary">
              <a
                href={personal.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Image src="/github-color.svg" alt="" width={16} height={16} />
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
            <Button asChild size="sm" variant="secondary">
              <a
                href={personal.links.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV ↓
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </BentoCard>
  );
}

export default async function Home() {
  const isProjectsGridV2 = await projectsGridV2Flag();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <DeferredOilShaderBackground />
      <div
        className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-10 2xl:px-16"
        style={{ zIndex: 1 }}
      >
        <main id="main-content" className="mx-auto max-w-7xl">
          <div className="mb-4 flex justify-end">
            <DeferredThemeToggle />
          </div>
          <div className="grid grid-cols-12 gap-4 md:gap-5">
            <HeroSection includeStatus={isProjectsGridV2} />
            {isProjectsGridV2 ? (
              <EducationSection index={1} />
            ) : (
              <StatusSection />
            )}
            {isProjectsGridV2 ? (
              <ProjectsGridV2
                className="col-span-12 lg:col-span-8"
                projects={projects}
                startIndex={2}
              />
            ) : (
              <SkillsSection compact={false} />
            )}
            {isProjectsGridV2 ? (
              <SkillsSection compact />
            ) : (
              <EducationSection index={3} />
            )}
            {isProjectsGridV2 ? null : (
              <ProjectsGrid projects={projects} startIndex={5} />
            )}
            <AboutSection
              index={projects.length + (isProjectsGridV2 ? 4 : 5)}
            />
            <ContactSection
              index={projects.length + (isProjectsGridV2 ? 5 : 6)}
            />
          </div>

          <footer className="mt-8 text-center font-mono text-[0.6rem] font-thin uppercase tracking-[0.2em] text-muted-background">
            Last updated {footer.lastUpdated} · Built with {footer.builtWith}
          </footer>
        </main>
      </div>
    </>
  );
}
