import type { Metadata } from "next";

import { Container, Eyebrow, PageHeader, Section, SectionHeading } from "@/components/layout";
import { Notice, NoticeList } from "@/components/notice";
import { PhoneText } from "@/components/actions";
import { isInquiryDeliveryConfigured } from "@/lib/inquiry-delivery";
import { isSiteUrlConfigured } from "@/lib/site";
import { business, formatAddress, openQuestions } from "@/content/business";

export const metadata: Metadata = {
  title: "What we still need",
  description:
    "Working checklist of everything the owner has to confirm before this site can launch.",
  // Internal working page. It should never appear in search results.
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/owner-checklist" },
};

const groups = [...new Set(openQuestions.map((item) => item.group))];

/**
 * Generated from the same content model that drives the public pages, so this
 * list cannot drift out of step with what the site is actually missing. Move a
 * fact to `verified` in content/business.ts and it disappears from here and
 * appears on the site in the same commit.
 */
export default function OwnerChecklistPage() {
  const outstanding = openQuestions.length;

  return (
    <>
      <PageHeader
        eyebrow="For the owner"
        title="What we still need from you"
        intro={`${outstanding} things are missing before this site can go live. Nothing on it is invented, which is why so much of it currently reads as blank.`}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <Eyebrow>Already confirmed</Eyebrow>
              <p className="text-ink-soft">
                Three details were checked against a public listing on{" "}
                {new Date(business.address.checkedAt).toLocaleDateString("en-PH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
                . Please confirm they are still right — they are the only things this site
                currently states as fact.
              </p>
              <div className="mt-8">
                <NoticeList>
                  <Notice label="Name" status="verified">
                    {business.name}
                  </Notice>
                  <Notice label="Type" status="verified">
                    {business.category.value}
                  </Notice>
                  <Notice label="Address" status="verified">
                    {formatAddress(business.address.value)}
                  </Notice>
                  <Notice label="Phone" status="verified">
                    <PhoneText location="owner-checklist" standalone />
                  </Notice>
                </NoticeList>
              </div>
            </div>

            <div className="space-y-14">
              {groups.map((group) => {
                const items = openQuestions.filter((item) => item.group === group);
                return (
                  <div key={group}>
                    <Eyebrow>{group}</Eyebrow>
                    <ul className="border-t border-rule">
                      {items.map((item) => (
                        <li
                          key={item.key}
                          className="grid gap-x-6 gap-y-1 border-b border-rule py-5 sm:grid-cols-[8.5rem_1fr]"
                        >
                          <p className="label flex items-center gap-2 pt-1 text-pending-ink">
                            <span
                              aria-hidden="true"
                              className="size-2 shrink-0 rounded-[1px] border border-pending"
                            />
                            {item.fact.label}
                          </p>
                          <p className="text-ink">{item.fact.request}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Technical items ─────────────────────────────────────────────
          Not the owner's job to write, but their decision to make, and the
          site cannot be launched without them. Read live from the running
          environment rather than from a list someone has to remember to update. */}
      <Section tone="shade">
        <Container>
          <Eyebrow tone="shade">Before launch</Eyebrow>
          <SectionHeading className="max-w-2xl">Decisions for whoever deploys this</SectionHeading>
          <p className="mt-6 max-w-2xl text-ink-inverse-soft">
            These read the environment this page is running in right now, so they are
            accurate for this deployment rather than for a snapshot someone took earlier.
          </p>

          <div className="mt-10 max-w-3xl">
            <NoticeList tone="shade">
              <Notice
                label="Domain"
                status={isSiteUrlConfigured ? "verified" : "unconfirmed"}
                tone="shade"
              >
                {isSiteUrlConfigured
                  ? "NEXT_PUBLIC_SITE_URL is set, so canonical URLs, the sitemap and Open Graph tags all point at the real domain."
                  : "No domain is configured (NEXT_PUBLIC_SITE_URL is unset). Until it is, this site tells search engines not to index it, so it cannot be found on Google."}
              </Notice>
              <Notice
                label="Enquiries"
                status={isInquiryDeliveryConfigured() ? "verified" : "unconfirmed"}
                tone="shade"
              >
                {isInquiryDeliveryConfigured()
                  ? "The contact form is connected to an inbox and is live."
                  : "No inbox is connected (RESEND_API_KEY, INQUIRY_TO_EMAIL and INQUIRY_FROM_EMAIL are unset), so the contact page shows the phone number instead of a form."}
              </Notice>
              <Notice label="Analytics" status="unconfirmed" tone="shade">
                No analytics provider is installed and no cookies are set. Decide whether
                you want visitor numbers at all — see README.md for how to switch one on.
              </Notice>
              <Notice label="Sign-off" status="unconfirmed" tone="shade">
                Name the person who approves the public wording, and re-check the address
                and phone number on the day of launch.
              </Notice>
            </NoticeList>
          </div>
        </Container>
      </Section>
    </>
  );
}
