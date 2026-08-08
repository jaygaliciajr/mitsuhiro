import type { Metadata } from "next";

import { Container, Eyebrow, PageHeader, Section, SectionHeading } from "@/components/layout";
import { FactNotice, Notice, NoticeList, Pending } from "@/components/notice";
import { CallLink, MapLink, PhoneText } from "@/components/actions";
import { business, formatAddress } from "@/content/business";

export const metadata: Metadata = {
  title: "Visit & order",
  description: `${business.name} is at ${formatAddress(
    business.address.value,
  )}. Opening hours and ordering are not confirmed yet — call ${business.phone.value.display} to check.`,
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  const address = business.address.value;

  return (
    <>
      <PageHeader
        eyebrow="Visiting"
        title="Where it is, and how to reach it"
        intro="The address and the phone number have been checked. Hours, ordering, delivery and payment have not — so this page tells you which is which rather than filling the gaps."
      >
        <div className="mt-10">
          <CallLink location="visit-header" variant="primary" size="wide" />
        </div>
      </PageHeader>

      {/* ── Address ─────────────────────────────────────────────────────── */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Eyebrow>The address</Eyebrow>
              <address className="wordmark text-[clamp(1.5rem,5vw,2.4rem)] leading-[1.08] text-ink not-italic">
                {address.streetAddress}
                <span className="block text-ink-soft">{address.locality}</span>
                <span className="block text-ink-soft">
                  {address.region}, {address.country}
                </span>
              </address>
              <div className="mt-8">
                <MapLink location="visit" />
              </div>
              <p className="mt-6 max-w-md text-sm text-ink-soft">
                That button searches for this exact address on Google Maps. No map is
                embedded on this page, so nothing here can drift out of date or drop a pin
                in the wrong place.
              </p>
            </div>

            <div>
              <Eyebrow>Getting in</Eyebrow>
              <NoticeList>
                <FactNotice fact={business.hours} />
                <FactNotice fact={business.seating} />
                <Notice label={business.phone.label} status="verified">
                  <PhoneText location="visit-notice" standalone />
                  <span className="mt-1 block text-sm text-ink-soft">
                    The one channel on this site that is checked and working.
                  </span>
                </Notice>
              </NoticeList>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Ordering ────────────────────────────────────────────────────── */}
      <Section tone="shade">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <Eyebrow tone="shade">Ordering</Eyebrow>
              <SectionHeading>Nothing here promises a service that may not exist</SectionHeading>
              <p className="mt-6 text-ink-inverse-soft">
                Booking, ordering ahead, delivery and payment methods have not been
                confirmed by the restaurant. A website that offers a service the kitchen
                does not actually run wastes the customer&apos;s time and the
                restaurant&apos;s.
              </p>
              <p className="mt-4 text-ink-inverse-soft">
                So there is one button on this page, and it dials a number that was
                checked.
              </p>
              <div className="mt-8">
                <CallLink location="visit-ordering" variant="primary" size="wide" />
              </div>
            </div>

            <div>
              <NoticeList tone="shade">
                <FactNotice fact={business.ordering} tone="shade" />
                <FactNotice fact={business.reservations} tone="shade" />
                <FactNotice fact={business.delivery} tone="shade" />
                <FactNotice fact={business.payment} tone="shade" />
              </NoticeList>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Access ──────────────────────────────────────────────────────── */}
      <Section tone="sunk" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading className="text-2xl sm:text-3xl">
              If access matters for your visit
            </SectionHeading>
            <Pending className="mt-6">
              Step-free access, parking and toilet facilities have not been confirmed, and
              guessing about accessibility is worse than saying nothing. Please call{" "}
              <PhoneText location="visit-access" /> and ask before you travel.
            </Pending>
          </div>
        </Container>
      </Section>
    </>
  );
}
