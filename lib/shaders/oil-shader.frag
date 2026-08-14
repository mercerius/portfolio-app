#version 300 es
precision highp float;

uniform float u_time;
uniform vec3 u_theme_base;
uniform vec3 u_theme_accent;
uniform float u_theme_mix;
uniform vec2 u_resolution;

in  vec2 v_uv;
out vec4 fragColor;

const float PI = 3.14159265358979;

// ── Visual tuning ────────────────────────────────────────────────────────────
// Keep these independent from the fixed color-science and thin-film constants
// below. Adjust one control at a time, then check both light and dark themes.

// Increase X/Y for stronger horizontal/vertical barrel curvature; values above
// 0.30 make the corners leave the virtual CRT screen quickly.
const float CRT_CURVE_X = 0.16;
const float CRT_CURVE_Y = 0.24;

// Screen mask: raise SCALE to pull the rounded edge inward, lower EXPONENT for
// rounder corners, or raise SOFTNESS to make the edge fade over a wider area.
const float CRT_VIGNETTE_SCALE = 1.79;
const float CRT_VIGNETTE_EXPONENT = 160.0;
const float CRT_VIGNETTE_SOFTNESS = 0.50;

// Interference: RATE is line-jitter updates per second; PIXELS is maximum
// horizontal displacement in drawing-buffer pixels. Keep PIXELS under 8.0 to
// avoid noisy horizontal tearing on the intentionally half-resolution canvas.
const float CRT_INTERFERENCE_RATE = 18.0;
const float CRT_INTERFERENCE_PIXELS = 5.6;

// Interlace: FIELD_RATE is the simulated field cadence and OFFSET_PIXELS is
// the alternating vertical shift. Set OFFSET_PIXELS to 0.0 for a stable raster.
const float CRT_FIELD_RATE = 60.0;
const float CRT_INTERLACE_OFFSET_PIXELS = 0.85;

// Composite bandwidth: larger tap values blur farther horizontally. LUMA_MIX
// controls detail loss, while CHROMA_MIX controls colored bleed independently.
const float CRT_LUMA_TAP_PIXELS = 1.4;
const float CRT_CHROMA_TAP_PIXELS = 5.2;
const float CRT_LUMA_MIX = 0.34;
const float CRT_CHROMA_MIX = 0.76;

// NTSC-like chroma: increase PHASE_SWING for more color wobble; raise the two
// CROSSTALK values for stronger brightness leaking into I/Q color components.
const float CRT_SUBCARRIER_SPEED = 42.0;
const float CRT_SUBCARRIER_DENSITY = 860.0;
const float CRT_PHASE_SWING = 0.36;
const float CRT_CROSSTALK_I = 0.22;
const float CRT_CROSSTALK_Q = 0.16;

// Raster: MIN is the darkest scanline level, MAX is its brightest level, and
// RAMP_START/RAMP_END control line softness. Lower MIN for deeper scanlines.
const float CRT_SCANLINE_MIN = 0.56;
const float CRT_SCANLINE_MAX = 0.44;
const float CRT_SCANLINE_RAMP_START = 0.08;
const float CRT_SCANLINE_RAMP_END = 0.50;

// Flicker: BASELINE sets average brightness; AMPLITUDE and SPEED pairs create
// slow analog drift. Keep total amplitude below 0.03 to prevent distraction.
const float CRT_FLICKER_BASELINE = 0.985;
const float CRT_FLICKER_AMPLITUDE_A = 0.010;
const float CRT_FLICKER_SPEED_A = 1.7;
const float CRT_FLICKER_AMPLITUDE_B = 0.005;
const float CRT_FLICKER_SPEED_B = 0.37;
const float CRT_OUTPUT_BRIGHTNESS = 1.0; // Raise cautiously; clipping flattens color.

// ── Helpers ───────────────────────────────────────────────────────────────────
// Note: function overloading is avoided intentionally — Adreno GLSL compilers
// on Android are known to miscompile user-defined overloaded functions.
float sqf(float x) { return x * x; }
vec3  sqv(vec3  x) { return x * x; }

float schlickF(float F0, float cosA) {
  float x = clamp(1.0 - cosA, 0.0, 1.0);
  return F0 + (1.0 - F0) * (x * x * x * x * x);
}
vec3 schlickV(vec3 F0, float cosA) {
  float x = clamp(1.0 - cosA, 0.0, 1.0);
  return F0 + (1.0 - F0) * (x * x * x * x * x);
}

