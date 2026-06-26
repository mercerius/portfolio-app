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
  href: string;
  live: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  gpa: number;
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
  bio: "I build reliable products across web, serverless APIs, and embedded systems with a focus on clean architecture and practical DX.",
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
  Languages: [
    "TypeScript",
    "JavaScript",
    "Python",
    "Go",
    "C",
    "ARM Assembly",
    "SQL",
    "Bash",
  ],
  Frontend: [
    "React",
    "Next.js",
    "Tailwind CSS",
    "Framer Motion",
    "Chrome Extensions (MV3)",
  ],
  Backend: [
    "Node.js",
    "FastAPI",
    "Vercel Functions",
    "Express",
    "PostgreSQL",
    "GraphQL",
  ],
  DevOps: ["Docker", "AWS", "GitHub Actions", "Terraform", "Kubernetes"],
  Testing: ["Jest", "Vitest", "Playwright"],
};

export const experience: ExperienceEntry[] = [
  {
    title: "Senior Software Engineer",
    company: "Acme Corp",
    period: "2022 - Present",
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
    period: "2020 - 2022",
    highlights: [
      "Built real-time analytics dashboard serving 50k+ concurrent users",
      "Reduced build times by 60% by rearchitecting CI/CD pipeline",
    ],
    stack: ["React", "Node.js", "AWS", "Vercel"],
  },
  {
    title: "Junior Developer",
    company: "Gamma Studio",
    period: "2019 - 2020",
    highlights: [
      "Shipped 3 client-facing web apps from design to production",
      "Integrated third-party APIs including Stripe, Twilio, and Mapbox",
    ],
    stack: ["React", "Django", "PostgreSQL"],
  },
];

export const projects: Project[] = [
  {
    name: "yet-another-image-converter",
    description:
      "Chrome Extension (Manifest V3) that adds a right-click image conversion flow (JPEG, PNG, WebP, AVIF, BMP, ICO) with tested offscreen conversion pipelines.",
    stack: [
      "JavaScript",
      "Chrome Extensions (MV3)",
      "Canvas API",
      "Playwright",
      "Vitest",
    ],
    href: "https://github.com/mercerius/yet-another-image-converter",
    live: "",
  },
  {
    name: "slot_machine_api",
    description:
      "TypeScript slot machine API architected for Vercel Serverless Functions with tested core game logic, local adapters, and deployment workflows.",
    stack: ["TypeScript", "Vercel Functions", "Express", "Jest", "pnpm"],
    href: "https://github.com/mercerius/slot_machine_api",
    live: "",
  },
  {
    name: "arm-assembly-robot-follower",
    description:
      "Raspberry Pi leader-follower robot implemented in ARM assembly with C hardware drivers, using custom ultrasonic sensor algorithms.",
    stack: ["ARM Assembly", "C", "Raspberry Pi", "wiringPi", "PCA9685"],
    href: "https://github.com/mercerius/arm-assembly-robot-follower",
    live: "",
  },
];

export const education: EducationEntry = {
  degree: "A.S. Computer Science",
  institution: "Palomar College, San Marcos, CA",
  year: "Class of 2026",
  gpa: 4.0,
  certifications: [
    "Google Cybersecurity Professional Certificate",
    "AWS Cloud Practitioner (In Progress)",
  ],
};

export const exploring: ExploringEntry[] = [
  { topic: "Embedded robotics control loops", progress: 78 },
  { topic: "Chrome Extension APIs (MV3)", progress: 84 },
  { topic: "Serverless API hardening on Vercel", progress: 80 },
];

export const footer = {
  lastUpdated: "June 2026",
  builtWith: "Next.js",
};
