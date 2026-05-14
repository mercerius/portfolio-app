"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

import FRAG from "@/lib/shaders/oil-shader.frag";
import VERT from "@/lib/shaders/oil-shader.vert";

type Rgb = [number, number, number];

const DEFAULT_BASE: Rgb = [0.06, 0.06, 0.08];
const DEFAULT_ACCENT: Rgb = [0.42, 0.28, 0.9];
const LIGHT_THEME_MIX = 0.98;
const DARK_THEME_MIX = 0.48;
const MIX_EASING = 0.08;
const STARTUP_DELAY_MS = 450;

let cssColorParserCtx: CanvasRenderingContext2D | null = null;

const getCssColorParserContext = (): CanvasRenderingContext2D | null => {
  if (cssColorParserCtx) return cssColorParserCtx;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  cssColorParserCtx = canvas.getContext("2d");

  return cssColorParserCtx;
};

const parseHexToRgb = (value: string): Rgb | null => {
  const hex = value.slice(1).trim();
  if (hex.length === 3) {
    const r = Number.parseInt(hex[0] + hex[0], 16);
    const g = Number.parseInt(hex[1] + hex[1], 16);
    const b = Number.parseInt(hex[2] + hex[2], 16);
    return [r / 255, g / 255, b / 255];
  }

  if (hex.length === 6) {
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return [r / 255, g / 255, b / 255];
  }

  return null;
};

const parseColorToRgb = (value: string): Rgb | null => {
  const normalized = value.trim();
  if (!normalized) return null;

  const parser = getCssColorParserContext();
  if (!parser) return null;

  parser.fillStyle = "rgb(0 0 0)";
  parser.fillStyle = normalized;

  const computed = parser.fillStyle;
  if (!computed) return null;

  if (computed.startsWith("#")) {
    return parseHexToRgb(computed);
  }

  const rgbaContent = computed.match(/rgba?\(([^)]+)\)/i)?.[1];
  if (!rgbaContent) return null;

  const channels = rgbaContent
    .replace(/\//g, " ")
    .replace(/,/g, " ")
    .trim()
    .split(/\s+/)
    .map(Number)
    .filter((channel) => Number.isFinite(channel));

  if (channels.length < 3) return null;

  return [channels[0] / 255, channels[1] / 255, channels[2] / 255];
};

const readThemeColors = (): { base: Rgb; accent: Rgb } => {
  const rootStyles = getComputedStyle(document.documentElement);
  const base = parseColorToRgb(rootStyles.getPropertyValue("--background"));
  const accent = parseColorToRgb(rootStyles.getPropertyValue("--primary"));

  return {
    base: base ?? DEFAULT_BASE,
    accent: accent ?? DEFAULT_ACCENT,
  };
};

const resolveIsDark = (resolvedTheme?: string): boolean => {
  if (resolvedTheme === "dark") return true;
  if (resolvedTheme === "light") return false;
  return document.documentElement.classList.contains("dark");
};

type OilShaderBackgroundProps = {
  onReady?: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────────────────
export default function OilShaderBackground({
  onReady,
}: OilShaderBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const themeColorsRef = useRef<{ base: Rgb; accent: Rgb }>({
    base: DEFAULT_BASE,
    accent: DEFAULT_ACCENT,
  });
  const themeMixTargetRef = useRef(DARK_THEME_MIX);
  const themeMixCurrentRef = useRef(DARK_THEME_MIX);

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

    const start = () => setCanAnimate(true);
    const supportsRequestIdleCallback = "requestIdleCallback" in window;

    timeoutId = window.setTimeout(() => {
      if (supportsRequestIdleCallback) {
        idleId = window.requestIdleCallback(start, { timeout: 1200 });
      } else {
        start();
      }
    }, STARTUP_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      if (supportsRequestIdleCallback && idleId) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (!document.body) return;

    const syncColors = () => {
      themeColorsRef.current = readThemeColors();
      const targetMix = resolveIsDark(resolvedTheme)
        ? DARK_THEME_MIX
        : LIGHT_THEME_MIX;
      themeMixTargetRef.current = targetMix;
    };

    syncColors();

    const observer = new MutationObserver(syncColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  useEffect(() => {
    if (!canAnimate) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      powerPreference: "high-performance",
    });
    if (!gl) return; // graceful no-op on unsupported browsers

    // ── Compile a shader, throw on error ──────────────────────────────────
    const compile = (type: number, src: string): WebGLShader => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) ?? "shader compile error");
      return s;
    };

    // ── Link a program, throw on error ────────────────────────────────────
    const link = (vSrc: string, fSrc: string): WebGLProgram => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vSrc));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fSrc));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(p) ?? "program link error");
      return p;
    };

    let prog: WebGLProgram;
    try {
      prog = link(VERT, FRAG);
    } catch (e) {
      console.error("[OilShaderBackground]", e);
      return;
    }

    // ── Fullscreen quad VBO (two triangles covering NDC [-1,1]²) ──────────
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    // ── Resize: render at half CSS-pixel resolution for performance ────────
    // Uses visualViewport when available so canvas tracks the true visible
    // area on mobile even as the browser chrome (address bar) shows/hides.
    let W = 1,
      H = 1;
    const resize = () => {
      const vv = window.visualViewport;
      W = Math.max(1, Math.floor((vv?.width ?? window.innerWidth) / 2));
      H = Math.max(1, Math.floor((vv?.height ?? window.innerHeight) / 2));
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);
    window.visualViewport?.addEventListener("resize", resize);

    const startMs = performance.now();

    // ── Uniform & attribute locations ─────────────────────────────────────
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uThemeBase = gl.getUniformLocation(prog, "u_theme_base");
    const uThemeAccent = gl.getUniformLocation(prog, "u_theme_accent");
    const uThemeMix = gl.getUniformLocation(prog, "u_theme_mix");
    const aPos = gl.getAttribLocation(prog, "a_pos");

    // ── Render loop ────────────────────────────────────────────────────
    let rafId = 0;
    let paused = false;
    let hasNotifiedReady = false;

    const render = () => {
      if (!paused) {
        const t = (performance.now() - startMs) / 1000;

        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1f(uTime, t);
        const { base, accent } = themeColorsRef.current;
        const targetMix = themeMixTargetRef.current;
        const currentMix = themeMixCurrentRef.current;
        const nextMix = currentMix + (targetMix - currentMix) * MIX_EASING;
        themeMixCurrentRef.current = nextMix;

        if (uThemeBase) {
          gl.uniform3f(uThemeBase, base[0], base[1], base[2]);
        }
        if (uThemeAccent) {
          gl.uniform3f(uThemeAccent, accent[0], accent[1], accent[2]);
        }
        if (uThemeMix) {
          gl.uniform1f(uThemeMix, themeMixCurrentRef.current);
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (!hasNotifiedReady) {
          hasNotifiedReady = true;
          onReady?.();
        }
      }
      rafId = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    render();

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.visualViewport?.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [canAnimate, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 right-0 h-lvh w-full bg-[oklch(0.08_0.008_280)]"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
