import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  tone = "paper",
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { tone?: "paper" | "sunk" | "shade" }) {
  return (
    <section
      className={cn(
        "py-16 sm:py-24",
        tone === "shade" && "on-shade bg-shade text-ink-inverse",
        tone === "sunk" && "bg-paper-sunk",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  className,
  children,
  tone = "paper",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "paper" | "shade";
}) {
  return (
    <p
      className={cn(
        "label mb-5 flex items-center gap-3",
        tone === "shade" ? "text-brass-light" : "text-brass-deep",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  className,
  children,
  as: Tag = "h2",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("text-3xl sm:text-4xl", className)}>{children}</Tag>
  );
}

/** Shared masthead for every page below the home page. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="on-shade bg-shade text-ink-inverse">
      <Container className="py-14 sm:py-20">
        <Eyebrow tone="shade">{eyebrow}</Eyebrow>
        <h1 className="text-4xl sm:text-6xl">{title}</h1>
        {intro ? (
          <p className="mt-6 max-w-2xl text-lg text-ink-inverse-soft text-pretty">{intro}</p>
        ) : null}
        {children}
      </Container>
    </header>
  );
}
