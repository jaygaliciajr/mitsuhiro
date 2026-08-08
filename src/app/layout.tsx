import type { Metadata } from "next";
import { Archivo, Literata } from "next/font/google";

import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LocalBusinessSchema } from "@/components/structured-data";
import { isSiteUrlConfigured, siteDescription, siteName, siteUrl } from "@/lib/site";

/*
  Two families, three roles. Archivo is a variable grotesque with a width axis:
  pulled wide it is the sign over the door, pulled narrow and tracked it is the
  small print. Using width to carry the role means the page needs no third face.
  Literata handles running text — sturdy, warm, built for reading on a screen.
*/
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Restaurant in General Mariano Alvarez, Cavite`,
    template: `%s — ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    locale: "en_PH",
    url: "/",
    title: `${siteName} — Restaurant in General Mariano Alvarez, Cavite`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Restaurant in General Mariano Alvarez, Cavite`,
    description: siteDescription,
  },
  // Until a real domain is configured, keep the site out of search results
  // rather than let it be indexed against localhost canonicals.
  robots: isSiteUrlConfigured
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-PH"
      className={`${archivo.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="label sr-only rounded-sm bg-brass px-5 text-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:inline-flex focus:min-h-tap focus:items-center"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <LocalBusinessSchema />
      </body>
    </html>
  );
}
