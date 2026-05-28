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
import {
  personal,
  status,
  skills,
  experience,
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
                <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground ring-[3px] ring-primary/30 ring-offset-2 ring-offset-transparent">
                    {personal.initials}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <h1 className="text-4xl font-black tracking-tight leading-none text-foreground sm:text-5xl">
                        {personal.name}
                      </h1>
                      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-primary">
                        {personal.title} · {personal.location}
                      </p>
                    </div>
                    <p className="text-sm/relaxed text-muted-foreground max-w-prose">
                      {personal.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button asChild size="sm" variant="default">
                        <a href={`mailto:${personal.email}`}>Email me</a>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={personal.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={personal.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <a
                          href={personal.links.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download CV ↓
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Status ────────────────────── col 9–12 */}
            <BentoCard className="col-span-12 md:col-span-4" index={1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      {status.label}
                    </span>
                  </div>
                  <Separator />
                  <dl className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Type</dt>
                      <dd className="font-medium">{status.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Location</dt>
                      <dd className="font-medium">{status.location}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Notice</dt>
                      <dd className="font-medium">{status.notice}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Skills ────────────────────── col 1–4 */}
            <BentoCard className="col-span-12 md:col-span-4" index={2}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-1.5">
                      <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {items.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Projects ──────────────────── col 5–8, 9–12 */}
            <ProjectsGrid projects={projects} startIndex={3} />

            {/* ── Experience ────────────────── col 1–8 */}
            <BentoCard className="col-span-12 md:col-span-8" index={5}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Experience
                  </CardTitle>
                  <CardDescription>
                    {experience.length} years · {experience.length} companies
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  {experience.map((role, i) => (
                    <div key={i}>
                      {i > 0 && <Separator className="mb-5" />}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold tracking-tight text-foreground">
                              {role.title}
                            </p>
                            <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground">
                              {role.company}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="font-mono shrink-0"
                          >
                            {role.period}
                          </Badge>
                        </div>
                        <ul className="flex flex-col gap-1 pl-3 text-xs/relaxed text-muted-foreground">
                          {role.highlights.map((h, j) => (
                            <li
                              key={j}
                              className="relative before:absolute before:-left-3 before:content-['·']"
                            >
                              {h}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {role.stack.map((s) => (
                            <Badge key={s} variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Education ─────────────────── col 9–12 */}
            <BentoCard className="col-span-12 md:col-span-4" index={6}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-bold tracking-tight text-foreground">
                      {education.degree}
                    </p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
                      {education.institution}
                    </p>
                    <Badge variant="outline" className="w-fit font-mono">
                      {education.year}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-1.5 text-xs">
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Certifications
                    </p>
                    {education.certifications.map((cert) => (
                      <p key={cert} className="text-muted-foreground">
                        {cert}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </BentoCard>

            {/* ── Currently exploring ───────── full width */}
            <BentoCard className="col-span-12" index={7}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    Currently exploring
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  {exploring.map(({ topic }) => (
                    <div key={topic} className="flex flex-col gap-1.5">
                      <span className="text-xs text-muted-foreground">
                        {topic}
                      </span>
                      <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/70" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </BentoCard>
          </div>

          <footer className="mt-8 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">
            Last updated {footer.lastUpdated} · Built with {footer.builtWith}
          </footer>
        </main>
      </div>
    </>
  );
}
