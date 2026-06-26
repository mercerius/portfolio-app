<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Project Guidelines

## Overview

Jesse Neff's portfolio — a Next.js 16 App Router SPA deployed on **Vercel** (SSR-capable). Server Components, Server Actions, and API routes are all supported.

## Stack

| Layer              | Technology                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| Framework          | Next.js 16.2 / React 19 — **App Router only** (no `pages/`)             |
| Language           | TypeScript 5 — strict mode                                              |
| Styling            | Tailwind CSS v4 + `tw-animate-css`                                      |
| UI Components      | shadcn/ui + Radix UI                                                    |
| Class utilities    | `cn()` from `@/lib/utils` (clsx + tailwind-merge)                       |
| Component variants | `class-variance-authority` (CVA)                                        |
| Theming            | `next-themes` — dark mode default                                       |
| Icons              | `lucide-react`                                                          |
| Fonts              | Geist (sans), Geist Mono, JetBrains Mono via `next/font/google`         |
| Shaders            | GLSL `.vert`/`.frag` imported as raw strings via Turbopack `raw-loader` |

## Architecture

```
app/              # Next.js App Router — layouts, pages, global CSS
components/       # Project components
  ui/             # shadcn/ui primitives (generated — prefer CLI over manual edits)
lib/
  utils.ts        # cn() utility
  shaders/        # GLSL source files (.vert, .frag)
public/           # Static assets
```

## Conventions

### Components

- Add `"use client"` at the top of any component that uses hooks, event handlers, or browser APIs
- New shadcn/ui primitives → `components/ui/`; custom components → `components/`
- Use `cn()` for **all** dynamic className merging — never string concatenation
- Default theme is `dark`; always verify dark mode appearance when adding new UI

### Styling

- **Tailwind v4** — tokens are defined with the `@theme` directive in `app/globals.css`, not in a config file. Do not create `tailwind.config.*`
- Follow mobile-first responsive breakpoints: `sm:` (640px) → `md:` (768px) → `lg:` (1024px)
- Use CSS custom properties (`--color-*`, `--radius-*`) for semantic values; these are mapped in `@theme`

### TypeScript

- Strict mode is on — no implicit `any`, all component props must be typed
- Use the `@/` path alias (resolves to workspace root) for all project imports
- Prefer explicit return types on exported functions

### Shaders

- GLSL source lives in `lib/shaders/` — do not inline shader strings in TypeScript files
- Import shader files at the top of the component file as: `import frag from "@/lib/shaders/oil-shader.frag"`

### Vercel Deployment

- Vercel supports SSR — Server Components and Server Actions are valid
- Avoid hardcoding environment-specific values; use `process.env.*` with `NEXT_PUBLIC_` prefix for client-accessible config
- Do not commit secrets; use Vercel environment variable configuration for sensitive values

## Build & Lint

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```
