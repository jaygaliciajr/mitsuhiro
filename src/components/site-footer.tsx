import Link from "next/link";

import { Container } from "@/components/layout";
import { MapLink, PhoneText } from "@/components/actions";
import { business } from "@/content/business";
import { navRoutes } from "@/lib/site";

const checkedOn = new Date(business.address.checkedAt).toLocaleDateString("en-PH", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function SiteFooter() {
  const address = business.address.value;

  return (
    <footer className="on-shade mt-auto bg-shade-deep pt-14 pb-10 text-ink-inverse">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="wordmark text-3xl sm:text-4xl">{business.name}</p>
            <address className="mt-5 space-y-1 text-ink-inverse-soft not-italic">
              <span className="block">{address.streetAddress}</span>
              <span className="block">
                {address.locality}, {address.region}
              </span>
              <span className="block">{address.country}</span>
              <span className="mt-3 block text-ink-inverse">
                <PhoneText location="footer" />
              </span>
            </address>
            <MapLink location="footer" tone="shade" className="mt-1" />
          </div>

          <nav aria-label="Footer">
            <h2 className="label text-brass-light">Pages</h2>
            <ul className="mt-4 space-y-1">
              {navRoutes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="flex min-h-tap items-center text-ink-inverse-soft transition-colors hover:text-ink-inverse"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-brass-light">This site</h2>
            <ul className="mt-4 space-y-1">
              <li>
                <Link
                  href="/privacy"
                  className="flex min-h-tap items-center text-ink-inverse-soft transition-colors hover:text-ink-inverse"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/owner-checklist"
                  className="flex min-h-tap items-center text-ink-inverse-soft transition-colors hover:text-ink-inverse"
                >
                  What we still need
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-rule-inverse pt-6 text-sm text-ink-inverse-soft">
          <p>
            The address and phone number above were last checked on {checkedOn}. Hours,
            menu, prices and ordering are not confirmed yet and are marked as such
            throughout this site.
          </p>
          <p className="mt-3">© {new Date().getFullYear()} {business.name}</p>
        </div>
      </Container>
    </footer>
  );
}
