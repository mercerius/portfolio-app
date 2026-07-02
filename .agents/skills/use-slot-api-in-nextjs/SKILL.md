---
name: use-slot-api-in-nextjs
description: "Integrate the workspace slot machine API into a Next.js App Router frontend. Use when building React Server Actions, components, or forms that call /api/spin or /api/health, handling bets, responses, loading states, and errors."
argument-hint: "What Next.js integration are you building (Server Action, component, or full page)?"
user-invocable: true
---

# Use the Slot Machine API in Next.js

Integrate the workspace's Vercel-hosted slot machine API into a Next.js App Router application.

## When to Use

- Building a React component that lets users spin the slot machine.
- Creating a Next.js Server Action that calls the slot API.
- Handling bet validation, loading states, spin results, and errors.
- Avoiding CORS by keeping the slot API URL on the server.

## API Reference

Base URL is the deployed Vercel URL (e.g. `https://your-project.vercel.app`) or `http://localhost:3000` when running `pnpm dev:vercel`.

| Method    | Endpoint      | Body                | Response                              |
| --------- | ------------- | ------------------- | ------------------------------------- |
| `GET`     | `/api/health` | —                   | `{ status: "ok", timestamp: string }` |
| `POST`    | `/api/spin`   | `{ "bet": number }` | `SlotMachineResult`                   |
| `OPTIONS` | `/api/spin`   | —                   | CORS preflight                        |

### `SlotMachineResult`

```ts
interface SlotMachineResult {
  reels: string[]; // e.g. ["🍒", "🍋", "🍊"]
  isWin: boolean;
  winAmount: number;
  combination: string | undefined;
  timestamp: string; // ISO 8601
  spinId: string; // e.g. "spin_1234567890_abc123"
}
```

### Bet Rules

- Default bet is `1` if omitted.
- Bet must be a positive finite number.
- Maximum bet is controlled by the API via `MAX_BET_AMOUNT` (default `100`).
- Oversized bets return `400` with `{ error: "Maximum bet amount is ..." }`.

## Procedure

### 1. Configure the API URL server-side

Store the slot machine API base URL in a server-side environment variable:

```bash
# .env.local
SLOT_API_URL=https://your-project.vercel.app
```

Do **not** prefix this with `NEXT_PUBLIC_` so it stays on the server.

### 2. Create a Server Action

Create a Server Action that calls `/api/spin`:

```ts
// app/actions/spin.ts
"use server";

export interface SlotMachineResult {
  reels: string[];
  isWin: boolean;
  winAmount: number;
  combination: string | undefined;
  timestamp: string;
  spinId: string;
}

const MAX_BET = 100;

export async function spinSlotMachine(
  prevState: unknown,
  formData: FormData,
): Promise<{ result?: SlotMachineResult; error?: string }> {
  const betRaw = formData.get("bet");
  const bet = Number(betRaw);

  if (!Number.isFinite(bet) || bet <= 0) {
    return { error: "Bet must be a positive number" };
  }

  if (bet > MAX_BET) {
    return { error: `Maximum bet is ${MAX_BET}` };
  }

  const apiUrl = process.env.SLOT_API_URL;
  if (!apiUrl) {
    return { error: "Slot API URL is not configured" };
  }

  try {
    const res = await fetch(`${apiUrl}/api/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bet }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error ?? "Spin failed" };
    }

    return { result: data as SlotMachineResult };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
```

### 3. Build the UI component

Use `useActionState` to manage the Server Action lifecycle:

```tsx
// app/components/SlotMachine.tsx
"use client";

import { useActionState } from "react";
import { spinSlotMachine } from "../actions/spin";

export function SlotMachine() {
  const [state, formAction, isPending] = useActionState(spinSlotMachine, {});

  return (
    <form action={formAction}>
      <label>
        Bet
        <input
          type="number"
          name="bet"
          min={1}
          max={100}
          defaultValue={5}
          disabled={isPending}
        />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? "Spinning..." : "Spin"}
      </button>

      {state.error && <p role="alert">{state.error}</p>}

      {state.result && (
        <div>
          <p>Reels: {state.result.reels.join(" ")}</p>
          <p>
            {state.result.isWin
              ? `You won ${state.result.winAmount}!`
              : "No win"}
          </p>
        </div>
      )}
    </form>
  );
}
```

### 4. Render the component in a page

```tsx
// app/page.tsx
import { SlotMachine } from "./components/SlotMachine";

export default function HomePage() {
  return (
    <main>
      <h1>Slot Machine</h1>
      <SlotMachine />
    </main>
  );
}
```

### 5. Optional: health check

Call `/api/health` from a Server Component or Server Action before the first spin:

```ts
const res = await fetch(`${apiUrl}/api/health`);
const health = await res.json();
// health.status === "ok"
```

## Quality Checks

- [ ] `SLOT_API_URL` is set in `.env.local` (server-side only).
- [ ] Bet is validated on the server before calling the slot API.
- [ ] The Server Action returns a serializable result or error.
- [ ] Loading and error states are handled in the UI.
- [ ] The component is marked `"use client"` because it uses `useActionState`.

## Common Pitfalls

- **CORS**: Because the API URL stays server-side, you avoid CORS entirely. Only use browser `fetch` directly if you also configure `CORS_ORIGINS` on the slot API.
- **Missing `Content-Type`**: The slot API expects JSON; always set `Content-Type: application/json`.
- **Bet type**: Send a number, not a string, for `bet`.
- **Server Action errors**: Return errors in the action result rather than throwing, so `useActionState` can display them.
