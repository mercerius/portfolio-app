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

const skills = {
  Languages: ["TypeScript", "Python", "Go", "SQL", "Bash"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "GraphQL"],
  DevOps: ["Docker", "AWS", "GitHub Actions", "Terraform", "Kubernetes"],
};

const experience = [
  {
    title: "Senior Software Engineer",
    company: "Acme Corp",
    period: "2022 – Present",
    highlights: [
      "Led migration from monolith to microservices, reducing API latency by 40%",
      "Mentored team of 4 engineers and drove adoption of TypeScript across 12 services",
      "Designed event-driven architecture processing 3M+ events/day",
    ],
    stack: ["Next.js", "Go", "Kafka", "PostgreSQL"],
  },
  {
    title: "Software Engineer",
    company: "Beta Inc",
    period: "2020 – 2022",
    highlights: [
      "Built real-time analytics dashboard serving 50k+ concurrent users",
      "Reduced build times by 60% by rearchitecting CI/CD pipeline",
    ],
    stack: ["React", "Node.js", "Redis", "AWS"],
  },
  {
    title: "Junior Developer",
    company: "Gamma Studio",
    period: "2019 – 2020",
    highlights: [
      "Shipped 3 client-facing web apps from design to production",
      "Integrated third-party APIs including Stripe, Twilio, and Mapbox",
    ],
    stack: ["React", "Django", "PostgreSQL"],
  },
];

const projects = [
  {
    name: "OpenMetrics",
    description:
      "Open-source observability platform for distributed systems. Self-hostable alternative to Datadog with sub-second query performance.",
    stack: ["Next.js", "Go", "ClickHouse", "Docker"],
    stars: "1.2k",
    href: "https://github.com",
    live: "https://openmetrics.dev",
  },
  {
    name: "Taskflow",
    description:
      "AI-powered project management tool that auto-prioritizes your backlog based on team velocity and deadlines.",
    stack: ["React", "FastAPI", "OpenAI API", "Supabase"],
    stars: "340",
    href: "https://github.com",
    live: "https://taskflow.app",
  },
];

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
      <div className="fixed top-4 right-4 z-50">
        <DeferredThemeToggle />
      </div>
      <div
        className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-10 2xl:px-16"
        style={{ zIndex: 1 }}
      >
        <main id="main-content" className="mx-auto max-w-7xl">
          {/* 12-column bento grid */}
          <div className="grid grid-cols-12 gap-4 md:gap-5">

            {/* ── Hero ──────────────────────── col 1–8 */}
            <Card className="col-span-12 md:col-span-8">
              <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-primary-foreground ring-[3px] ring-primary/30 ring-offset-2 ring-offset-transparent">
                  JN
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight leading-none text-foreground sm:text-5xl">
                      Jesse Neff
                    </h1>
                    <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-primary">
                      Full Stack Engineer · San Francisco, CA
                    </p>
                  </div>
                  <p className="text-sm/relaxed text-muted-foreground max-w-prose">
                    I build fast, reliable web applications with a focus on
                    developer experience and scalable architecture. 5+ years
                    shipping products across fintech, developer tooling, and
                    SaaS.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button asChild size="sm" variant="default">
                      <a href="mailto:jesseneff@me.com">Email me</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href="https://github.com/mercerius"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href="https://linkedin.com/in/jesse-neff"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <a
                        href="/resume.pdf"
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

            {/* ── Status ────────────────────── col 9–12 */}
            <Card className="col-span-12 md:col-span-4">
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
                    Open to opportunities
                  </span>
                </div>
                <Separator />
                <dl className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="font-medium">Full-time · Contract</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium">Remote · SF Bay Area</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Notice</dt>
                    <dd className="font-medium">2 weeks</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* ── Skills ────────────────────── col 1–4 */}
            <Card className="col-span-12 md:col-span-4">
              <CardHeader>
                <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-1.5">
                    <span className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground/60">
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

            {/* ── Projects ──────────────────── col 5–8, 9–12 */}
            {projects.map((project) => (
              <Card
                key={project.name}
                className="col-span-12 sm:col-span-6 md:col-span-4 flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-black tracking-tight text-foreground">
                      {project.name}
                    </CardTitle>
                    <Badge variant="outline" className="font-mono shrink-0">
                      ★ {project.stars}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1">
                    {project.stack.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="xs" variant="outline">
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source
                      </a>
                    </Button>
                    <Button asChild size="xs" variant="ghost">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live ↗
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* ── Experience ────────────────── col 1–8 */}
            <Card className="col-span-12 md:col-span-8">
              <CardHeader>
                <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Experience
                </CardTitle>
                <CardDescription>5 years · 3 companies</CardDescription>
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

            {/* ── Education ─────────────────── col 9–12 */}
            <Card className="col-span-12 md:col-span-4">
              <CardHeader>
                <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-bold tracking-tight text-foreground">
                    B.S. Computer Science
                  </p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground">
                    University of California, Berkeley
                  </p>
                  <Badge variant="outline" className="w-fit font-mono">
                    Class of 2019
                  </Badge>
                </div>
                <Separator />
                <div className="flex flex-col gap-1.5 text-xs">
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    Certifications
                  </p>
                  <p className="text-muted-foreground">
                    AWS Solutions Architect — Associate
                  </p>
                  <p className="text-muted-foreground">
                    Google Cloud Professional Developer
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ── Currently exploring ───────── full width */}
            <Card className="col-span-12">
              <CardHeader>
                <CardTitle className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Currently exploring
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                {[
                  { topic: "Rust for systems programming", progress: 60 },
                  { topic: "WebAssembly in the browser", progress: 40 },
                  { topic: "LLM fine-tuning & RAG pipelines", progress: 75 },
                ].map(({ topic, progress }) => (
                  <div key={topic} className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {topic}
                      </span>
                      <span className="font-mono text-[0.6rem] tabular-nums text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-[3px] w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          <footer className="mt-8 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground/50">
            Last updated May 2026 · Built with Next.js
          </footer>
        </main>
      </div>
    </>
  );
}
