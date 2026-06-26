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

export interface BackgroundStrength {
  title: string;
  description: string;
}

export interface BackgroundInfo {
  title: string;
  description: string;
  narrative: string[];
  strengths: BackgroundStrength[];
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
  title: "Software Engineer",
  location: "San Diego, CA",
  bio: "Software engineer with a foundation in networking, technical operations, and customer-facing problem solving. I build practical TypeScript products across web, APIs, and embedded systems with a focus on reliability and clean architecture.",
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
  type: "FT · Contract · Internship",
  location: "Remote · San Diego",
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

export const background: BackgroundInfo = {
  title: "About Me",
  description:
    "I am following my passion for software engineering, combining customer-facing experience with technical expertise.",
  narrative: [
    "After years working in high-pressure customer operations, I learned how to stay accurate, communicate clearly, and keep systems moving when the room is loud and the stakes are real.",
    "That discipline carried into technical roles as a commercial installation technician and administrative support, where I worked with TCP/IP networking, routing, CCTV systems, SQL-backed workflows, and day-to-day operational troubleshooting.",
    "Now I bring that same grit and problem-solving mindset into software engineering through computer science study and hands-on projects in TypeScript, APIs, testing, and systems-oriented development, with the goal of joining a team to ship reliable and impactful software.",
  ],
  strengths: [
    {
      title: "User empathy",
      description:
        "Years of front-line customer-facing work built strong communication, client care, and calm conflict resolution.",
    },
    {
      title: "Accuracy under pressure",
      description:
        "Used to handling high-volume transactions, compliance rules, and fast decisions without losing precision.",
    },
    {
      title: "Technical troubleshooting",
      description:
        "Hands-on experience with networking, routing, CCTV, low-voltage systems, and diagnosing hardware integration issues.",
    },
    {
      title: "Operational ownership",
      description:
        "Comfortable learning new systems quickly, supporting workflows, and being part of a team.",
    },
  ],
};

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
