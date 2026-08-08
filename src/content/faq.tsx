import Link from "next/link";

import { MapLink, PhoneText } from "@/components/actions";
import { business, formatAddress } from "@/content/business";

const checkedOn = new Date(business.address.checkedAt).toLocaleDateString("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * The questions a local actually types before deciding to go. Every answer is
 * either a checked fact or a plain admission that we do not have it yet,
 * followed by the one channel that does work.
 *
 * No FAQPage structured data is emitted for these: search engines surface
 * rich-result answers as statements of fact, and most of these answers are
 * "not confirmed yet".
 */
export const faqs = [
  {
    question: "Where exactly is Hiromitsu?",
    answer: (
      <>
        <p>
          {formatAddress(business.address.value)}. That address comes from a public
          listing checked on {checkedOn}.
        </p>
        <p>
          <MapLink location="faq" />
        </p>
      </>
    ),
  },
  {
    question: "What time does it open?",
    answer: (
      <p>
        Opening hours have not been confirmed, so none are published here. Call{" "}
        <PhoneText location="faq" /> before you set out and you will not waste the trip.
      </p>
    ),
  },
  {
    question: "What kind of food is it?",
    answer: (
      <p>
        The kitchen has not confirmed a description for publication, and this site will
        not guess at one. The restaurant can tell you directly on{" "}
        <PhoneText location="faq" />.
      </p>
    ),
  },
  {
    question: "Can I book a table or order ahead?",
    answer: (
      <p>
        Whether reservations and advance orders are taken has not been confirmed, so
        nothing on this site promises either. Calling <PhoneText location="faq" /> is the
        only channel we can point you to today.
      </p>
    ),
  },
  {
    question: "Do you deliver?",
    answer: (
      <p>
        Delivery and the area it might cover have not been confirmed. Please ask on{" "}
        <PhoneText location="faq" />.
      </p>
    ),
  },
  {
    question: "Is this the restaurant's official website?",
    answer: (
      <>
        <p>
          This site is being prepared as Hiromitsu&apos;s website and is not finished. The
          address and phone number on it were checked against a public listing on{" "}
          {checkedOn}. Everything else stays unpublished until the restaurant confirms it,
          which is why so much of this page says so.
        </p>
        <p>
          If you run Hiromitsu, <Link href="/owner-checklist">here is what we still need</Link>.
        </p>
      </>
    ),
  },
] as const;
