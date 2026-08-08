import "server-only";

import type { Inquiry } from "@/lib/inquiry-schema";
import { business } from "@/content/business";

/**
 * Where an enquiry goes.
 *
 * There is no database. An enquiry is forwarded as an email and this app keeps
 * no copy — nothing to leak, nothing to retain, nothing to have a deletion
 * policy about beyond the owner's own inbox.
 *
 * The destination is unset on purpose: no public email address for Hiromitsu
 * has been confirmed, so there is nowhere legitimate to send a message yet.
 * Until `INQUIRY_TO_EMAIL` and `RESEND_API_KEY` are configured the form is not
 * offered to visitors at all — they are shown the verified phone number
 * instead. A form that silently drops messages is worse than no form.
 */

const apiKey = process.env.RESEND_API_KEY;
const to = process.env.INQUIRY_TO_EMAIL;
const from = process.env.INQUIRY_FROM_EMAIL;

/** In development, print the enquiry instead of sending it so the flow is testable. */
const devLogging = process.env.NODE_ENV !== "production";

export function isInquiryDeliveryConfigured() {
  return Boolean(apiKey && to && from);
}

/** The form renders only when a message can actually reach someone. */
export function isInquiryFormEnabled() {
  return isInquiryDeliveryConfigured() || devLogging;
}

export type DeliveryResult = { ok: true } | { ok: false; reason: string };

export async function deliverInquiry(inquiry: Inquiry): Promise<DeliveryResult> {
  const subject = `Website enquiry — ${inquiry.name}`;
  const body = [
    `Name:    ${inquiry.name}`,
    `Email:   ${inquiry.email}`,
    `Phone:   ${inquiry.phone || "(not given)"}`,
    `Sent:    ${new Date().toISOString()}`,
    `Source:  ${business.name} website contact form`,
    "",
    inquiry.message,
  ].join("\n");

  if (!isInquiryDeliveryConfigured()) {
    if (devLogging) {
      console.info(
        `[inquiry] delivery is not configured; printing instead.\n${subject}\n${body}`,
      );
      return { ok: true };
    }
    return { ok: false, reason: "delivery-not-configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // So the owner can hit reply and reach the sender directly.
        reply_to: inquiry.email,
        subject,
        text: body,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      // Log the status only. The body can echo the message back into logs.
      console.error(`[inquiry] delivery failed with status ${response.status}`);
      return { ok: false, reason: `provider-${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    console.error("[inquiry] delivery threw", error instanceof Error ? error.name : "unknown");
    return { ok: false, reason: "network" };
  }
}
