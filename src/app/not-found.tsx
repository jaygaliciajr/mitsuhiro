import Link from "next/link";

import { Container, Eyebrow } from "@/components/layout";
import { CallLink } from "@/components/actions";
import { navRoutes } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="on-shade bg-shade py-20 text-ink-inverse sm:py-32">
      <Container>
        <Eyebrow tone="shade">Page not found</Eyebrow>
        <h1 className="wordmark text-[clamp(2.5rem,11vw,6rem)]">Nothing here</h1>
        <p className="mt-6 max-w-lg text-lg text-ink-inverse-soft">
          That address does not match a page on this site. These do.
        </p>

        <nav aria-label="Site" className="mt-10">
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            {navRoutes.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="label flex min-h-tap items-center text-ink-inverse underline decoration-brass-light/60 decoration-1 underline-offset-4 hover:text-brass-light hover:decoration-2"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10">
          <CallLink location="not-found" variant="primary" size="wide" />
        </div>
      </Container>
    </section>
  );
}
