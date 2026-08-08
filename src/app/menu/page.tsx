import type { Metadata } from "next";

import { Container, Eyebrow, Section, SectionHeading } from "@/components/layout";
import { PageHeader } from "@/components/layout";
import { FactNotice, NoticeList, Pending } from "@/components/notice";
import { CallLink, CtaLink, PhoneText } from "@/components/actions";
import { business } from "@/content/business";

export const metadata: Metadata = {
  title: "Menu",
  description: `The menu for ${business.name} is not published yet. Call ${business.phone.value.display} to ask what is on today.`,
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Menu"
        title="Not published yet"
        intro="No dish, description or price appears on this page until the restaurant sends its menu and approves it. Inventing one would mean lying to you about a real kitchen."
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CallLink location="menu-header" variant="primary" size="wide" />
          <CtaLink href="/visit" location="menu-header" variant="outline-inverse" size="wide">
            Visiting and ordering
          </CtaLink>
        </div>
      </PageHeader>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <Eyebrow>What we know</Eyebrow>
              <SectionHeading>Only that there is a kitchen</SectionHeading>
              <p className="mt-6 text-ink-soft">
                The public listing this site was built from records one thing about the
                food: that {business.name} is a restaurant. It says nothing about what
                that kitchen cooks, and no one has confirmed it since.
              </p>
              <p className="mt-4 text-ink-soft">
                So the fastest route to a real answer is <PhoneText location="menu" />. Ask
                what is on today.
              </p>
            </div>

            <div>
              <NoticeList>
                <FactNotice fact={business.menu} />
                <FactNotice fact={business.cuisine} />
                <FactNotice fact={business.prices} />
              </NoticeList>
            </div>
          </div>
        </Container>
      </Section>

      {/*
        The empty state for the menu itself. It shows the shape the page will
        take once the owner sends real content, without pretending any of it
        exists — no sample dishes, no placeholder prices, no greyed-out rows
        that could be mistaken for a loading menu.
      */}
      <Section tone="sunk">
        <Container>
          <Eyebrow>When it arrives</Eyebrow>
          <SectionHeading className="max-w-2xl">How this page will be built</SectionHeading>
          <p className="mt-6 max-w-2xl text-ink-soft">
            Send the menu and it becomes sections, each with dish names, a short line of
            description and a price. Nothing else needs to change.
          </p>

          <ol className="mt-12 grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-3">
            {[
              {
                step: "First",
                heading: "The list itself",
                body: "Section names, dish names, and what each one is in a line.",
              },
              {
                step: "Then",
                heading: "Prices",
                body: "Confirmed and marked as including tax and service, or not.",
              },
              {
                step: "Last",
                heading: "Your photographs",
                body: "Only images the restaurant owns. Nothing generated, nothing stock.",
              },
            ].map((item) => (
              <li key={item.step} className="bg-paper p-6 sm:p-8">
                <p className="label text-brass-deep">{item.step}</p>
                <h3 className="mt-4 text-xl">{item.heading}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ol>

          <Pending className="mt-10 max-w-3xl">
            Until then this page stays exactly as it is. An empty menu is honest; a
            fabricated one is not.
          </Pending>
        </Container>
      </Section>
    </>
  );
}
