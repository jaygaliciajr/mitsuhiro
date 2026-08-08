import { business } from "@/content/business";
import { isSiteUrlConfigured, siteUrl } from "@/lib/site";

/**
 * Schema.org markup for the business.
 *
 * Deliberately minimal: it carries only the four things that have been checked
 * against a source — type, name, postal address and telephone. Search engines
 * surface this data directly, so publishing an unverified `openingHours`,
 * `priceRange`, `servesCuisine`, `menu`, `image` or `aggregateRating` here
 * would put a claim in front of customers that nobody has approved. Add each
 * property only as its fact moves to `verified` in content/business.ts.
 */
export function LocalBusinessSchema() {
  const address = business.address.value;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": business.schemaType,
    name: business.name,
    ...(isSiteUrlConfigured ? { url: siteUrl, "@id": `${siteUrl}#restaurant` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.locality,
      addressRegion: address.region,
      addressCountry: address.countryCode,
    },
    telephone: business.phone.value.e164,
  };

  return (
    <script
      type="application/ld+json"
      // Values come from a typed constant in this repo, not from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
