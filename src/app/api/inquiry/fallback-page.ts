import "server-only";

import type { InquiryResponse } from "@/lib/inquiry-schema";
import { business, telHref } from "@/content/business";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );

/**
 * The reply a visitor sees when the form submitted natively — JavaScript
 * blocked or broken — so there is no React on the page to render the result.
 *
 * Deliberately self-contained: inline styles only, no script, no font
 * requests. It cannot import the design system, so it borrows the palette
 * directly and stays legible under the site's Content Security Policy.
 */
export function fallbackPage(result: InquiryResponse) {
  const sent = result.ok;
  const heading = sent ? "Message sent" : "Your message was not sent";
  const body = sent
    ? "It has gone to the restaurant's inbox. This website keeps no copy of it."
    : escapeHtml(result.formError);

  const fieldNotes =
    !sent && result.fieldErrors
      ? `<ul style="margin:16px 0 0;padding-left:20px;color:#46565f">${Object.values(
          result.fieldErrors,
        )
          .map((message) => `<li style="margin-bottom:4px">${escapeHtml(message!)}</li>`)
          .join("")}</ul>`
      : "";

  return `<!doctype html>
<html lang="en-PH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(heading)} — ${escapeHtml(business.name)}</title>
</head>
<body style="margin:0;background:#14312a;color:#f3f4f0;font:17px/1.6 Georgia,'Times New Roman',serif">
<main style="max-width:36rem;margin:0 auto;padding:15vh 20px 20px">
<p style="font:600 11px/1.2 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#dca945;margin:0 0 20px">
${escapeHtml(business.name)}
</p>
<h1 style="font:700 clamp(2rem,8vw,3rem)/1.05 system-ui,sans-serif;letter-spacing:-.02em;margin:0">
${escapeHtml(heading)}
</h1>
<p style="margin:24px 0 0;color:#a9bab2">${body}</p>
${fieldNotes}
<p style="margin:32px 0 0">
<a href="${telHref}" style="display:inline-block;min-height:44px;line-height:44px;padding:0 24px;background:#c08a2e;color:#16211d;text-decoration:none;border-radius:4px;font:600 11px/44px system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase">
Call ${escapeHtml(business.phone.value.display)}
</a>
</p>
<p style="margin:24px 0 0">
<a href="/contact" style="color:#dca945;text-underline-offset:4px">Back to the contact page</a>
</p>
</main>
</body>
</html>`;
}
