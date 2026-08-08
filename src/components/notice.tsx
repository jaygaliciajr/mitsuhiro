import * as React from "react";

import { cn } from "@/lib/utils";
import { type Fact, isVerified } from "@/content/business";

/*
  ── The Notice ───────────────────────────────────────────────────────────
  The one structural device this site repeats. Every public fact is a labelled
  row with a status marker: a filled square when we checked it, a hollow square
  when the owner still has to confirm it.

  The marker is not decoration — it is the difference between what this site
  knows and what it is waiting on, which is the honest state of the project.
  Unconfirmed rows always carry a sentence a customer can act on, so the marker
  never has to be decoded to use the page.
*/

type Tone = "paper" | "shade";

export function NoticeList({
  tone = "paper",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <dl
      data-tone={tone}
      className={cn(
        "group/notices border-t",
        tone === "shade" ? "border-rule-inverse" : "border-rule",
        className,
      )}
    >
      {children}
    </dl>
  );
}

export function Notice({
  label,
  status,
  children,
  action,
  tone = "paper",
}: {
  label: string;
  status: "verified" | "unconfirmed";
  children: React.ReactNode;
  /** Optional trailing link, e.g. "Open in Maps". */
  action?: React.ReactNode;
  tone?: Tone;
}) {
  const onShade = tone === "shade";
  const pending = status === "unconfirmed";

  return (
    <div
      className={cn(
        "grid gap-x-6 gap-y-1 border-b py-4 sm:grid-cols-[8.5rem_1fr] sm:py-5",
        onShade ? "border-rule-inverse" : "border-rule",
      )}
    >
      <dt
        className={cn(
          // Aligned to the first line of the value, not centred against the
          // whole row — a two-line address should not float its label.
          "label flex items-start gap-2 pt-[0.45rem]",
          onShade
            ? pending
              ? "text-ink-inverse-soft"
              : "text-brass-light"
            : pending
              ? "text-pending-ink"
              : "text-brass-deep",
        )}
      >
        <Marker status={status} onShade={onShade} />
        {label}
      </dt>
      <dd
        className={cn(
          "text-pretty",
          pending
            ? onShade
              ? "text-ink-inverse-soft"
              : "text-pending-ink"
            : onShade
              ? "text-ink-inverse"
              : "text-ink",
        )}
      >
        {children}
        {action ? <div className="mt-2">{action}</div> : null}
      </dd>
    </div>
  );
}

/**
 * Filled = checked against a source. Hollow = awaiting the owner.
 * Decorative: every row states its status in words as well.
 */
function Marker({ status, onShade }: { status: Fact["status"]; onShade: boolean }) {
  const verified = status === "verified";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-[0.2rem] size-2 shrink-0 rounded-[1px]",
        verified
          ? onShade
            ? "bg-brass-light"
            : "bg-brass"
          : onShade
            ? "border border-ink-inverse-soft"
            : "border border-pending",
      )}
    />
  );
}

/**
 * Renders a Fact straight from the content model, so a fact can never be
 * published without its provenance travelling with it.
 */
export function FactNotice<T>({
  fact,
  tone = "paper",
  action,
  children,
}: {
  fact: Fact<T>;
  tone?: Tone;
  action?: React.ReactNode;
  /** How to render a verified value. Omit for facts whose value is a string. */
  children?: (value: T) => React.ReactNode;
}) {
  return (
    <Notice
      label={fact.label}
      status={fact.status}
      tone={tone}
      action={isVerified(fact) ? action : undefined}
    >
      {isVerified(fact)
        ? children
          ? children(fact.value)
          : String(fact.value)
        : fact.publicNote}
    </Notice>
  );
}

/**
 * Inline "we don't know this yet" marker for use inside prose, where a full
 * Notice row would be too heavy.
 */
export function Pending({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex gap-3 border-l-2 border-pending bg-pending-wash/60 px-4 py-3 text-[0.95rem] text-pending-ink",
        className,
      )}
    >
      <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-[1px] border border-pending" />
      <span>{children}</span>
    </p>
  );
}
