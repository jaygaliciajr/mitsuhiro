import type { Metadata } from "next";
import Link from "next/link";

import { Container, Eyebrow, PageHeader, Section, SectionHeading } from "@/components/layout";
import { Notice, NoticeList, Pending } from "@/components/notice";
import { CallLink, MapLink } from "@/components/actions";
import { business, formatAddress } from "@/content/business";

export const metadata: Metadata = {
  title: "About",
  description: `What has actually been checked about ${business.name}, where those details came from, and what the restaurant has still to confirm.`,
  alternates: { canonical: "/about" },
};

const checkedOn = new Date(business.address.checkedAt).toLocaleDateString("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="What this site actually knows"
        intro="Most restaurant pages open with a story. This one cannot, because nobody at the restaurant has told it yet — so here is the honest version instead."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="prose-block max-w-xl text-ink-soft">
              <Eyebrow>The place</Eyebrow>
              <p>
                {business.name} is a restaurant at{" "}
                <span className="text-ink">{formatAddress(business.address.value)}</span>.
                That is the whole of what has been checked: the name, the fact that it
                serves food, the street address, and a phone number.
              </p>
              <p>
                Those came from a public OpenStreetMap listing, verified on {checkedOn}.
                They will be checked again before this site is launched properly, because
                a two-year-old address is worse than no address.
              </p>
              <p>
                Everything a restaurant page normally leads with — who runs it, how long
                it has been on Congressional Road, what the kitchen is proud of — is
                missing here because it has not been confirmed. It is not being withheld
                for effect.
              </p>
            </div>

            <div>
              <Eyebrow>The story</Eyebrow>
              <Pending>
                {business.story.request} Two or three sentences is enough, and they will
                replace this box.
              </Pending>

              <div className="mt-10">
                <Eyebrow>The record</Eyebrow>
                <NoticeList>
                  <Notice label="Name" status="verified">
                    {business.name}
                  </Notice>
                  <Notice label="Type" status="verified">
                    {business.category.value}
                  </Notice>
                  <Notice label="Source" status="verified">
                    {business.address.source}
                  </Notice>
                  <Notice label="Checked" status="verified">
                    <span className="tabular">{checkedOn}</span>
                  </Notice>
                  <Notice label="Confidence" status="unconfirmed">
                    Low, until the restaurant confirms these details itself.
                  </Notice>
                </NoticeList>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="shade">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow tone="shade">How this site is built</Eyebrow>
            <SectionHeading>Three rules it does not break</SectionHeading>

            <ul className="mt-10 space-y-8">
              {[
                {
                  heading: "Nothing is invented",
                  body: "No sample dishes, no plausible-sounding opening hours, no stock photography standing in for the room, no logo drawn on the restaurant's behalf. A blank space is more useful than a confident guess.",
                },
                {
                  heading: "Every fact carries its provenance",
                  body: "A filled square means it was checked against a source. A hollow square means the restaurant still has to confirm it. The distinction is visible on the page, not buried in a footnote.",
                },
                {
                  heading: "Search results stay clean",
                  body: "Hours, prices, ratings and cuisine are absent from this site's structured data too — so Google cannot show a customer a detail that nobody approved.",
                },
              ].map((rule) => (
                <li key={rule.heading} className="border-t border-rule-inverse pt-6">
                  <h3 className="text-xl">{rule.heading}</h3>
                  <p className="mt-3 text-ink-inverse-soft">{rule.body}</p>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-ink-inverse-soft">
              If you run {business.name},{" "}
              <Link
                href="/owner-checklist"
                className="text-brass-light underline decoration-brass-light/60 decoration-1 underline-offset-4 hover:decoration-2"
              >
                the full list of what is still needed
              </Link>{" "}
              is one page away.
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="sunk" className="py-14 sm:py-20">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-ink-soft">
              Two things on this site are checked and work today: the address and the
              phone number.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CallLink location="about-cta" variant="primary" size="wide" />
              <div className="flex items-center">
                <MapLink location="about-cta" />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
