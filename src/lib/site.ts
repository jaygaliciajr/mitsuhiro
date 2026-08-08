import { business, formatAddress } from "@/content/business";

/**
 * The canonical origin. There is no verified domain for this business yet, so
 * this MUST be set in the deployment environment before launch.
 *
 * When it is missing we fall back to localhost AND switch the site to
 * noindex (see app/robots.ts). An unconfigured deploy should never get indexed
 * with wrong canonical URLs.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteUrl = configured || "http://localhost:3000";
export const isSiteUrlConfigured = Boolean(configured);

export const siteName = business.name;

/**
 * Description used for <meta name="description">, Open Graph and search
 * results. Built only from verified facts: name, category, address.
 */
export const siteDescription = `${business.name} is a restaurant at ${formatAddress(
  business.address.value,
)}. Find the address, call ahead on ${business.phone.value.display}, and see what has been confirmed so far.`;

export const routes = [
  { href: "/", label: "Home", nav: false },
  { href: "/menu", label: "Menu", nav: true },
  { href: "/visit", label: "Visit & order", nav: true },
  { href: "/about", label: "About", nav: true },
  { href: "/contact", label: "Contact", nav: true },
  { href: "/privacy", label: "Privacy", nav: false },
] as const;

export const navRoutes = routes.filter((r) => r.nav);
