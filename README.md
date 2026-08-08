# Hiromitsu — website

MVP marketing site for Hiromitsu, a restaurant at 5-1 Congressional Road,
General Mariano Alvarez, Cavite.

**It is not ready to launch.** Four facts about this business have been checked;
everything else is waiting on the owner. See [`SOURCES.md`](./SOURCES.md) for
the audit trail and [`DISCOVERY-CHECKLIST.md`](./DISCOVERY-CHECKLIST.md) for what
is still needed.

## The one rule

Nothing on this site may state something that has not been verified or approved
by the owner. No sample dishes, no plausible-looking opening hours, no stock
photography, no logo drawn on the restaurant's behalf, no invented reviews.

That rule is enforced in code, not by discipline. Every fact lives in
`src/content/business.ts` as a tagged union:

```ts
type Fact<T> =
  | { status: "verified";    value: T; source: string; checkedAt: string }
  | { status: "unconfirmed"; publicNote: string }   // no `value` field exists
```

An `unconfirmed` fact has no value to render, so a page physically cannot print
one. It renders its `publicNote` — a customer-facing sentence — and a hollow
status marker. Promoting a fact means adding a real source and a check date.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npx tsc --noEmit && npx eslint .
```

Copy `.env.example` to `.env.local` first. Every variable is optional in
development — the site degrades honestly without them.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Vercel.

No database. No CMS. No authentication. No payments. None of them are needed
for what this site does, and each one would be a thing to secure and maintain.

Server Components by default. Client components are only where interactivity
genuinely lives: `site-header` (mobile menu), `inquiry-form`, `faq-section`,
and `actions` (analytics on click).

## Pages

| Route | Job |
| --- | --- |
| `/` | Name, verified facts, what is missing, how to find it, FAQ |
| `/menu` | Explains that no menu is published, and what will be built when one arrives |
| `/visit` | Address, hours, ordering, delivery, payment, access |
| `/about` | What has been checked, where it came from, how the site is built |
| `/contact` | Verified phone; message form when an inbox is configured |
| `/privacy` | What the form collects, why, where it goes, and for how long |
| `/owner-checklist` | Working list of what the owner still owes. `noindex`, disallowed in robots.txt |

The brief's sitemap listed "Order or reserve" as its own page. It is folded into
`/visit` because no ordering or reservation workflow has been confirmed — a
dedicated page would have nothing on it but an apology. Split it out once the
owner confirms how people actually order.

## Design

Direction: **the standing sign.** With no photography and no logo available,
the identity is carried by type, colour blocking, and one repeated structural
device.

- **Type.** Two families, three roles. `Archivo` is a variable grotesque with a
  width axis: pulled wide (`wdth 122`) it is the sign over the door, pulled
  narrow and tracked (`wdth 86`) it is the small print. Width carries the role,
  so no third typeface is needed. `Literata` sets running text.
- **Colour.** Deep shade-green panels, bleached daylight paper, one brass
  accent. Committed light — there is no dark theme, and shadcn's `dark:`
  utilities are bound to a `.dark` class that is never applied, so they stay
  inert rather than half-firing under OS dark mode.
- **The Notice** (`src/components/notice.tsx`) is the signature. Every public
  fact is a labelled row with a status marker: filled means checked, hollow
  means awaiting the owner. It carries provenance as structure rather than as a
  footnote, and it is used in the hero, on `/visit`, on `/contact` and on the
  owner checklist.
- **Motion** is one gesture — a staggered rise on the hero — and it is disabled
  entirely under `prefers-reduced-motion`.

Contrast ratios for every text/ground pairing are noted inline in
`src/app/globals.css`. All pass WCAG 2.2 AA.

## Contact form

`POST /api/inquiry`. No database — a message is emailed and this app keeps no
copy.

The form only renders when it can actually deliver: `RESEND_API_KEY`,
`INQUIRY_TO_EMAIL` and `INQUIRY_FROM_EMAIL` must all be set. Without them the
contact page shows the verified phone number instead. No public email address
for this business has been confirmed, so **the form ships switched off**. In
development it is enabled and prints submissions to the server console.

Defences, in order: honeypot field (accepted silently, delivered nowhere),
per-IP fixed-window rate limit, Zod validation and sanitisation on the server,
strict object shape, 1500-character cap.

Validation is shared. `src/lib/inquiry-schema.ts` runs in the browser for
instant inline errors and again on the server, which is the copy that decides.

### Rate limiting

`src/lib/rate-limit.ts` holds counters in process memory: 5 submissions per IP
per 10 minutes. Two honest limits:

- Serverless instances do not share memory, so the real ceiling is
  `5 × concurrent instances`.
- The IP comes from `x-forwarded-for`, which is only trustworthy because Vercel
  overwrites it. Behind a proxy that does not, a caller can spoof the header
  and sidestep the limit.

It raises the cost of spamming the form; it is not a defence against a
determined flood. Swap in Vercel KV or Upstash if this endpoint ever matters
more than it does today.

## SEO

- `Restaurant` structured data carrying only the four checked facts — type,
  name, postal address, telephone. No `openingHours`, `priceRange`,
  `servesCuisine`, `menu`, `image` or `aggregateRating`. Search engines present
  those as fact to customers, so an unverified one there does real damage.
- Canonical URLs, Open Graph and Twitter metadata, `sitemap.xml`, `robots.txt`.
- A generated Open Graph image (`src/app/opengraph-image.tsx`) — type and
  colour only, because there is no approved photograph of this restaurant.
- **If `NEXT_PUBLIC_SITE_URL` is unset, the site serves `noindex` and an empty
  sitemap.** An unconfigured deploy being indexed against localhost canonicals
  is worse than not being indexed.

## Analytics

None installed. No cookies, no third-party scripts, nothing collected.

`src/lib/analytics.ts` instruments the events worth having — CTA clicks, phone
taps, form starts, form success, outbound map clicks — and hands them to
`window.va` (Vercel Analytics) or `window.dataLayer` if either exists. With no
provider installed, `track()` is a no-op. No event carries personal data; the
only property is which surface the click came from.

To switch one on: `npm i @vercel/analytics`, render `<Analytics />` in
`src/app/layout.tsx`, and update `/privacy` to say so.

## Security headers

Set in `next.config.ts`: CSP, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy`, and HSTS in production.

