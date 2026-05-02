#version 300 es
precision highp float;

uniform float u_time;

in  vec2 v_uv;
out vec4 fragColor;

const float PI = 3.14159265358979;

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
// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
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

  return 80.0 + 820.0 * clamp(base + fine, 0.0, 1.0); // 80–900 nm (≈2 color cycles)
}

void main() {
  float d    = filmThickness(v_uv);
  float cosI = 1.0; // flat surface — perpendicular incidence

  // Physically-correct iridescence (Belcour 2017 / KHR_materials_iridescence)
  // baseF0 = 0.45  →  substrate IOR ≈ 3.0 (dark polished surface; maximises contrast)
  vec3 col = evalIridescence(1.0, 1.474, cosI, d, vec3(0.45));

  // Linear sRGB → gamma-encoded sRGB (WebGL canvas is interpreted as sRGB by the browser)
  col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));

  // Composite over a very dark base
  col = mix(vec3(0.04, 0.04, 0.06), col, 0.60);

  fragColor = vec4(col, 1.0);
}
