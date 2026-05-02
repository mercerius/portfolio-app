"use client";

import { useEffect, useRef } from "react";

import FRAG from "@/lib/shaders/oil-shader.frag";
import VERT from "@/lib/shaders/oil-shader.vert";

// ── Component ─────────────────────────────────────────────────────────────────────────────
export default function OilShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
    let W = 1,
      H = 1;
    const resize = () => {
      W = Math.max(1, Math.floor(window.innerWidth / 2));
      H = Math.max(1, Math.floor(window.innerHeight / 2));
      canvas.width = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const startMs = performance.now();

    // ── Uniform & attribute locations ─────────────────────────────────────
    const uTime = gl.getUniformLocation(prog, "u_time");
    const aPos = gl.getAttribLocation(prog, "a_pos");

    // ── Render loop ────────────────────────────────────────────────────
    let rafId = 0;
    let paused = false;

    const render = () => {
      if (!paused) {
        const t = (performance.now() - startMs) / 1000;

        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1f(uTime, t);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
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
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full bg-[oklch(0.08_0.008_280)]"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
