import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` allows inline scripts because Next.js injects its own hydration
 * bootstrap inline, and the strict alternative — per-request nonces issued from
 * proxy.ts — forces every page to render dynamically, which costs this site the
 * static generation its Core Web Vitals depend on. That trade is defensible
 * here: the site has no user-generated content, no third-party scripts and no
 * authenticated surface, so there is no injection path for the policy to close.
 *
 * If a third-party script, an embed or any user-supplied content is ever added,
 * switch to nonces (README.md → Security headers) before shipping it.
 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Whether the site is actually served over HTTPS. HSTS and
 * `upgrade-insecure-requests` are meaningless otherwise, and applied to a
 * plain-http origin they simply make the site unreachable — including a
 * production build run locally for testing. The configured canonical origin is
 * the honest signal for this, not the build mode.
 */
const isHttps = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // No embeds, no plugins, and nothing may frame this site. Same-origin frames
  // are allowed in development so the layout can be checked at phone widths.
  isProduction ? "frame-src 'none'" : "frame-src 'self'",
  "object-src 'none'",
  isProduction ? "frame-ancestors 'none'" : "frame-ancestors 'self'",
  // The contact form posts to this origin only.
  "form-action 'self'",
  "base-uri 'self'",
  ...(isHttps ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: isProduction ? "DENY" : "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  },
  ...(isHttps
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // `next dev` serves its client chunks to the dev origin only. Without this,
  // opening the dev server on the loopback IP or a phone on the LAN silently
  // gets no JavaScript — the page renders and nothing is interactive.
  allowedDevOrigins: ["127.0.0.1"],

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The enquiry endpoint must never be cached by a CDN or a browser.
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
