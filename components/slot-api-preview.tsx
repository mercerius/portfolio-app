"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { previewSlotSpin, type ApiPreviewResponse } from "@/app/actions/spin";
import { cn } from "@/lib/utils";

// ─── JSON Token Renderer ─────────────────────────────────────────────────────

type Token =
  | { t: "str"; v: string }
  | { t: "num"; v: number }
  | { t: "bool"; v: boolean }
  | { t: "null" }
  | { t: "key"; v: string }
  | { t: "punct"; v: string }
  | { t: "ws"; v: string };

function tokenize(data: unknown, depth = 0): Token[] {
  const pad = "  ".repeat(depth);
  const innerPad = "  ".repeat(depth + 1);
  const out: Token[] = [];

  if (data === null || data === undefined) {
    out.push({ t: "null" });
  } else if (typeof data === "boolean") {
    out.push({ t: "bool", v: data });
  } else if (typeof data === "number") {
    out.push({ t: "num", v: data });
  } else if (typeof data === "string") {
    out.push({ t: "str", v: data });
  } else if (Array.isArray(data)) {
    out.push({ t: "punct", v: "[" });
    (data as unknown[]).forEach((item, i) => {
      out.push({ t: "ws", v: `\n${innerPad}` });
      out.push(...tokenize(item, depth + 1));
      if (i < data.length - 1) out.push({ t: "punct", v: "," });
    });
    if (data.length > 0) out.push({ t: "ws", v: `\n${pad}` });
    out.push({ t: "punct", v: "]" });
  } else if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    out.push({ t: "punct", v: "{" });
    entries.forEach(([k, v], i) => {
      out.push({ t: "ws", v: `\n${innerPad}` });
      out.push({ t: "key", v: k });
      out.push({ t: "punct", v: ": " });
      out.push(...tokenize(v, depth + 1));
      if (i < entries.length - 1) out.push({ t: "punct", v: "," });
    });
    if (entries.length > 0) out.push({ t: "ws", v: `\n${pad}` });
    out.push({ t: "punct", v: "}" });
  }

  return out;
}

function PrettyJson({ data }: { data: unknown }) {
  const tokens = tokenize(data);
  return (
    <pre className="text-xs font-mono leading-5 whitespace-pre-wrap break-all select-text">
      {tokens.map((tok, i) => {
        switch (tok.t) {
          case "str":
            return (
              <span key={i} className="text-emerald-400">
                &quot;{tok.v}&quot;
              </span>
            );
          case "num":
            return (
              <span key={i} className="text-amber-400">
                {tok.v}
              </span>
            );
          case "bool":
            return (
              <span key={i} className="text-purple-400">
                {tok.v ? "true" : "false"}
              </span>
            );
          case "null":
            return (
              <span key={i} className="text-purple-400">
                null
              </span>
            );
          case "key":
            return (
              <span key={i} className="text-blue-400">
                &quot;{tok.v}&quot;
              </span>
            );
          case "punct":
            return (
              <span key={i} className="text-muted-foreground">
                {tok.v}
              </span>
            );
          case "ws":
            return <span key={i}>{tok.v}</span>;
        }
      })}
    </pre>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: number }) {
  const ok = status >= 200 && status < 300;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[0.65rem] font-bold px-1.5 py-0.5 rounded",
        ok
          ? "bg-emerald-400/10 text-emerald-400"
          : status === 0
            ? "bg-muted/40 text-muted-foreground"
            : "bg-red-400/10 text-red-400",
      )}
    >
      <span
        className={cn(
          "inline-block w-1.5 h-1.5 rounded-full",
          ok
            ? "bg-emerald-400"
            : status === 0
              ? "bg-muted-foreground"
              : "bg-red-400",
        )}
      />
      {status === 0 ? "ERR" : status}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function JsonSkeleton() {
  return (
    <div className="space-y-1.5 animate-pulse py-1">
      {[
        { w: "w-2/3" },
        { w: "w-1/2" },
        { w: "w-3/4" },
        { w: "w-2/5" },
        { w: "w-1/2" },
        { w: "w-1/3" },
      ].map(({ w }, i) => (
        <div
          key={i}
          className={cn("h-3 rounded bg-muted/40", w, i > 0 && "ml-4")}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SlotApiPreview() {
  const [response, setResponse] = useState<ApiPreviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinKey, setSpinKey] = useState(0);

  const fetchSpin = useCallback(async () => {
    setLoading(true);
    const result = await previewSlotSpin();
    setResponse(result);
    setLoading(false);
    setSpinKey((k) => k + 1);
  }, []);

  // Auto-fetch on mount. The cleanup flag ensures React Strict Mode's
  // double-invoke discards the first (stale) response and only the
  // second mount's result is committed to state.
  useEffect(() => {
    let cancelled = false;

    previewSlotSpin().then((result) => {
      if (cancelled) return;
      setResponse(result);
      setLoading(false);
      setSpinKey((k) => k + 1);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayEndpoint = response?.endpoint ?? "…/api/spin";

  return (
    <div className="flex flex-col gap-0 rounded-xl border border-border/50 bg-muted/10 overflow-hidden font-mono text-xs">
      {/* ── Request panel ──────────────────────────────────────── */}
      <div className="flex flex-col gap-1 px-3 py-2.5 border-b border-border/40 bg-muted/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-400 text-[0.6rem] font-bold uppercase tracking-wide">
            POST
          </span>
          <span className="text-muted-foreground truncate text-[0.65rem]">
            {displayEndpoint}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground/60 pl-0.5">
          <span className="text-muted-foreground/40">body</span>
          <span className="text-muted-foreground/60">
            {"{"}
            &nbsp;
            <span className="text-blue-400/70">&quot;bet&quot;</span>
            <span className="text-muted-foreground/60">: </span>
            <span className="text-amber-400/70">1</span>
            &nbsp;
            {"}"}
          </span>
        </div>
      </div>

      {/* ── Response status bar ────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border/40 bg-muted/5">
        <div className="flex items-center gap-2">
          {response ? (
            <StatusBadge status={response.status} />
          ) : (
            <span className="inline-block w-8 h-4 rounded bg-muted/40 animate-pulse" />
          )}
          {response && response.status > 0 && (
            <span className="text-muted-foreground/50 text-[0.6rem]">
              {response.durationMs}
              <span className="ml-0.5">ms</span>
            </span>
          )}
        </div>
        <button
          onClick={fetchSpin}
          disabled={loading}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-border/50 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-[0.6rem] font-sans font-medium normal-case tracking-normal"
        >
          <RefreshCw className={cn("w-2.5 h-2.5", loading && "animate-spin")} />
          Spin
        </button>
      </div>

      {/* ── Response body ──────────────────────────────────────── */}
      <div className="px-3 py-3 min-h-36">
        {response?.error && !response.body ? (
          <p className="text-red-400 text-[0.65rem]">{response.error}</p>
        ) : (
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <JsonSkeleton />
              </motion.div>
            ) : response?.body ? (
              <motion.div
                key={`body-${spinKey}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PrettyJson data={response.body} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
