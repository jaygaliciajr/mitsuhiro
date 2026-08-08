import type { Metadata } from "next";
import Link from "next/link";

import { Container, Eyebrow, Section, SectionHeading } from "@/components/layout";
import { FactNotice, Notice, NoticeList, Pending } from "@/components/notice";
import { CallLink, CtaLink, MapLink, PhoneText } from "@/components/actions";
import { FaqSection } from "@/components/faq-section";
import { business, formatAddress } from "@/content/business";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const checkedOn = new Date(business.address.checkedAt).toLocaleDateString("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function HomePage() {
  const address = business.address.value;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────
          No photograph and no logo exist for this business, and inventing
          either would be a lie about a real place. So the hero is the sign
          itself: the name in type, and the facts that have actually been
          checked, in the order a hungry person on a phone needs them. */}
      <section className="on-shade bg-shade pt-10 pb-16 text-ink-inverse sm:pt-16 sm:pb-24">
        <Container>
          <Eyebrow tone="shade" className="animate-rise">
            {business.category.value} · {address.locality}, {address.region}
          </Eyebrow>

          {/* Sized to span most of the measure at every width without ever
              touching the edge — the name is the sign, so it fills the board. */}
          <h1 className="wordmark animate-rise text-[clamp(2.25rem,11.5vw,8.25rem)] [animation-delay:60ms]">
            {business.name}
          </h1>

          <p className="animate-rise mt-8 max-w-xl text-lg text-ink-inverse-soft [animation-delay:140ms] sm:text-xl">
            A restaurant on Congressional Road in {address.locality}. Here is what we can
            tell you for certain, and the number to call for the rest.
          </p>

          <div className="animate-rise mt-10 max-w-2xl [animation-delay:220ms]">
            <NoticeList tone="shade">
              <FactNotice
                fact={business.address}
                tone="shade"
                action={<MapLink location="hero" tone="shade" />}
              >
                {(value) => (
                  <>
                    <span className="block">{value.streetAddress}</span>
                    <span className="block">
                      {value.locality}, {value.region}
                    </span>
                  </>
                )}
              </FactNotice>

              <Notice label={business.phone.label} status="verified" tone="shade">
                <PhoneText location="hero-notice" standalone />
              </Notice>

              <FactNotice fact={business.hours} tone="shade" />
            </NoticeList>
          </div>

          <div className="animate-rise mt-10 flex flex-col gap-3 [animation-delay:300ms] sm:flex-row sm:items-center">
            <CtaLink href="/menu" location="hero" variant="primary" size="wide">
              View the menu
            </CtaLink>
            <CallLink location="hero" variant="outline-inverse" size="wide" />
          </div>
        </Container>
      </section>

      {/* ── What a visitor needs before going ─────────────────────────── */}
      <Section>
        <Container>
          <Eyebrow>Before you go</Eyebrow>
          <SectionHeading className="max-w-2xl">
            Three things worth asking before you make the trip
          </SectionHeading>
          <p className="mt-6 max-w-2xl text-ink-soft">
            The restaurant has not confirmed these for publication yet. Rather than guess,
            this site says so and points you at the one channel that is checked and
            working.
          </p>

          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                heading: "What is on today",
                body: business.menu.publicNote,
                href: "/menu",
                linkLabel: "About the menu",
              },
              {
                heading: "Whether to order ahead",
                body: business.ordering.publicNote,
                href: "/visit",
                linkLabel: "Visiting and ordering",
              },
              {
                heading: "When the doors open",
                body: business.hours.publicNote,
                href: "/visit",
                linkLabel: "Hours and location",
              },
            ].map((item) => (
              <li key={item.heading} className="border-t-2 border-ink pt-5">
                <h3 className="text-xl">{item.heading}</h3>
                <p className="mt-3 text-[0.975rem] text-pending-ink">{item.body}</p>
                <Link
                  href={item.href}
                  className="label mt-4 inline-flex min-h-tap items-center text-brass-deep underline decoration-brass/70 decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {item.linkLabel}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Location ───────────────────────────────────────────────────── */}
      <Section tone="sunk">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Eyebrow>Finding it</Eyebrow>
              <SectionHeading>On Congressional Road</SectionHeading>
              <p className="mt-6 text-ink-soft">
                The street address below is the one checked detail about where{" "}
                {business.name} is. No map is embedded here — the button runs a search
                against that exact address so you see the live map rather than a picture
                of one.
              </p>
              <div className="mt-8">
                <MapLink location="location-section" />
              </div>
            </div>

            <div>
              {/* Set in the sign voice, but deliberately smaller than the
                  wordmark — only the name gets to be the biggest thing here. */}
              <address className="wordmark text-[clamp(1.35rem,4.5vw,2rem)] leading-[1.08] text-ink not-italic">
                {address.streetAddress}
                <span className="block text-ink-soft">{address.locality}</span>
                <span className="block text-ink-soft">
                  {address.region}, {address.country}
                </span>
              </address>

              <div className="mt-8">
                <Pending>
                  {business.seating.publicNote} Ask on <PhoneText location="location-section" />{" "}
                  if you need to know about parking or step-free access.
                </Pending>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Trust ──────────────────────────────────────────────────────
          The brief allows verified proof only. There are no reviews, awards
          or testimonials to show, so the proof on offer is the provenance of
          the facts themselves. */}
      <Section tone="shade">
        <Container>
          <Eyebrow tone="shade">Where these details come from</Eyebrow>
          <SectionHeading className="max-w-3xl">
            Everything on this site is either checked or openly marked as unconfirmed
          </SectionHeading>

          <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
            <div className="space-y-4 text-ink-inverse-soft">
              <p>
                The address and phone number were taken from a public OpenStreetMap
                listing for a restaurant at {formatAddress(address)}, checked on{" "}
                {checkedOn}.
              </p>
              <p>
                Nothing else has been confirmed by the restaurant. So there are no hours,
                no dishes, no prices, no photographs and no reviews on this site — not
                placeholder versions of them, none at all.
              </p>
              <p>
                A filled square marks a fact that was checked. A hollow square marks one
                still waiting on the restaurant.
              </p>
            </div>

            <div>
              <NoticeList tone="shade">
                <Notice label="Checked" status="verified" tone="shade">
                  Street address, telephone number, and that this is a restaurant.
                </Notice>
                <Notice label="Not yet" status="unconfirmed" tone="shade">
                  Hours, menu, prices, ordering, delivery, payment, photographs, and the
                  story of the place.
                </Notice>
                <Notice label="Never" status="verified" tone="shade">
                  Invented reviews, ratings, stock food photography, or a logo we drew
                  ourselves.
                </Notice>
              </NoticeList>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div>
              <Eyebrow>Questions</Eyebrow>
              <SectionHeading>Asked and answered</SectionHeading>
            </div>
            <div>
              <FaqSection />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <Section tone="sunk" className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col gap-8 border-t-2 border-ink pt-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <SectionHeading className="text-2xl sm:text-3xl">
                The fastest way to get a real answer is still the phone
              </SectionHeading>
              <p className="mt-4 text-ink-soft">
                It is the one contact detail that has been checked. If you would rather
                write, the contact page explains what happens to a message.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <CallLink location="footer-cta" variant="primary" size="wide" />
              <CtaLink href="/contact" location="footer-cta" variant="outline" size="wide">
                Contact
              </CtaLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
