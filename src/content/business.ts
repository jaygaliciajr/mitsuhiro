/**
 * Single source of truth for every business fact on this site.
 *
 * Every fact carries its provenance. `verified` facts came from a checked
 * source and may be published. `unconfirmed` facts have NO value — they render
 * as an honest, customer-facing note on the public site and as an action item
 * on /owner-checklist.
 *
 * Rule: never move a fact to `verified` without a real source and a re-check
 * date. Nothing on this site should assert something the owner has not approved.
 */

export type FactStatus = "verified" | "unconfirmed";

type FactBase = {
  /** Short uppercase label used by the Notice component and the owner checklist. */
  label: string;
  /** What the owner needs to supply or approve. Shown on /owner-checklist. */
  request: string;
};

export type VerifiedFact<T> = FactBase & {
  status: "verified";
  value: T;
  /** Where this came from. Kept in code so it can be re-checked before launch. */
  source: string;
  /** ISO date this fact was last checked. */
  checkedAt: string;
};

export type UnconfirmedFact = FactBase & {
  status: "unconfirmed";
  /**
   * Customer-facing sentence shown in place of the missing value. Must be
   * useful to a visitor and must not imply a fact we do not have.
   */
  publicNote: string;
};

export type Fact<T = string> = VerifiedFact<T> | UnconfirmedFact;

export function isVerified<T>(fact: Fact<T>): fact is VerifiedFact<T> {
  return fact.status === "verified";
}

const CHECKED_AT = "2026-08-08";
const OSM_SOURCE =
  "OpenStreetMap public listing (restaurant at 5-1 Congressional Road, General Mariano Alvarez, Cavite)";

export type PostalAddress = {
  streetAddress: string;
  locality: string;
  region: string;
  country: string;
  countryCode: string;
};

const address: PostalAddress = {
  streetAddress: "5-1 Congressional Road",
  locality: "General Mariano Alvarez",
  region: "Cavite",
  country: "Philippines",
  countryCode: "PH",
};

/** Digits-only form for `tel:` links. */
const phoneE164 = "+639989941412";
const phoneDisplay = "+63 998 994 1412";

