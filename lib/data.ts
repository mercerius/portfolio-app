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
  narrative: string;
  strengths: BackgroundStrength[];
}

export interface Project {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  highlights: string[];
  year: number;
  status: "complete" | "wip" | "archived";
  stack: string[];
  href: string;
  live: string;
  liveLabel?: string;
  livePreviewMode?: "api-json";
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
  email: "hello@jesseneff.com",
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
  "Systems & Low-Level": [
    "C",
    "ARM Assembly",
    "Go",
    "Python",
    "Bash",
    "SQL",
    "GLSL",
  ],
  "Web & UI": [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "WebGL",
    "Framer Motion",
    "Chrome Extensions (MV3)",
  ],
  "Backend & APIs": ["Node.js", "PostgreSQL", "GraphQL", "Vercel Functions"],
  "Platform & DevOps": ["Docker", "AWS", "GitHub Actions", "Kubernetes"],
  Testing: ["Jest", "Vitest", "Playwright"],
};

export const background: BackgroundInfo = {
  title: "About Me",
  description:
    "I am following my passion for software engineering, combining customer-facing experience with technical expertise.",
  narrative:
    "After years working in high-pressure customer operations, I learned how to stay accurate, communicate clearly, and keep operations steady when the pressure is high and people are counting on you. That discipline carried into technical roles like commercial installation and administrative support, where I managed TCP/IP networking, routing, and SQL-backed workflows. Now, I bring that same grit and problem-solving mindset into software engineering by pairing my formal computer science education with hands-on projects in TypeScript, APIs, testing, and systems-oriented development. I aspire to be a part of a team that collaborates to ship reliable, impactful software.",
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
        "Hands-on experience with networking, routing, low-voltage systems, and diagnosing hardware integration issues.",
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
    slug: "yet-another-image-converter",
    description:
      "Chrome Extension (Manifest V3) that adds a right-click image conversion flow (JPEG, PNG, WebP, AVIF, BMP, ICO) with tested offscreen conversion pipelines.",
    longDescription:
      "A Chrome Extension built on Manifest V3 that integrates directly into the browser's context menu. Right-clicking any image surfaces a conversion submenu supporting six formats: JPEG, PNG, WebP, AVIF, BMP, and ICO. The conversion pipeline runs in a sandboxed offscreen document using the Canvas API, keeping the service worker lean and within MV3's strict lifecycle constraints. End-to-end tests written in Playwright validate the full browser interaction flow, while Vitest covers the core conversion logic in isolation.",
    highlights: [
      "MV3-compliant offscreen document architecture — conversion never blocks the service worker",
      "Six output formats via Canvas API with quality controls for lossy formats",
      "Playwright E2E test suite exercising the real browser extension environment",
      "Vitest unit tests for conversion logic with mock canvas stubs",
      "Context menu dynamically scoped to image elements only",
    ],
    year: 2026,
    status: "complete",
    stack: [
      "JavaScript",
      "Chrome Extensions (MV3)",
      "Canvas API",
      "Playwright",
      "Vitest",
    ],
    href: "https://github.com/mercerius/yet-another-image-converter",
    live: "https://chromewebstore.google.com/detail/yet-another-image-convert/iicohcoejejkjenpdjgfnkcdlodjoafl",
    liveLabel: "View in Chrome Web Store",
  },
  {
    name: "slot_machine_api",
    slug: "slot-machine-api",
    description:
      "TypeScript slot machine API architected for Vercel Serverless Functions with Supabase PostgreSQL spin persistence, tested core game logic, and a live interactive frontend demo.",
    longDescription:
      "A production-ready slot machine engine built as a TypeScript API targeting Vercel Serverless Functions. The core game logic — reel spinning, symbol weighting, payout calculation, and session state — is fully decoupled from the HTTP layer, making it independently testable. Every spin is persisted to a Supabase PostgreSQL table with IP hashing for privacy, written as a best-effort fire-and-forget so the database write never blocks the API response. Generated TypeScript types from the Supabase schema keep the data layer fully type-safe. A local adapter mirrors the Vercel Functions interface so development and CI run without any cloud dependency. Jest covers unit, integration, and edge-case scenarios. The project demonstrates clean architecture boundaries and a CI/CD workflow tuned for serverless deployment constraints.",
    highlights: [
      "Pure-function game engine fully decoupled from HTTP transport layer",
      "Supabase PostgreSQL persistence — every spin recorded with match type, payout, and hashed IP",
      "Generated database types via Supabase CLI for end-to-end type safety",
      "Best-effort DB write with 3 s timeout — slow writes never delay the API response",
      "Local function adapter for zero-cloud development and CI runs",
      "Jest test suite covering win logic, edge payouts, and session boundaries",
      "Weighted reel symbol system with configurable paytable",
    ],
    year: 2025,
    status: "complete",
    stack: [
      "TypeScript",
      "Vercel Functions",
      "Supabase",
      "PostgreSQL",
      "Jest",
      "pnpm",
    ],
    href: "https://github.com/mercerius/slot_machine_api",
    live: "/demos/slot-machine",
    livePreviewMode: "api-json",
  },
  {
    name: "arm-assembly-robot-follower",
    slug: "arm-assembly-robot-follower",
    description:
      "Raspberry Pi leader-follower robot implemented in ARM assembly with C hardware drivers, using custom ultrasonic sensor algorithms.",
    longDescription:
      "A two-robot leader-follower system written almost entirely in ARM assembly, running on Raspberry Pi hardware. The leader robot broadcasts its position via a custom ultrasonic ranging protocol; the follower robot uses the sensor readings to compute a steering correction and drive its motors in real time. C is used only as a thin hardware shim — initializing the wiringPi GPIO library and the PCA9685 PWM driver IC — while all control logic, timing loops, and sensor math live in hand-written assembly. The project was built for an embedded systems course and pushed the limits of what's achievable without an RTOS or higher-level abstractions.",
    highlights: [
      "Leader-follower distance tracking with custom ultrasonic ranging in pure ARM assembly",
      "PCA9685 I²C PWM driver for precise motor speed control",
      "wiringPi GPIO abstraction bridged via a minimal C shim — no runtime overhead",
      "Real-time control loop with microsecond-level timing via assembly delay routines",
      "Steering algorithm derived from sensor differential without floating-point hardware",
    ],
    year: 2024,
    status: "complete",
    stack: ["ARM Assembly", "C", "Raspberry Pi", "wiringPi", "PCA9685"],
    href: "https://github.com/mercerius/arm-assembly-robot-follower",
    live: "",
  },
  {
    name: "portfolio-app",
    slug: "portfolio-app",
    description:
      "This portfolio — built with Next.js 16, React 19, and a custom WebGL/GLSL oil-slick shader background. Bento-grid layout, dark-mode theming, Framer Motion animated project cards, and a fully interactive slot machine demo backed by a live Supabase-connected API.",
    longDescription:
      "This site — the one you're on right now. Built with Next.js 16 App Router and React 19, it uses a Server-Components-first architecture where only interactive islands opt into client rendering. The background is a real-time WebGL shader written in GLSL that simulates an oil-slick iridescence effect, driven by a custom Turbopack raw-loader for `.vert`/`.frag` imports. The layout is a 12-column responsive bento grid with staggered entrance animations, 3D tilt effects on pointer devices, and a parallel-route modal system so each project card has a shareable URL. Theming is handled by `next-themes` with OKLCH color tokens for perceptually uniform dark/light palettes. The site also hosts a fully featured slot machine demo that proxies to the live slot_machine_api via Next.js Server Actions — complete with animated reels, a configurable pay table, balance tracking, and a spin history log.",
    highlights: [
      "Custom GLSL oil-slick shader rendered via raw WebGL — no Three.js dependency",
      "Next.js parallel routes + route interception for URL-addressable project modals",
      "Server Components first — client islands scoped to interactive UI only",
      "12-column bento grid with per-card 3D tilt driven by mouse position",
      "Framer Motion shared layout animations connecting grid cards to expanded modals",
      "OKLCH color system for perceptually uniform dark/light theming",
      "Turbopack raw-loader for importing `.vert`/`.frag` shader sources as strings",
      "Full slot machine frontend with animated reels, pay table, balance tracking, and spin history — powered by Server Actions proxying to the live API",
    ],
    year: 2026,
    status: "wip",
    stack: [
      "Next.js",
      "TypeScript",
      "React",
      "WebGL",
      "GLSL",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
    ],
    href: "",
    live: "/",
  },
];

export const education: EducationEntry = {
  degree: "A.S. Computer Science",
  institution: "Palomar College, San Marcos, CA",
  year: "Class of 2026",
  gpa: 4.0,
  certifications: [],
};

export const exploring: ExploringEntry[] = [
  { topic: "AI", progress: 22 },
  { topic: "Graphics programming", progress: 33 },
  { topic: "Serverless and Cloud infrastructure", progress: 54 },
];

export const footer = {
  lastUpdated: "July 2026",
  builtWith: "Next.js",
};
