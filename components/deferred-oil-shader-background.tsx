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

    if (prefersReducedMotion || isSaveDataEnabled || canLoadShader) {
      return;
    }

    let timeoutId = 0;
    let idleId = 0;
    const supportsRequestIdleCallback = "requestIdleCallback" in window;

    const start = () => {
      setCanLoadShader(true);
    };

    timeoutId = window.setTimeout(() => {
      if (supportsRequestIdleCallback) {
        idleId = window.requestIdleCallback(start, { timeout: 1200 });
      } else {
        start();
      }
    }, DEFER_MOUNT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      if (supportsRequestIdleCallback && idleId) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [canLoadShader]);

  const handleShaderReady = () => {
    setIsShaderReady(true);
  };

  if (!canLoadShader) {
    return (
      <div
        aria-hidden="true"
        data-page-background-layer="fallback"
        data-shader-mounted="false"
        data-shader-ready="false"
        className="fixed top-0 left-0 right-0 h-lvh bg-[oklch(0.145_0_0)] dark:bg-[oklch(0.145_0_0)]"
      />
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        data-page-background-layer="shader"
        data-shader-mounted="true"
        data-shader-ready={isShaderReady ? "true" : "false"}
        className={cn(
          "pointer-events-none fixed top-0 left-0 right-0 h-lvh transition-opacity duration-1400 ease-out motion-reduce:transition-none",
          isShaderReady ? "opacity-100" : "opacity-0",
        )}
      >
        <OilShaderBackground onReady={handleShaderReady} />
      </div>
      <div
        aria-hidden="true"
        data-page-background-layer="fallback"
        data-shader-mounted="true"
        data-shader-ready={isShaderReady ? "true" : "false"}
        className={cn(
          "pointer-events-none fixed top-0 left-0 right-0 h-lvh bg-[oklch(0.145_0_0)] dark:bg-[oklch(0.145_0_0)] transition-opacity duration-500 ease-out motion-reduce:transition-none",
          isShaderReady ? "opacity-0" : "opacity-100",
        )}
      />
    </>
  );
}