float iorToF0f(float nT, float nI) { return sqf((nT - nI) / (nT + nI)); }
vec3  iorToF0v(vec3  nT, float nI) { return sqv((nT - nI) / (nT + nI)); }

vec3 f0ToIor(vec3 f0) {
  vec3 s = sqrt(clamp(f0, 0.0, 0.9999));
  return (1.0 + s) / (1.0 - s);
}

// ── Belcour 2017: XYZ color matching functions evaluated in Fourier space ─────
// Maps optical path difference (nm) + phase shift directly to linear sRGB.
// Ref: https://belcour.github.io/blog/research/publication/2017/05/01/brdf-thin-film.html
// Note: declared as plain mat3 (not const) — Adreno drivers can fail to
// compile const matrices with large literal initialisers.
mat3 XYZ_TO_REC709 = mat3(
   3.2404542, -0.9692660,  0.0556434,
  -1.5371385,  1.8760108, -0.2040259,
  -0.4985314,  0.0415560,  1.0572252
);

vec3 evalSensitivity(float OPD, vec3 shift) {
  float phase = 2.0 * PI * OPD * 1.0e-9;
  vec3 val = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);
  vec3 pos = vec3(1.6810e+06, 1.7953e+06, 2.2084e+06);
  vec3 var = vec3(4.3278e+09, 9.3046e+09, 6.6121e+09);

  vec3 xyz = val * sqrt(2.0 * PI * var) * cos(pos * phase + shift) * exp(-sqf(phase) * var);
  // Extra x̄ Gaussian lobe
  xyz.x += 9.7470e-14 * sqrt(2.0 * PI * 4.5282e+09)
         * cos(2.2399e+06 * phase + shift.x) * exp(-4.5282e+09 * sqf(phase));
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
  float sinTheta2Sq = sqf(outsideIOR / iriIOR) * (1.0 - sqf(cosTheta1));
  float cosTheta2Sq = 1.0 - sinTheta2Sq;
  if (cosTheta2Sq < 0.0) return vec3(1.0); // total internal reflection
  float cosTheta2 = sqrt(cosTheta2Sq);

  // ── First interface: air / film ───────────────────────────────────────────
  float R0_top = iorToF0f(iriIOR, outsideIOR);
  float R12    = schlickF(R0_top, cosTheta1);
  float T121   = 1.0 - R12;
  // Phase reversal when crossing from low to high IOR
  float phi12  = (iriIOR < outsideIOR) ? PI : 0.0;
  float phi21  = PI - phi12;

  // ── Second interface: film / substrate ────────────────────────────────────
  vec3 baseIOR = f0ToIor(clamp(baseF0, 0.0, 0.9999));
  vec3 R1_bot  = iorToF0v(baseIOR, iriIOR);
  vec3 R23     = schlickV(R1_bot, cosTheta2);
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
  vec3 Rs   = sqf(T121) * R23 / (1.0 - R123);

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

  return 140.0 + 480.0 * clamp(base + fine, 0.0, 1.0); // 140–620 nm (≈2 color cycles)
  // return 80.0 + 820.0 * clamp(base + fine, 0.0, 1.0);
}

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

vec2 curveUv(vec2 uv) {
  vec2 centered = uv - 0.5;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  centered.x *= aspect;
  centered *= 1.0 + vec2(
    centered.y * centered.y * CRT_CURVE_X,
    centered.x * centered.x * CRT_CURVE_Y
  );
  centered.x /= aspect;
  return centered + 0.5;
}

float screenVignette(vec2 uv) {
  vec2 screenUv = (uv - 0.5) * CRT_VIGNETTE_SCALE;
  float roundedEdge = 1.0 - sqrt(
    pow(abs(screenUv.x), CRT_VIGNETTE_EXPONENT)
      + pow(abs(screenUv.y), CRT_VIGNETTE_EXPONENT)
  );
  return smoothstep(0.0, CRT_VIGNETTE_SOFTNESS, roundedEdge);
}