export const business = {
  name: "Hiromitsu",

  /**
   * Schema.org type. `Restaurant` is a LocalBusiness subtype and is the one
   * verified categorisation we have. Do NOT narrow this to a cuisine-specific
   * type — the cuisine is not verified.
   */
  schemaType: "Restaurant" as const,

  legalName: {
    label: "Registered business name",
    request:
      "Confirm the exact registered/legal business name, in case it differs from the trading name 'Hiromitsu'.",
    status: "unconfirmed",
    publicNote: "",
  } satisfies UnconfirmedFact,

  category: {
    label: "Category",
    request: "Confirm how you want the business described in one word.",
    status: "verified",
    value: "Restaurant",
    source: OSM_SOURCE,
    checkedAt: CHECKED_AT,
  } satisfies VerifiedFact<string>,

  address: {
    label: "Where",
    request:
      "Confirm the street address exactly as you want it published, plus any landmark that helps people find the door.",
    status: "verified",
    value: address,
    source: OSM_SOURCE,
    checkedAt: CHECKED_AT,
  } satisfies VerifiedFact<PostalAddress>,

  phone: {
    label: "Call",
    request:
      "Confirm this is the right number for the public to call, and who answers it.",
    status: "verified",
    value: { display: phoneDisplay, e164: phoneE164 },
    source: OSM_SOURCE,
    checkedAt: CHECKED_AT,
  } satisfies VerifiedFact<{ display: string; e164: string }>,

  hours: {
    label: "Hours",
    request:
      "Confirm opening hours for each day, plus holiday closures and last order times.",
    status: "unconfirmed",
    publicNote: "Opening hours are not confirmed yet. Please call before you visit.",
  } satisfies UnconfirmedFact,

  email: {
    label: "Email",
    request:
      "Confirm a public inbox for enquiries, and who monitors it. The enquiry form stays switched off until this exists.",
    status: "unconfirmed",
    publicNote: "No public email address is confirmed yet.",
  } satisfies UnconfirmedFact,

  facebook: {
    label: "Facebook",
    request:
      "Send the official Facebook page URL if there is one, so we can link it rather than guess.",
    status: "unconfirmed",
    publicNote: "No official social page is confirmed yet.",
  } satisfies UnconfirmedFact,

  cuisine: {
    label: "Kind of food",
    request:
      "Describe what you serve in a sentence. Nothing about the food appears on this site until you do.",
    status: "unconfirmed",
    publicNote: "What the kitchen serves has not been confirmed for publication yet.",
  } satisfies UnconfirmedFact,

  menu: {
    label: "Menu",
    request:
      "Send the current menu with dish names, short descriptions and prices, and say which items are always available.",
    status: "unconfirmed",
    publicNote:
      "The menu is not published yet. Call the restaurant and they can tell you what is on today.",
  } satisfies UnconfirmedFact,

  prices: {
    label: "Prices",
    request:
      "Confirm prices and whether they include tax and service. No price appears here until you approve it.",
    status: "unconfirmed",
    publicNote: "Prices are not published yet.",
  } satisfies UnconfirmedFact,

  ordering: {
    label: "Ordering",
    request:
      "Tell us how people actually order: walk in only, phone ahead, a delivery app, or something else. We will not promise a channel you do not run.",
    status: "unconfirmed",
    publicNote:
      "How to order ahead has not been confirmed. Calling the restaurant is the one channel we can point you to.",
  } satisfies UnconfirmedFact,

  reservations: {
    label: "Reservations",
    request:
      "Confirm whether you take reservations, for what group sizes, and how far ahead.",
    status: "unconfirmed",
    publicNote: "Whether reservations are taken has not been confirmed.",
  } satisfies UnconfirmedFact,

  delivery: {
    label: "Delivery",
    request:
      "Confirm whether you deliver, the area you cover, and any minimum order.",
    status: "unconfirmed",
    publicNote: "Delivery and its service area have not been confirmed.",
  } satisfies UnconfirmedFact,

  payment: {
    label: "Payment",
    request: "Confirm which payment methods you accept (cash, cards, e-wallets).",
    status: "unconfirmed",
    publicNote: "Accepted payment methods have not been confirmed.",
  } satisfies UnconfirmedFact,

  seating: {
    label: "Seating",
    request:
      "Confirm roughly how many people you seat, and whether there is outdoor seating, parking, or step-free access.",
    status: "unconfirmed",
    publicNote: "Seating, parking and access details have not been confirmed.",
  } satisfies UnconfirmedFact,

  story: {
    label: "About",
    request:
      "Two or three sentences in your own words: who runs the place, how long it has been open, what you want people to know.",
    status: "unconfirmed",
    publicNote: "",
  } satisfies UnconfirmedFact,

  logo: {
    label: "Logo",
    request:
      "Send the logo as SVG or high-resolution PNG. Until then the site uses the name set in type — we will not draw a mark for you.",
    status: "unconfirmed",
    publicNote: "",
  } satisfies UnconfirmedFact,

  photos: {
    label: "Photos",
    request:
      "Send photos you own and approve — the room, the counter, the food. Stock or AI images will not be used to stand in for your restaurant.",
    status: "unconfirmed",
    publicNote: "",
  } satisfies UnconfirmedFact,

  privacyContact: {
    label: "Privacy contact",
    request:
      "Name the person or inbox that handles data requests, and how long you want enquiry messages kept.",
    status: "unconfirmed",
    publicNote: "",
  } satisfies UnconfirmedFact,
} as const;

/** Facts shown as the notice stack in the hero and on the visit page. */
export const keyFacts = [business.address, business.phone, business.hours] as const;

/**
 * Everything the owner still has to confirm, in the order we need it.
 * Drives /owner-checklist and DISCOVERY-CHECKLIST.md.
 */
export const openQuestions = [
  { key: "menu", group: "Before anything else", fact: business.menu },
  { key: "cuisine", group: "Before anything else", fact: business.cuisine },
  { key: "hours", group: "Before anything else", fact: business.hours },
  { key: "ordering", group: "Before anything else", fact: business.ordering },
  { key: "prices", group: "Menu detail", fact: business.prices },
  { key: "reservations", group: "Menu detail", fact: business.reservations },
  { key: "delivery", group: "Menu detail", fact: business.delivery },
  { key: "payment", group: "Menu detail", fact: business.payment },
  { key: "seating", group: "Visiting", fact: business.seating },
  { key: "email", group: "Contact", fact: business.email },
  { key: "facebook", group: "Contact", fact: business.facebook },
  { key: "privacyContact", group: "Contact", fact: business.privacyContact },
  { key: "legalName", group: "Brand", fact: business.legalName },
  { key: "story", group: "Brand", fact: business.story },
  { key: "logo", group: "Brand", fact: business.logo },
  { key: "photos", group: "Brand", fact: business.photos },
] as const;

export function formatAddress(a: PostalAddress, separator = ", ") {
  return [a.streetAddress, a.locality, a.region, a.country].join(separator);
}

/** Maps search URL built from the verified address. No map tiles are embedded. */
export function mapsSearchUrl() {
  const query = `${business.name}, ${formatAddress(business.address.value)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const telHref = `tel:${business.phone.value.e164}`;
