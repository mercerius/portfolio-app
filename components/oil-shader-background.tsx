"use client";

import { useEffect, useRef } from "react";

// ── GLSL: shared fullscreen-quad vertex shader (WebGL2 / GLSL ES 3.0) ────────
const VERT = /* glsl */ `#version 300 es
in  vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv        = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// ── GLSL: oil-film fragment shader (Belcour 2017 / Khronos KHR_materials_iridescence)
const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec3  u_ripples[8];   // xy = uv position (0-1, Y flipped), z = birth time
uniform int   u_rippleCount;

in  vec2 v_uv;
out vec4 fragColor;

const float PI = 3.14159265358979;

// ── Helpers ───────────────────────────────────────────────────────────────────
float sq(float x) { return x * x; }
vec3  sq(vec3  x) { return x * x; }

float schlick(float F0, float cosA) {
  float x = clamp(1.0 - cosA, 0.0, 1.0);
  return F0 + (1.0 - F0) * (x * x * x * x * x);
}
vec3 schlick(vec3 F0, float cosA) {
  float x = clamp(1.0 - cosA, 0.0, 1.0);
  return F0 + (1.0 - F0) * (x * x * x * x * x);
}

float iorToF0(float nT, float nI) { return sq((nT - nI) / (nT + nI)); }
vec3  iorToF0(vec3  nT, float nI) { return sq((nT - nI) / (nT + nI)); }

vec3 f0ToIor(vec3 f0) {
  vec3 s = sqrt(clamp(f0, 0.0, 0.9999));
  return (1.0 + s) / (1.0 - s);
}

// ── Belcour 2017: XYZ color matching functions evaluated in Fourier space ─────
// Maps optical path difference (nm) + phase shift directly to linear sRGB.
// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
const mat3 XYZ_TO_REC709 = mat3(
   3.2404542, -0.9692660,  0.0556434,
  -1.5371385,  1.8760108, -0.2040259,
  -0.4985314,  0.0415560,  1.0572252
);

vec3 evalSensitivity(float OPD, vec3 shift) {
  float phase = 2.0 * PI * OPD * 1.0e-9;
  vec3 val = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);
  vec3 pos = vec3(1.6810e+06, 1.7953e+06, 2.2084e+06);
  vec3 var = vec3(4.3278e+09, 9.3046e+09, 6.6121e+09);

  vec3 xyz = val * sqrt(2.0 * PI * var) * cos(pos * phase + shift) * exp(-sq(phase) * var);
  // Extra x̄ Gaussian lobe
  xyz.x += 9.7470e-14 * sqrt(2.0 * PI * 4.5282e+09)
         * cos(2.2399e+06 * phase + shift.x) * exp(-4.5282e+09 * sq(phase));
  xyz   /= 1.0685e-7;

  return XYZ_TO_REC709 * xyz;   // linear sRGB
}

// ── Thin-film iridescence via Airy series + Belcour sensitivity ───────────────
// outsideIOR  air (1.0)
// eta2        film IOR, e.g. oil ≈ 1.47
// cosTheta1   cosine of incidence angle in the incident medium
// thickness   film thickness in nm
// baseF0      specular F0 of substrate – higher = darker substrate = more contrast
vec3 evalIridescence(float outsideIOR, float eta2, float cosTheta1,
                     float thickness, vec3 baseF0) {
  // Smooth the film IOR to air as thickness → 0 to avoid hard discontinuity
  float iriIOR = mix(outsideIOR, eta2, smoothstep(0.0, 0.03, thickness));

  // Snell's law: incidence angle → refraction angle inside film
  float sinTheta2Sq = sq(outsideIOR / iriIOR) * (1.0 - sq(cosTheta1));
  float cosTheta2Sq = 1.0 - sinTheta2Sq;
  if (cosTheta2Sq < 0.0) return vec3(1.0); // total internal reflection
  float cosTheta2 = sqrt(cosTheta2Sq);

  // ── First interface: air / film ───────────────────────────────────────────
  float R0_top = iorToF0(iriIOR, outsideIOR);
  float R12    = schlick(R0_top, cosTheta1);
  float T121   = 1.0 - R12;
  // Phase reversal when crossing from low to high IOR
  float phi12  = (iriIOR < outsideIOR) ? PI : 0.0;
  float phi21  = PI - phi12;

  // ── Second interface: film / substrate ────────────────────────────────────
  vec3 baseIOR = f0ToIor(clamp(baseF0, 0.0, 0.9999));
  vec3 R1_bot  = iorToF0(baseIOR, iriIOR);
  vec3 R23     = schlick(R1_bot, cosTheta2);
  vec3 phi23   = vec3(
    (baseIOR.r < iriIOR) ? PI : 0.0,
    (baseIOR.g < iriIOR) ? PI : 0.0,
    (baseIOR.b < iriIOR) ? PI : 0.0
  );

  // ── Optical path difference and accumulated phase shift ───────────────────
  float OPD = 2.0 * iriIOR * thickness * cosTheta2;
  vec3  phi  = vec3(phi21) + phi23;

  // ── Airy-series compound reflectance ─────────────────────────────────────
  vec3 R123 = clamp(R12 * R23, 1e-5, 0.9999);
  vec3 r123 = sqrt(R123);
  vec3 Rs   = sq(T121) * R23 / (1.0 - R123);

  // m = 0: DC (spectrally flat) term
  vec3 C0 = R12 + Rs;
  vec3 I  = C0;

  // m = 1, 2: interference terms weighted by Belcour XYZ sensitivity
  vec3 Cm = Rs - T121;
  for (int m = 1; m <= 2; m++) {
    Cm *= r123;
    I  += Cm * 2.0 * evalSensitivity(float(m) * OPD, float(m) * phi);
  }

  return max(I, vec3(0.0));
}

// ── Domain-warped film thickness ─────────────────────────────────────────────
// Returns thickness in nm; two layers of domain warp create organic swirls.
float filmThickness(vec2 uv) {
  float wx  = sin(uv.x * 3.7  + uv.y * 2.1  + u_time * 0.06);
  float wy  = cos(uv.x * 2.3  - uv.y * 3.9  + u_time * 0.05);
  vec2  w1  = uv + vec2(wx, wy) * 0.22;

  float wx2 = sin(w1.x * 5.2  + w1.y * 4.1  + u_time * 0.09);
  float wy2 = cos(w1.x * 3.8  - w1.y * 6.3  + u_time * 0.07);
  vec2  w2  = w1 + vec2(wx2, wy2) * 0.12;

  float fine = sin(w2.x * 22.0 + w2.y * 17.0 + u_time * 0.12) * 0.07;
  float base = sin(w2.x *  7.0 + w2.y *  5.3) * 0.5 + 0.5;

  return 80.0 + 820.0 * clamp(base + fine, 0.0, 1.0); // 80–900 nm (≈2 color cycles)
}

// ── Mouse-driven circular ripples ─────────────────────────────────────────────
float rippleHeight(vec2 uv) {
  float h      = 0.0;
  float aspect = u_resolution.x / u_resolution.y;

  for (int i = 0; i < 8; i++) {
    if (i >= u_rippleCount) break;

    float age = u_time - u_ripples[i].z;
    if (age < 0.0 || age > 3.0) continue;

    vec2  d    = uv - u_ripples[i].xy;
    d.x       *= aspect;
    float dist  = length(d);

    float phase = (dist * 22.0 - age * 13.0) * 2.0 * PI;
    float env   = exp(-age * 0.85) * exp(-dist * 5.5) * max(0.0, 1.0 - age / 3.0);
    h += sin(phase) * env * 0.07;
  }
  return h;
}

void main() {
  float h = rippleHeight(v_uv);
  float d = filmThickness(v_uv) + h * 40.0; // ripples modulate local film thickness

  // Surface normal from screen-space gradient of ripple height → incidence angle
  float dhdx = dFdx(h) * u_resolution.x;
  float dhdy = dFdy(h) * u_resolution.y;
  float cosI = 1.0 / sqrt(1.0 + (dhdx * dhdx + dhdy * dhdy) * 12.0);

  // Physically-correct iridescence (Belcour 2017 / KHR_materials_iridescence)
  // baseF0 = 0.45  →  substrate IOR ≈ 3.0 (dark polished surface; maximises contrast)
  vec3 col = evalIridescence(1.0, 1.474, cosI, d, vec3(0.45));

  // Linear sRGB → gamma-encoded sRGB (WebGL canvas is interpreted as sRGB by the browser)
  col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));

  // Composite over a very dark base; ripple activity lifts local luminance
  float activity = abs(h) * 3.0 + length(vec2(dhdx, dhdy)) * 0.35;
  float vis      = 0.60 + clamp(activity, 0.0, 0.40);
  col = mix(vec3(0.04, 0.04, 0.06), col, vis);

  fragColor = vec4(col, 1.0);
}`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Ripple {
  x: number; // UV [0, 1], X left→right
  y: number; // UV [0, 1], Y bottom→top (flipped from screen)
  t: number; // birth time in seconds (relative to component mount)
}

