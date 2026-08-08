import type { Metadata } from "next";
import Link from "next/link";

import { Container, Eyebrow, PageHeader, Section, SectionHeading } from "@/components/layout";
import { FactNotice, Notice, NoticeList, Pending } from "@/components/notice";
import { CallLink, PhoneText } from "@/components/actions";
import { InquiryForm } from "@/components/inquiry-form";
import { isInquiryFormEnabled } from "@/lib/inquiry-delivery";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${business.name} on ${business.phone.value.display}. The address is confirmed; email and social channels are not.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const formEnabled = isInquiryFormEnabled();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="One channel that works"
        intro="The phone number below has been checked. No public email address or social page has been confirmed, so neither is listed here as though it were."
      >
        <div className="mt-10">
          <CallLink location="contact-header" variant="primary" size="wide" />
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            {/* ── Channels ─────────────────────────────────────────────── */}
            <div>
              <Eyebrow>Ways to reach the restaurant</Eyebrow>
              <NoticeList>
                <Notice label={business.phone.label} status="verified">
                  <PhoneText location="contact-notice" standalone />
                  <span className="mt-1 block text-sm text-ink-soft">
                    Who answers, and when, has not been confirmed.
                  </span>
                </Notice>
                <FactNotice fact={business.email} />
                <FactNotice fact={business.facebook} />
              </NoticeList>

              <div className="mt-10">
                <Pending>
                  No one has committed to a reply time for written messages. If your
                  question is time-sensitive — whether they are open now, whether there is
                  a table — call <PhoneText location="contact-expectations" /> instead of
                  writing.
                </Pending>
              </div>
            </div>

            {/* ── Form ─────────────────────────────────────────────────── */}
            <div>
              <Eyebrow>Send a message</Eyebrow>

              {formEnabled ? (
                <>
                  <SectionHeading className="text-2xl sm:text-3xl">
                    What happens to what you write
                  </SectionHeading>
                  {/* Each item is exactly two flex children — marker and text.
                      Leaving prose bare here would make every inline link its
                      own flex item and blow gaps through the sentence. */}
                  <ul className="mt-6 mb-10 space-y-2 text-[0.975rem] text-ink-soft">
                    <li className="flex gap-3">
                      <Marker />
                      <span>
                        Your message is emailed straight to the restaurant. This website
                        keeps no copy and has no database.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Marker />
                      <span>
                        Your name, email and message are used to reply to you and nothing
                        else.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Marker />
                      <span>
                        If sending fails you will be told plainly, and your text will
                        still be in the form.
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <Marker />
                      <span>
                        Details are in the{" "}
                        <Link
                          href="/privacy"
                          className="underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2"
                        >
                          privacy note
                        </Link>
                        .
                      </span>
                    </li>
                  </ul>

                  <InquiryForm />
                </>
              ) : (
                /*
                  Empty state with teeth. No public inbox has been confirmed for
                  this business, so there is nowhere to deliver a message. Rather
                  than render a form that would accept text and drop it, the page
                  says so and offers the channel that works.
                */
                <div className="border-l-2 border-pending bg-pending-wash/60 p-6 sm:p-8">
                  <h2 className="text-2xl">The message form is switched off</h2>
                  <p className="mt-4 text-pending-ink">
                    A form needs an inbox to deliver to, and no public email address for{" "}
                    {business.name} has been confirmed. Rather than take your message and
                    quietly lose it, this page does not offer one.
                  </p>
                  <p className="mt-4 text-pending-ink">
                    Call <PhoneText location="contact-form-disabled" />. It is checked and
                    it works.
                  </p>
                  <div className="mt-8">
                    <CallLink location="contact-form-disabled" variant="primary" size="wide" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Marker() {
  return (
    <span
      aria-hidden="true"
      className="mt-2.5 size-1.5 shrink-0 rounded-[1px] bg-brass"
    />
  );
}
