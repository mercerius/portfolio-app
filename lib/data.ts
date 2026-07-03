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
  bio: "I'm a software engineering student who builds TypeScript applications across web, APIs, and embedded systems. Before software, I worked in casino operations and enterprise networking, which taught me how to stay accurate under pressure, explain complex systems clearly, and treat reliability like part of the job.",
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
    "My path into software ran through casino operations, networking installs, and earning computer science degrees while working full-time. It shaped how I solve problems and how I work with people.",
  narrative:
    "Working on a casino floor taught me to be precise, calm, and easy to understand in situations where mistakes actually matter. That carried into technical work too, from installing enterprise TCP/IP networking and physical security systems at Protection One to building SQL-based CRM and reporting tools at MacKnight Food Group. Now I'm pairing that experience with an A.S. in Computer Science from Palomar and a B.S. in Software Engineering in progress at WGU. I'm at my best when I can dig into a problem, weigh the trade-offs, and build something dependable enough that other people can trust it.",
  strengths: [
    {
      title: "User empathy",
      description:
        "Casino work forced me to explain the same complex rules to a first-timer and a high-roller in the same shift. That range built a practical instinct for meeting people where they are and making technical ideas easier to follow.",
    },
    {
      title: "Accuracy under pressure",
      description:
        "Managing real-money transactions under compliance rules and constant scrutiny set a clear baseline for me: be accurate, stay calm, and don't hide from responsibility when the stakes are real.",
    },
    {
      title: "Technical troubleshooting",
      description:
        "At Protection One, I installed and provisioned enterprise TCP/IP networking and physical security systems for commercial clients, then traced field issues without a clean answer waiting. I like that kind of hands-on debugging work.",
    },
    {
      title: "Operational ownership",
      description:
        "At MacKnight, I built SQL-based CRM and reporting tools with minimal direction. That experience made me comfortable owning problems end to end, getting productive quickly, and knowing when collaboration beats solo effort.",
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