`script-src` allows `'unsafe-inline'`. Next.js injects its hydration bootstrap
inline, and the strict alternative — per-request nonces from `proxy.ts` — forces
every page to render dynamically, costing the static generation this site's Core
Web Vitals depend on. The trade is defensible here because the site has no
user-generated content, no third-party scripts and no authenticated surface, so
there is no injection path for the policy to close.

**If you ever add a third-party script, an embed, or any user-supplied content,
switch to nonces before shipping it.** See the Next.js CSP guide bundled at
`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.

Two deliberate variations:

- Development relaxes `frame-ancestors`, `frame-src` and `X-Frame-Options` to
  same-origin, so the layout can be checked in iframes at phone widths.
- `upgrade-insecure-requests` and HSTS are sent only when
  `NEXT_PUBLIC_SITE_URL` is an `https://` origin. They are meaningless over
  plain HTTP, and sending them anyway makes the site unreachable — including a
  production build run locally for testing.

`allowedDevOrigins` is set to `127.0.0.1` in `next.config.ts`. Without it,
`next dev` refuses to serve its client chunks to any origin but `localhost`,
and the page renders with nothing interactive and no error in the browser
console. Add your machine's LAN IP there too if you test on a real phone.

## Deploying

Vercel, with preview and production environments.

1. Push the repository and import it into Vercel. The framework preset is
   detected; no build settings need changing.
2. Set environment variables for **both** Preview and Production:
   - `NEXT_PUBLIC_SITE_URL` — the deployment's own origin, no trailing slash.
     Set the preview one to the preview domain so previews stay `noindex`-free
     of wrong canonicals.
   - `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` — only once the
     owner has confirmed a public inbox. Leave unset otherwise; the site handles
     it.
3. Add the custom domain once the owner confirms which domain they own, then
   update `NEXT_PUBLIC_SITE_URL` to match and redeploy. Metadata is derived from
   that variable, so it must change with the domain.
4. Verify after deploying: `/sitemap.xml` lists real URLs, `/robots.txt`
   disallows `/owner-checklist` and `/api/`, the structured data validates in
   Google's Rich Results Test, and the response carries the security headers.

### Rolling back

Vercel keeps every deployment. To roll back: **Project → Deployments →** pick
the last known-good build → **⋯ → Promote to Production**. It is instant and
needs no rebuild.

If the bad state came from an environment variable rather than code, fix the
variable and redeploy — promoting an old build will not pick up new variables
on its own.

## Before launch

Nothing here is optional.

- [ ] Owner has approved every word of public copy
- [ ] Address and phone re-checked on the day (`SOURCES.md`)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real domain
- [ ] Structured data validated
- [ ] `npm run build` clean; Lighthouse run on the production URL
- [ ] Decide whether `/owner-checklist` and its footer link stay or go
- [ ] Privacy note reviewed against how the owner actually handles messages
# mitsuhiro
