import "server-only";

/**
 * Fixed-window rate limit held in the process.
 *
 * Good enough for a marketing site's single write endpoint, with one honest
 * caveat: serverless instances do not share memory, so the real ceiling is
 * `limit × concurrent instances`. It raises the cost of spamming the form; it
 * is not a defence against a determined flood. Move to a shared store
 * (Vercel KV, Upstash) if this endpoint ever matters more than it does today —
 * see README.md → Rate limiting.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

const MAX_TRACKED_KEYS = 5_000;

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the caller may try again. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) sweep(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  // Still full of live windows: drop the oldest so the map cannot grow without
  // bound under a flood of distinct keys.
  if (windows.size >= MAX_TRACKED_KEYS) {
    const oldest = [...windows.entries()]
      .sort((a, b) => a[1].resetAt - b[1].resetAt)
      .slice(0, Math.ceil(MAX_TRACKED_KEYS / 4));
    for (const [key] of oldest) windows.delete(key);
  }
}

/**
 * Best-effort client identity for rate limiting only. Never logged, never
 * stored, never attached to the enquiry.
 *
 * `x-forwarded-for` is only trustworthy behind a proxy that overwrites it —
 * Vercel does, which is what this site deploys to. Self-host it behind
 * something that does not, and a caller can spoof the header and sidestep the
 * limit entirely. Read the IP from the platform's own trusted source if this
 * ever moves off Vercel.
 */
export function clientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  return ip;
}
