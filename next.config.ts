import type { NextConfig } from "next";

const baseHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// These headers are only meaningful (and only accepted by browsers) on HTTPS.
// Sending them over plain HTTP causes console errors that tank Lighthouse
// Best Practices in dev. They are applied via the `has` condition so they
// only fire when the request already arrived over HTTPS (e.g. on Vercel).
const httpsOnlyHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.vert": { loaders: ["raw-loader"], as: "*.js" },
      "*.frag": { loaders: ["raw-loader"], as: "*.js" },
    },
  },
  allowedDevOrigins: ["192.168.0.170"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: baseHeaders,
      },
      {
        source: "/(.*)",
        has: [{ type: "header", key: "x-forwarded-proto", value: "https" }],
        headers: httpsOnlyHeaders,
      },
    ];
  },
};

export default nextConfig;