vec3 rgbToYiq(vec3 color) {
  return vec3(
    dot(color, vec3(0.299, 0.587, 0.114)),
    dot(color, vec3(0.596, -0.275, -0.321)),
    dot(color, vec3(0.212, -0.523, 0.311))
  );
}

vec3 yiqToRgb(vec3 signal) {
  return vec3(
    signal.x + 0.956 * signal.y + 0.621 * signal.z,
    signal.x - 0.272 * signal.y - 0.647 * signal.z,
    signal.x - 1.106 * signal.y + 1.704 * signal.z
  );
}

vec3 oilColorAt(vec2 uv) {
  float thickness = filmThickness(uv);
  vec3 color = evalIridescence(1.0, 1.474, 1.0, thickness, vec3(0.14));
  color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));

  vec3 themedBase = mix(u_theme_base, u_theme_accent, 0.06);
  return mix(themedBase, color, clamp(u_theme_mix, 0.0, 1.0));
}

vec3 applyCrtEffect(vec2 uv) {
  vec2 curvedUv = curveUv(uv);
  float field = mod(floor(u_time * CRT_FIELD_RATE), 2.0);
  float lineNoise = hash21(vec2(
    floor(u_time * CRT_INTERFERENCE_RATE),
    floor(gl_FragCoord.y)
  ));
  float interference = (lineNoise - 0.5) * CRT_INTERFERENCE_PIXELS
    / max(u_resolution.x, 1.0);
  float interlaceOffset = (field - 0.5) * CRT_INTERLACE_OFFSET_PIXELS
    / max(u_resolution.y, 1.0);
  vec2 signalUv = curvedUv + vec2(interference, interlaceOffset);
  float lumaTap = CRT_LUMA_TAP_PIXELS / max(u_resolution.x, 1.0);
  float chromaTap = CRT_CHROMA_TAP_PIXELS / max(u_resolution.x, 1.0);

  vec3 source = rgbToYiq(oilColorAt(signalUv));
  vec3 lumaLeft = rgbToYiq(oilColorAt(signalUv - vec2(lumaTap, 0.0)));
  vec3 lumaRight = rgbToYiq(oilColorAt(signalUv + vec2(lumaTap, 0.0)));
  vec3 chromaLeft = rgbToYiq(oilColorAt(signalUv - vec2(chromaTap, 0.0)));
  vec3 chromaRight = rgbToYiq(oilColorAt(signalUv + vec2(chromaTap, 0.0)));

  vec3 signal = source;
  signal.x = mix(
    source.x,
    (lumaLeft.x + source.x + lumaRight.x) / 3.0,
    CRT_LUMA_MIX
  );
  signal.yz = mix(
    source.yz,
    (chromaLeft.yz + chromaRight.yz) * 0.5,
    CRT_CHROMA_MIX
  );

  float subcarrier = u_time * CRT_SUBCARRIER_SPEED
    + (signalUv.x + signalUv.y * 0.12) * PI * CRT_SUBCARRIER_DENSITY;
  float phase = sin(subcarrier) * CRT_PHASE_SWING;
  float chromaI = signal.y * cos(phase) - signal.z * sin(phase);
  float chromaQ = signal.y * sin(phase) + signal.z * cos(phase);
  signal.y = chromaI + signal.x * sin(subcarrier) * CRT_CROSSTALK_I;
  signal.z = chromaQ + signal.x * cos(subcarrier) * CRT_CROSSTALK_Q;

  float scanPhase = fract((gl_FragCoord.y + field * 0.5) * 0.5);
  float scanline = CRT_SCANLINE_MIN + CRT_SCANLINE_MAX * smoothstep(
    CRT_SCANLINE_RAMP_START,
    CRT_SCANLINE_RAMP_END,
    scanPhase
  );
  float flicker = CRT_FLICKER_BASELINE
    + CRT_FLICKER_AMPLITUDE_A * sin(u_time * CRT_FLICKER_SPEED_A)
    + CRT_FLICKER_AMPLITUDE_B * sin(u_time * CRT_FLICKER_SPEED_B + 1.9);
  float vignette = screenVignette(curvedUv);
  return clamp(
    yiqToRgb(signal) * scanline * flicker * vignette * CRT_OUTPUT_BRIGHTNESS,
    0.0,
    1.0
  );
}

void main() {
  fragColor = vec4(applyCrtEffect(v_uv), 1.0);
}
