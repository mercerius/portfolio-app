# My Portfolio App

This is my portfolio site, built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

I built it to give people a quick sense of who I am and how I approach frontend work:

- introduce me to recruiters, hiring managers, and other engineers
- show the kind of interfaces and interactions I like to build

I did not want it to be just a list of projects. There are shareable project modals, a custom WebGL shader background, light and dark themes, and a slot machine demo that calls a real API through Next.js Server Actions.

## Technical Highlights

- Next.js 16 App Router, with Server Components by default
- React 19 client components where the page needs interaction
- Tailwind CSS v4 tokens and shadcn/ui components
- A WebGL background written with raw GLSL `.vert` and `.frag` files
- Parallel and intercepted routes for project detail modals that can be linked directly
- Framer Motion for the modal and UI transitions
- A slot machine demo with animated reels, a running balance, and spin history

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

I wanted the site to have some personality without making people hunt for the useful parts. The visual layer is there to make the work memorable; the pages and project details should still be easy to get through. I also used it as a place to try out things I care about in frontend work, including rendering boundaries, animations, and real interactions instead of static mockups.
