# My Portfolio App

This repo contains my portfolio site, built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

The site is meant to do two jobs well:

- introduce me to recruiters, hiring managers, and other engineers
- show how I build frontends with deliberate architecture, solid UI work, and real interactive features

Instead of treating the portfolio like a static page, I built it as a working product. It includes URL-addressable project modals, a custom GLSL shader background rendered with raw WebGL, dark and light themes, and a live slot machine demo that talks to a real API through Next.js Server Actions.

## Technical Highlights

- Next.js 16 App Router with Server Components as the default rendering model
- React 19 with small client islands for interactive UI only where needed
- Tailwind CSS v4 tokens and shadcn/ui components for consistent styling
- Custom WebGL background using raw GLSL `.vert` and `.frag` shader files
- Parallel routes and interception for shareable project detail modals
- Framer Motion for transitions and interaction polish
- Slot machine demo with animated reels, balance tracking, and spin history

## Project Structure

```text
app/          App Router pages, layouts, routes, and server actions
components/   Custom UI components and shadcn/ui primitives
lib/          Portfolio data, utilities, and GLSL shader source files
public/       Static assets such as icons and resume files
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Other useful commands:

```bash
npm run lint
npm run build
npm run format
```

## Why I Built It This Way

I wanted the portfolio to feel like a concise introduction to how I work. The design is meant to be visually distinct without getting in the way of the content. The code is structured to show that I can make intentional decisions about rendering boundaries, interactivity, performance, and maintainability.