const MAX_RIPPLES = 8;
const RIPPLE_TTL = 3.0; // seconds until a ripple fades out completely
const MIN_MOVE_DIST = 0.015; // minimum UV distance before a new ripple point is added

// ── Component ─────────────────────────────────────────────────────────────────
export default function OilShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
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

    // ── Ripple trail ──────────────────────────────────────────────────────
    const startMs = performance.now();
    const now = () => (performance.now() - startMs) / 1000;

    const ripples: Ripple[] = [];
    let lastX = -1,
      lastY = -1;
    let mouseOnPage = false;

    const addRipple = (clientX: number, clientY: number) => {
      if (!mouseOnPage) return;
      const x = clientX / window.innerWidth;
      const y = 1.0 - clientY / window.innerHeight; // flip Y
      const dx = x - lastX,
        dy = y - lastY;
      if (ripples.length && Math.sqrt(dx * dx + dy * dy) < MIN_MOVE_DIST)
        return;
      lastX = x;
      lastY = y;
      const t = now();
      ripples.push({ x, y, t });
      // Evict expired entries
      const cutoff = t - RIPPLE_TTL;
      while (ripples.length && ripples[0].t < cutoff) ripples.shift();
      if (ripples.length > MAX_RIPPLES) ripples.shift();
    };

    const onMouseMove = (e: MouseEvent) => addRipple(e.clientX, e.clientY);
    const onMouseEnter = () => {
      mouseOnPage = true;
    };
    const onMouseLeave = () => {
      mouseOnPage = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      for (const touch of Array.from(e.touches))
        addRipple(touch.clientX, touch.clientY);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── Uniform & attribute locations ─────────────────────────────────────
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uRipples = gl.getUniformLocation(prog, "u_ripples");
    const uCount = gl.getUniformLocation(prog, "u_rippleCount");
    const aPos = gl.getAttribLocation(prog, "a_pos");

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId = 0;
    let paused = false;
    const rippleData = new Float32Array(MAX_RIPPLES * 3);

    const render = () => {
      if (!paused) {
        const t = now();
        // Evict expired ripples
        const cutoff = t - RIPPLE_TTL;
        while (ripples.length && ripples[0].t < cutoff) ripples.shift();

        const count = Math.min(ripples.length, MAX_RIPPLES);
        for (let i = 0; i < count; i++) {
          rippleData[i * 3] = ripples[i].x;
          rippleData[i * 3 + 1] = ripples[i].y;
          rippleData[i * 3 + 2] = ripples[i].t;
        }

        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1f(uTime, t);
        gl.uniform2f(uRes, W, H);
        gl.uniform3fv(uRipples, rippleData);
        gl.uniform1i(uCount, count);

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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
