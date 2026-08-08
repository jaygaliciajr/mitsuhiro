import type { NextRequest } from "next/server";

import { inquirySchema, toFieldErrors, type InquiryResponse } from "@/lib/inquiry-schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  deliverInquiry,
  isInquiryDeliveryConfigured,
  isInquiryFormEnabled,
} from "@/lib/inquiry-delivery";
import { business } from "@/content/business";
import { fallbackPage } from "./fallback-page";

/** Never prerendered, and never cached — this endpoint only ever writes. */
export const dynamic = "force-dynamic";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const CALL_INSTEAD = `Please call the restaurant on ${business.phone.value.display} instead.`;

/**
 * Two kinds of caller reach this endpoint:
 *
 * - the contact form's `fetch`, which sends JSON and renders the reply itself;
 * - the same form submitting natively when JavaScript did not run, which sends
 *   `application/x-www-form-urlencoded` and needs a page back, not JSON.
 *
 * The second path exists so a script-blocked visitor still gets their message
 * delivered and an honest answer, instead of a screenful of raw JSON.
 */
function wantsHtml(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  return !type.includes("application/json");
}

function respond(
  request: NextRequest,
  body: InquiryResponse,
  status: number,
  headers?: HeadersInit,
) {
  if (wantsHtml(request)) {
    return new Response(fallbackPage(body), {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        ...headers,
      },
    });
  }

  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

async function readPayload(request: NextRequest): Promise<unknown> {
  if (wantsHtml(request)) {
    const form = await request.formData();
    return {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      message: String(form.get("message") ?? ""),
      // An unticked checkbox is simply absent from a native form submission.
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
    };
  }
  return request.json();
}

export async function POST(request: NextRequest) {
  if (!isInquiryFormEnabled()) {
    return respond(
      request,
      {
        ok: false,
        formError: `This form is not connected to an inbox yet, so nothing was sent. ${CALL_INSTEAD}`,
      },
      503,
    );
  }

  const limit = rateLimit(`inquiry:${clientKey(request.headers)}`, {
    limit: LIMIT,
    windowMs: WINDOW_MS,
  });
  if (!limit.allowed) {
    return respond(
      request,
      {
        ok: false,
        formError: `That is several messages in a short time, so this one was not sent. Try again in a few minutes, or call ${business.phone.value.display}.`,
      },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  let payload: unknown;
  try {
    payload = await readPayload(request);
  } catch {
    return respond(
      request,
      { ok: false, formError: `We could not read that submission. ${CALL_INSTEAD}` },
      400,
    );
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return respond(
      request,
      {
        ok: false,
        formError: "Please check the highlighted fields and send again.",
        fieldErrors: toFieldErrors(parsed.error),
      },
      400,
    );
  }

  // Honeypot: accept quietly so the bot learns nothing, but send nothing.
  if (parsed.data.website) {
    return respond(request, { ok: true }, 200);
  }

  const delivered = await deliverInquiry(parsed.data);
  if (!delivered.ok) {
    const notConnected = !isInquiryDeliveryConfigured();
    return respond(
      request,
      {
        ok: false,
        formError: notConnected
          ? `This form is not connected to an inbox yet, so nothing was sent. ${CALL_INSTEAD}`
          : `Your message could not be sent just now. ${CALL_INSTEAD}`,
      },
      notConnected ? 503 : 502,
    );
  }

  return respond(request, { ok: true }, 200);
}

/** Anything other than POST is a mistake; say so rather than 404. */
export async function GET() {
  return Response.json(
    { ok: false, formError: "Send this form with POST." },
    { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } },
  );
}
