"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DEFER_TOGGLE_DELAY_MS = 1000;

const ModeToggle = dynamic(
  () => import("@/components/ui/theme-toggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-7 w-7 rounded-md border border-border/70 bg-background/80"
      />
    ),
  },
);

export default function DeferredThemeToggle() {
  const [canLoadToggle, setCanLoadToggle] = useState(false);

  useEffect(() => {
    let timeoutId = 0;
    let idleId = 0;
    const supportsRequestIdleCallback = "requestIdleCallback" in window;

    const start = () => setCanLoadToggle(true);

    timeoutId = window.setTimeout(() => {
      if (supportsRequestIdleCallback) {
        idleId = window.requestIdleCallback(start, { timeout: 1200 });
      } else {
        start();
      }
    }, DEFER_TOGGLE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      if (supportsRequestIdleCallback && idleId) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!canLoadToggle) {
    return (
      <div
        aria-hidden="true"
        className="h-7 w-7 rounded-md border border-border/70 bg-background/80"
      />
    );
  }

  return <ModeToggle />;
}
