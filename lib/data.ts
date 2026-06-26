// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  name: string;
  initials: string;
  title: string;
  location: string;
  bio: string;
  email: string;
  links: {
    github: string;
    linkedin: string;
    resume: string;
  };
}

export interface StatusInfo {
  available: boolean;
  label: string;
  type: string;
  location: string;
  notice: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  highlights: string[];
  stack: string[];
}

export interface Project {
  name: string;
  description: string;
  stack: string[];
  stars: string;
  href: string;
  live: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  certifications: string[];
}

export interface ExploringEntry {
  topic: string;
  progress: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const personal: PersonalInfo = {
  name: "Jesse Neff",
  initials: "JN",
  title: "Full Stack Engineer",
  location: "San Diego, CA",
  bio: "I build fast, reliable web applications with a focus on developer experience and scalable architecture.",
  email: "jesseneff@me.com",
  links: {
    github: "https://github.com/mercerius",
    linkedin: "https://linkedin.com/in/jesse-neff",
    resume: "/resume.pdf",
  },
};

export const status: StatusInfo = {
  available: true,
  label: "Open to opportunities",
  type: "Full-time · Contract",
  location: "Remote · San Diego, CA",
  notice: "2 weeks",
};

export const skills: Record<string, string[]> = {
  Languages: ["TypeScript", "Python", "Go", "SQL", "Bash"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  Backend: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "GraphQL"],
  DevOps: ["Docker", "AWS", "GitHub Actions", "Terraform", "Kubernetes"],
};

export const experience: ExperienceEntry[] = [
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

export const projects: Project[] = [
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

export const education: EducationEntry = {
  degree: "B.S. Computer Science",
  institution: "University of California, Berkeley",
  year: "Class of 2019",
  certifications: [
    "AWS Solutions Architect — Associate",
    "Google Cloud Professional Developer",
  ],
};

export const exploring: ExploringEntry[] = [
  { topic: "Rust for systems programming", progress: 60 },
  { topic: "WebAssembly in the browser", progress: 40 },
  { topic: "LLM fine-tuning & RAG pipelines", progress: 75 },
];

export const footer = {
  lastUpdated: "May 2026",
  builtWith: "Next.js",
};
