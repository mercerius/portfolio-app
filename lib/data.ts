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
  published?: boolean;
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
  bio: "Software engineer with a background in casino operations and enterprise networking — and a computer science degree earned while working full-time. I build TypeScript applications across web, APIs, and embedded systems, with the same precision I developed handling real-money transactions under pressure.",
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
    "My path to software ran through a casino floor, enterprise networking installations, and two computer science degrees earned while working full-time. Here's what that built.",
  narrative:
    "Dealing cards at Harrah's for the past several years built something you can't get from a textbook: the discipline to manage real-money transactions, strict compliance protocols, and complex procedures with zero tolerance for error — all while keeping it understandable for anyone across the table. That discipline carried into technical work: enterprise TCP/IP networking and security installation at Protection One, SQL-based CRM and reporting tools at MacKnight Food Group. Now I'm backing that experience with an A.S. in Computer Science (Palomar, 4.0) and a B.S. in Software Engineering in progress at WGU. What drives me is the same thing it always has been: building something that actually works, and understanding why.",
  strengths: [
    {
      title: "User empathy",
      description:
        "On a casino floor, you explain the same complex rules to a first-timer and a high-roller in the same shift. That range — and the need to get it right every time — built a real instinct for reading people and meeting them where they are.",
    },
    {
      title: "Accuracy under pressure",
      description:
        "Six years managing real-money transactions under casino cameras and compliance protocols set a specific standard: 100% accuracy, under pressure, every shift. That baseline carries into every system I build.",
    },
    {
      title: "Technical troubleshooting",
      description:
        "At Protection One, I installed and provisioned enterprise TCP/IP networking and physical security systems for commercial clients — and tracked down hardware problems in the field the hard way, without a clean answer waiting.",
    },
    {
      title: "Operational ownership",
      description:
        "I built SQL-based CRM and reporting tools at MacKnight with minimal direction — that kind of ownership transfers. Fast to get productive, comfortable being the one who figures it out, and I know when to pull others in.",
    },
  ],
};

export const projects: Project[] = [
  {
    name: "yet-another-image-converter",
    slug: "yet-another-image-converter",
    description:
      "A Chrome Extension (MV3) that adds right-click image conversion for six formats — JPEG, PNG, WebP, AVIF, BMP, and ICO — using a sandboxed offscreen pipeline with Playwright E2E tests.",
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
    published: true,
  },
  {
    name: "slot_machine_api",
    slug: "slot-machine-api",
    description:
      "A TypeScript slot machine API built for Vercel Serverless, with every spin persisted to Supabase PostgreSQL. Fully tested game logic, clean architecture, and a live interactive demo.",
    longDescription:
      "A production-ready slot machine engine built as a TypeScript API for Vercel Serverless Functions. The core game logic — reel spinning, symbol weighting, payout calculation, and session state — is fully decoupled from the HTTP layer, making it independently testable. Every spin is persisted to a Supabase PostgreSQL table with IP hashing for privacy, using a non-blocking write with a 3-second timeout so a slow database call never delays the API response. Generated TypeScript types from the Supabase schema keep the data layer end-to-end type-safe. A local adapter mirrors the Vercel Functions interface so development and CI run without any cloud dependency. Jest covers unit, integration, and edge-case scenarios. The project demonstrates clean architecture and a CI/CD workflow tuned for serverless deployment.",
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
      "The site you're on. Built with Next.js 16, React 19, and a hand-written WebGL/GLSL oil-slick shader — with a bento grid, dark mode, Framer Motion animations, and a live slot machine demo wired to a real API.",
    longDescription:
      "This site — the one you're on right now. Built with Next.js 16 App Router and React 19, using React Server Components throughout and opting into client rendering only where there's genuine interactivity. The background is a real-time WebGL shader written in GLSL that simulates an oil-slick iridescence effect, loaded via a custom Turbopack raw-loader for `.vert`/`.frag` imports. The layout is a 12-column responsive bento grid with staggered entrance animations, 3D tilt effects on pointer devices, and a parallel-route modal system so each project card has a shareable URL. Theming is handled by `next-themes` with OKLCH color tokens for perceptually uniform dark/light palettes. The site also hosts a fully featured slot machine demo that proxies to the live slot_machine_api via Next.js Server Actions — complete with animated reels, a configurable pay table, balance tracking, and a spin history log.",
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
    href: "https://github.com/mercerius/portfolio-app",
    live: "/",
    published: true,
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
