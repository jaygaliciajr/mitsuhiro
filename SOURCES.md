# Source record — internal

Not published. This is the audit trail behind every fact the public site states.

The site's own copy of these facts lives in `src/content/business.ts`. If a fact
changes here, change it there in the same commit.

## Last check

**2026-08-08** (ISO `2026-08-08T04:04:51.728Z`)

## Verified facts and where they came from

| Fact | Value | Source | Confidence |
| --- | --- | --- | --- |
| Business name | Hiromitsu | OpenStreetMap public listing | Low |
| Category | Restaurant | OpenStreetMap public listing (`amenity=restaurant`) | Low |
| Street address | 5-1 Congressional Road, General Mariano Alvarez, Cavite, Philippines | OpenStreetMap public listing | Low |
| Public phone | +63 998 994 1412 | OpenStreetMap public listing | Low |

**Presence classification:** NEEDS REVIEW.
**Overall verification confidence:** Low — a single public directory source,
none of it confirmed by the business itself.

## Checked and found absent

- **Official website.** No verified independent website URL in the checked
  sources. Do not assume a domain exists.
- **Public email address.** None found. This is why the contact form ships
  switched off (see `src/lib/inquiry-delivery.ts`).
- **Official Facebook page.** None confirmed. Do not link a page found by
  searching the name — a same-name page in the same town is not proof.
- **Named contact person.** Not publicly available.
- **Opening hours, menu, prices, photographs, reviews, ratings.** None
  verified, none published, and none present in the site's structured data.

## Rules for this file

1. A fact reaches the public site only after it appears in the table above with
   a real source, or the owner confirms it in writing.
2. Re-check the address and phone number on the day of launch. A two-year-old
   address is worse than no address.
3. Note the date and source of every future change here. "Someone said so" is
   not a source.

## Re-check before launch

- [ ] Address still correct, and the business is still trading
- [ ] Phone number still answers, and it is the number the owner wants published
- [ ] Legal/registered business name confirmed
- [ ] Owner has approved every word of public copy
