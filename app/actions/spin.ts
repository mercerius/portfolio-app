"use server";

export interface SlotMachineResult {
  reels: string[];
  isWin: boolean;
  winAmount: number;
  combination: string | undefined;
  timestamp: string;
  spinId: string;
}

export interface SpinResponse {
  result?: SlotMachineResult;
  error?: string;
}

export async function spinSlotMachine(bet: number): Promise<SpinResponse> {
  if (!Number.isFinite(bet) || bet <= 0) {
    return { error: "Bet must be a positive number" };
  }
  if (bet > 100) {
    return { error: "Maximum bet is $100" };
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
      cache: "no-store",
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      const errData = data as { error?: string };
      return { error: errData.error ?? `Spin failed (${res.status})` };
    }

    return { result: data as SlotMachineResult };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export interface ApiPreviewResponse {
  status: number;
  statusText: string;
  durationMs: number;
  endpoint: string;
  requestBody: Record<string, unknown>;
  body: Record<string, unknown> | null;
  error?: string;
}

export async function previewSlotSpin(): Promise<ApiPreviewResponse> {
  const apiUrl = process.env.SLOT_API_URL;
  const endpoint = apiUrl
    ? `${apiUrl.replace(/\/$/, "")}/api/spin`
    : "/api/spin";
  const requestBody = { bet: 1 };

  if (!apiUrl) {
    return {
      status: 0,
      statusText: "Error",
      durationMs: 0,
      endpoint,
      requestBody,
      body: null,
      error: "SLOT_API_URL is not configured",
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });
    const durationMs = Date.now() - start;
    const body = (await res.json()) as Record<string, unknown>;
    return {
      status: res.status,
      statusText: res.statusText,
      durationMs,
      endpoint,
      requestBody,
      body,
    };
  } catch (err) {
    return {
      status: 0,
      statusText: "Network Error",
      durationMs: Date.now() - start,
      endpoint,
      requestBody,
      body: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
