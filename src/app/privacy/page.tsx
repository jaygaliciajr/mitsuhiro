import type { Metadata } from "next";
import Link from "next/link";

import { Container, PageHeader, Section } from "@/components/layout";
import { Pending } from "@/components/notice";
import { PhoneText } from "@/components/actions";
import { isInquiryFormEnabled } from "@/lib/inquiry-delivery";
import { business } from "@/content/business";
import { MESSAGE_MAX } from "@/lib/inquiry-schema";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What the ${business.name} website does with the details you type into its contact form, how long they are kept, and who to ask about them.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const formEnabled = isInquiryFormEnabled();

  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="What this site does with your details"
        intro="Short, because this site collects very little — and what it does collect never lands in a database."
      />

      <Section>
        <Container>
          <div className="prose-block max-w-2xl text-ink-soft">
            <Clause title="What is collected">
              <p>
                Only what you type into the contact form: your name, your email address,
                an optional phone number, and your message (up to {MESSAGE_MAX}{" "}
                characters). Nothing is collected from you when you simply read these
                pages.
              </p>
              {!formEnabled ? (
                <p>
                  The contact form is switched off at the moment, so today the answer is
                  nothing at all.
                </p>
              ) : null}
            </Clause>

            <Clause title="Why">
              <p>
                So the restaurant can reply to you. That is the only purpose. Your details
                are not used for marketing, are not profiled, and are not sold or shared
                with anyone beyond delivering your message.
              </p>
            </Clause>

            <Clause title="Where it goes, and for how long">
              <p>
                A submitted message is emailed to the restaurant and this website keeps no
                copy of it. There is no database behind this site and no record of your
                message on the server — it exists only in the restaurant&apos;s inbox,
                where it is kept for as long as the restaurant keeps its email.
              </p>
              <Pending>
                {business.privacyContact.request} A definite retention period will replace
                this box once the restaurant sets one.
              </Pending>
            </Clause>

            <Clause title="Cookies and tracking">
              <p>
                This site sets no cookies and runs no analytics or advertising scripts. It
                does not track you between visits or across other sites.
              </p>
              <p>
                Two buttons take you somewhere else: the map link opens Google Maps, and a
                phone link hands the number to your device. Once you follow a link to
                Google, Google&apos;s own privacy terms apply — this site has no say in
                that.
              </p>
            </Clause>

            <Clause title="Server logs">
              <p>
                The site is hosted on Vercel, whose servers keep short-lived operational
                logs of requests, including IP addresses. Those are Vercel&apos;s
                infrastructure logs rather than something this site records or reads. The
                contact form counts submissions per IP address in memory for a few minutes
                to blunt spam; that count is never written down and never attached to your
                message.
              </p>
            </Clause>

            <Clause title="Your rights">
              <p>
                Under the Philippines&apos; Data Privacy Act of 2012 you may ask what
                personal data is held about you, ask for it to be corrected, and ask for it
                to be deleted.
              </p>
              <Pending>
                {business.privacyContact.request} Until the restaurant names that contact,
                requests should go by phone to <PhoneText location="privacy" />.
              </Pending>
            </Clause>

            <Clause title="Changes">
              <p>
                This note will change as the restaurant confirms its policies. It is a
                working draft, not a finished legal document, and the restaurant should
                have it reviewed before this site launches. Everything it describes about
                the site&apos;s own behaviour is accurate today.
              </p>
              <p>
                Questions about anything here can go to <PhoneText location="privacy" />,
                or through the <Link href="/contact">contact page</Link>.
              </p>
            </Clause>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
