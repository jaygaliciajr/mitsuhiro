"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/layout";
import { CallLink } from "@/components/actions";
import { cn } from "@/lib/utils";
import { navRoutes } from "@/lib/site";
import { business } from "@/content/business";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="on-shade sticky top-0 z-50 bg-shade text-ink-inverse">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-3 sm:min-h-20">
          <Link
            href="/"
            className="wordmark -my-1 flex min-h-tap items-center py-1 text-xl text-ink-inverse sm:text-2xl"
            aria-label={`${business.name} — home`}
          >
            {business.name}
          </Link>

          <div className="flex items-center gap-2">
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {navRoutes.map((route) => {
                  const active = pathname === route.href;
                  return (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "label flex min-h-tap items-center rounded-sm px-3 transition-colors",
                          active
                            ? "text-brass-light"
                            : "text-ink-inverse-soft hover:text-ink-inverse",
                        )}
                      >
                        {route.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <CallLink location="header" variant="outline-inverse" compact />

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="on-shade flex size-tap items-center justify-center rounded-sm border border-ink-inverse/35 text-ink-inverse transition-colors hover:border-brass-light hover:text-brass-light lg:hidden"
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </Container>

      <div
        id="site-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-rule-inverse lg:hidden"
      >
        <Container>
          <nav aria-label="Main" className="py-3">
            <ul>
              {navRoutes.map((route) => {
                const active = pathname === route.href;
                return (
                  <li key={route.href} className="border-b border-rule-inverse last:border-0">
                    <Link
                      href={route.href}
                      aria-current={active ? "page" : undefined}
                      // Close on the way out, so the panel never survives a navigation.
                      onClick={() => setOpen(false)}
                      className={cn(
                        "label flex min-h-tap items-center transition-colors",
                        active ? "text-brass-light" : "text-ink-inverse hover:text-brass-light",
                      )}
                    >
                      {route.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
