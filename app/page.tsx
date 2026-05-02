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
import OilShaderBackground from "@/components/oil-shader-background";

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
      <OilShaderBackground />
      <div
        className="relative min-h-screen px-4 py-10 sm:px-6 lg:px-8"
        style={{ zIndex: 1 }}
      >
        <main className="mx-auto max-w-5xl">
          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* ── Hero ─────────────────────────────── col-span-2 */}
            <Card className="md:col-span-2">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {/* Avatar */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground ring-2 ring-primary/20">
                  AR
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <h1 className="text-base font-semibold tracking-tight text-foreground">
                      Jesse Neff
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Full Stack Engineer · San Francisco, CA
                    </p>
                  </div>
                  <p className="text-xs/relaxed text-muted-foreground max-w-prose">
                    I build fast, reliable web applications with a focus on
                    developer experience and scalable architecture. 5+ years
                    shipping products across fintech, developer tooling, and
                    SaaS.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button asChild size="sm" variant="default">
                      <a href="mailto:alex@example.com">Email me</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href="https://linkedin.com"
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

            {/* ── Availability ─────────────────────── col-span-1 */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Open to opportunities
                  </span>
                </div>
                <Separator />
                <dl className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd>Full-time · Contract</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd>Remote · SF Bay Area</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Notice</dt>
                    <dd>2 weeks</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* ── Skills ───────────────────────────── col-span-1 */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-1.5">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
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

            {/* ── Experience ───────────────────────── col-span-2 */}
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Experience</CardTitle>
                <CardDescription>5 years · 3 companies</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {experience.map((role, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="mb-5" />}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {role.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {role.company}
                          </p>
                        </div>
                        <Badge variant="outline">{role.period}</Badge>
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

            {/* ── Project 1 ────────────────────────── col-span-1 */}
            {projects.map((project) => (
              <Card
                key={project.name}
                className="flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant="outline">★ {project.stars}</Badge>
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

            {/* ── Education ────────────────────────── col-span-1 */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-foreground">
                    B.S. Computer Science
                  </p>
                  <p className="text-xs text-muted-foreground">
                    University of California, Berkeley
                  </p>
                  <Badge variant="outline">Class of 2019</Badge>
                </div>
                <Separator />
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Certifications</p>
                  <p>AWS Solutions Architect - Associate</p>
                  <p>Google Cloud Professional Developer</p>
                </div>
              </CardContent>
            </Card>

            {/* ── Currently learning ───────────────── col-span-1 */}
            <Card>
              <CardHeader>
                <CardTitle>Currently exploring</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {[
                  { topic: "Rust for systems programming", progress: 60 },
                  { topic: "WebAssembly in the browser", progress: 40 },
                  { topic: "LLM fine-tuning & RAG pipelines", progress: 75 },
                ].map(({ topic, progress }) => (
                  <div key={topic} className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {topic}
                      </span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-[0.65rem] text-muted-foreground">
            Last updated May 2026 · Built with Next.js
          </p>
        </main>
      </div>
    </>
  );
}
