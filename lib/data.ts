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
  bio: "I'm a software engineering student building TypeScript applications across web, APIs, and embedded systems. Through coursework and personal projects, I am developing a practical approach to debugging, clear communication, and reliable delivery.",
  email: "hello@jesseneff.com",
  links: {
    github: "https://github.com/mercerius",
    linkedin: "https://linkedin.com/in/jesse-neff",
    resume: "/resume.pdf",
  },
};

export const status: StatusInfo = {
  available: true,
  label: "Open to software engineering opportunities",
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
    "I am building my software foundation through computer science study and hands-on projects. Each project is an opportunity to learn a new system, weigh trade-offs, and turn unfamiliar requirements into dependable software.",
  narrative:
    "My studies at Palomar College and WGU have given me a growing foundation in software engineering, systems, and problem solving. I reinforce that learning by building projects across browser extensions, APIs, embedded systems, and graphics. From writing ARM assembly for a Raspberry Pi robot to designing a TypeScript API and testing a Chrome extension in a real browser, I enjoy getting close to a problem, understanding its constraints, and building software that is clear, maintainable, and dependable for the people using it.",
  strengths: [
    {
      title: "Clear communication",
      description:
        "Coursework and self-directed projects have taught me to make my reasoning visible: explain trade-offs, document decisions, and write code that another developer can follow. I bring that habit to collaboration and debugging.",
    },
    {
      title: "Reliable execution",
      description:
        "Building projects from idea through testing has taught me to break work into small, verifiable steps. I value careful implementation, useful tests, and attention to the details that make software dependable.",
    },
    {
      title: "Technical troubleshooting",
      description:
        "Projects such as a Raspberry Pi leader-follower robot and a WebGL portfolio have made troubleshooting a core part of my learning. I enjoy tracing behavior across hardware, browser APIs, and application code to find the real cause of a problem.",
    },
    {
      title: "Operational ownership",
      description:
        "Personal projects have made me comfortable owning a problem end to end: learning the constraints, choosing an approach, iterating from feedback, and finishing with a working, tested result. I also know when to seek feedback before going further.",
    },
  ],
};

export const projects: Project[] = [
  {
    name: "yet-another-image-converter",
    slug: "yet-another-image-converter",
    description:
      "A Chrome Extension for Manifest V3 that adds right-click image conversion for six formats using an offscreen pipeline and tested browser flows.",
    longDescription:
      "I built this Chrome Extension around Manifest V3's constraints instead of fighting them. Right-clicking an image opens a conversion menu for JPEG, PNG, WebP, AVIF, BMP, and ICO, while the actual conversion runs in a sandboxed offscreen document through the Canvas API. That keeps the service worker lean, fits MV3's lifecycle rules, and makes the architecture easier to reason about. Playwright covers the real browser interaction flow, and Vitest covers the conversion logic in isolation.",
    highlights: [
      "Offscreen document architecture keeps image conversion out of the service worker",
      "Six output formats via the Canvas API, with quality controls for lossy formats",
      "Playwright E2E tests exercise the extension in a real browser environment",
      "Vitest unit tests cover the core conversion pipeline with canvas stubs",
      "Context menu is scoped to image elements only, keeping the UI focused",
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
      "A TypeScript slot machine API for Vercel with tested game logic, clean separation of concerns, and spin data persisted to Supabase PostgreSQL.",
    longDescription:
      "This project started as a game, but I treated it like a backend system. The TypeScript engine that handles reel spinning, symbol weighting, payout calculation, and session state is decoupled from the HTTP layer so it can be tested on its own. Each spin is written to Supabase PostgreSQL with IP hashing for privacy, using a best-effort write and a 3-second timeout so a slow database call never holds up the API response. Generated TypeScript types from the schema keep the data layer honest, and a local adapter mirrors the Vercel Functions interface so development and CI can run without cloud dependencies. Jest covers unit, integration, and edge-case scenarios throughout the stack.",
    highlights: [
      "Pure-function game engine is separated from the HTTP transport layer",
      "Supabase PostgreSQL stores each spin with match type, payout, and hashed IP",
      "Generated database types from the Supabase schema maintain end-to-end type safety",
      "Best-effort write with a 3-second timeout prevents database latency from blocking responses",
      "Local function adapter enables development and CI without cloud dependencies",
      "Jest covers win logic, edge payouts, and session boundary behavior",
      "Weighted reel system and configurable paytable make the game logic easy to tune",
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
      "A Raspberry Pi leader-follower robot built mostly in ARM assembly, with C used only for hardware setup and driver access.",
    longDescription:
      "I built this as a two-robot leader-follower system running on Raspberry Pi hardware, with nearly all of the control logic written in ARM assembly. The leader robot broadcasts its position through a custom ultrasonic ranging protocol, and the follower uses those readings to calculate steering corrections and drive its motors in real time. C only exists as a thin hardware shim for wiringPi GPIO setup and the PCA9685 PWM driver. Everything else, including timing loops and sensor math, lives in hand-written assembly. It was an embedded systems project, but it also became an exercise in working close to the hardware and understanding every trade-off the system made.",
    highlights: [
      "Leader-follower distance tracking uses a custom ultrasonic ranging protocol in ARM assembly",
      "PCA9685 I2C PWM driver provides precise motor speed control",
      "Minimal C shim handles hardware setup while keeping runtime logic in assembly",
      "Real-time control loop relies on assembly delay routines for microsecond-level timing",
      "Steering corrections are derived from sensor differentials without floating-point hardware",
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
      "This portfolio is a Next.js 16 and React 19 app with a hand-written WebGL shader, interactive project views, and a live demo backed by a real API.",
    longDescription:
      "I built this site in Next.js 16 App Router and React 19, keeping Server Components as the default and using client-side interactivity only where it adds something real. The background is a custom WebGL shader written in GLSL and imported directly through Turbopack for `.vert` and `.frag` source files. The rest of the experience is designed to show both product thinking and technical range: a responsive bento layout, parallel-route project modals with shareable URLs, dark and light themes with OKLCH color tokens, and a slot machine demo that talks to the live slot_machine_api through Next.js Server Actions. It is a portfolio, but it is also one more project where I could make deliberate choices about rendering boundaries, interaction design, and performance trade-offs.",
    highlights: [
      "Custom GLSL oil-slick shader is rendered with raw WebGL, without adding Three.js",
      "Next.js parallel routes and interception power URL-addressable project modals",
      "Server Components stay the default, with client islands scoped to interactive UI",
      "Responsive bento grid includes per-card 3D tilt driven by pointer position",
      "Framer Motion shared layout animations connect the grid to expanded project views",
      "OKLCH color tokens support consistent dark and light theme behavior",
      "Turbopack imports `.vert` and `.frag` shader files as raw strings",
      "Slot machine frontend includes animated reels, pay table, balance tracking, and spin history through Server Actions",
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
  certifications: [
    "Certificate of Achievement, Computer Science — Palomar College",
  ],
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
