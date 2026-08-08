"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track, type AnalyticsEvent, type EventProps } from "@/lib/analytics";
import { business, mapsSearchUrl, telHref } from "@/content/business";

/** Internal CTA that reports a conversion event. */
export function CtaLink({
  href,
  location,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  location: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} onClick={() => track("cta_click", { location })}>
        {children}
      </Link>
    </Button>
  );
}

/**
 * The one channel that is verified and works today. Rendered as a real
 * `tel:` link so it is tappable on a phone and copyable on a laptop.
 */
export function CallLink({
  location,
  variant = "outline",
  size,
  className,
  compact = false,
}: {
  location: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  /** Hide the number below `sm` — used in the sticky header at 320px. */
  compact?: boolean;
}) {
  const number = business.phone.value.display;
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={telHref} onClick={() => track("phone_tap", { location })}>
        <Phone aria-hidden="true" />
        {compact ? (
          <>
            <span className="sm:hidden">Call</span>
            <span className="sr-only sm:hidden">{business.name} on {number}</span>
            <span className="hidden sm:inline tabular">{number}</span>
          </>
        ) : (
          <span className="tabular">{number}</span>
        )}
      </a>
    </Button>
  );
}

/**
 * The number as a link.
 *
 * Inline by default, for use inside a sentence — WCAG 2.2's target-size rule
 * exempts links within a block of text, and padding a word mid-paragraph would
 * wreck the line. Pass `standalone` wherever it sits on its own, which puts it
 * back over the 44px minimum.
 */
export function PhoneText({
  location,
  standalone = false,
}: {
  location: string;
  standalone?: boolean;
}) {
  return (
    <a
      href={telHref}
      onClick={() => track("phone_tap", { location })}
      className={cn(
        "tabular font-medium whitespace-nowrap underline decoration-brass decoration-1 underline-offset-4 hover:decoration-2",
        standalone && "inline-flex min-h-tap items-center text-lg",
      )}
    >
      {business.phone.value.display}
    </a>
  );
}

/**
 * Outbound link to a maps search built from the verified address. No map tiles
 * are embedded and no pin is placed for the visitor — the search is run against
 * the address we actually checked.
 */
export function MapLink({
  location,
  className,
  tone = "paper",
}: {
  location: string;
  className?: string;
  tone?: "paper" | "shade";
}) {
  return (
    <OutboundLink
      href={mapsSearchUrl()}
      event="outbound_map"
      location={location}
      className={className}
      tone={tone}
    >
      Open in Maps
    </OutboundLink>
  );
}

export function OutboundLink({
  href,
  event,
  location,
  className,
  tone = "paper",
  children,
}: {
  href: string;
  event: AnalyticsEvent;
  location: EventProps["location"];
  className?: string;
  tone?: "paper" | "shade";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(event, { location })}
      className={cn(
        "label inline-flex min-h-tap items-center gap-1.5 underline decoration-1 underline-offset-4 hover:decoration-2",
        tone === "shade"
          ? "text-brass-light decoration-brass-light/60"
          : "text-brass-deep decoration-brass/70",
        className,
      )}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
