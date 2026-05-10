"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DEFER_MOUNT_DELAY_MS = 1200;

const OilShaderBackground = dynamic(
  () => import("@/components/oil-shader-background"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function DeferredOilShaderBackground() {
  const [canLoadShader, setCanLoadShader] = useState(false);
  const [isShaderReady, setIsShaderReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const navWithConnection = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    const isSaveDataEnabled = Boolean(navWithConnection.connection?.saveData);

    if (prefersReducedMotion || isSaveDataEnabled) {
      return;
    }

    let timeoutId = 0;
    let idleId = 0;
    let hasStarted = false;
    const supportsRequestIdleCallback = "requestIdleCallback" in window;

    const start = () => {
      if (hasStarted) return;
      hasStarted = true;
      setCanLoadShader(true);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("scroll", start);
    };

    window.addEventListener("pointerdown", start, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", start, { once: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    window.addEventListener("scroll", start, { once: true, passive: true });

    timeoutId = window.setTimeout(() => {
      if (supportsRequestIdleCallback) {
        idleId = window.requestIdleCallback(start, { timeout: 1200 });
      } else {
        start();
      }
    }, DEFER_MOUNT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("scroll", start);
      if (supportsRequestIdleCallback && idleId) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  const handleShaderReady = () => {
    setIsShaderReady(true);
  };

  if (!canLoadShader) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-[oklch(0.145_0_0)] dark:bg-[oklch(0.145_0_0)]"
      />
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 transition-opacity duration-1400 ease-out motion-reduce:transition-none",
          isShaderReady ? "opacity-100" : "opacity-0",
        )}
      >
        <OilShaderBackground onReady={handleShaderReady} />
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 bg-[oklch(0.145_0_0)] dark:bg-[oklch(0.145_0_0)] transition-opacity duration-500 ease-out motion-reduce:transition-none",
          isShaderReady ? "opacity-0" : "opacity-100",
        )}
      />
    </>
  );
}
