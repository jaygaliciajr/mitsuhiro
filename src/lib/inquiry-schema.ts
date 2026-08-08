import { z } from "zod";

/**
 * Shared by the client form and the route handler, so the browser and the
 * server can never disagree about what a valid enquiry is.
 *
 * Kept to the minimum that lets someone answer the message: a name, one way to
 * reply, and the message itself. No address, no birthday, nothing we would then
 * have to protect.
 */

/**
 * Single-line fields: drop every control character — a newline inside a name
 * or an email address is how mail headers get forged — and collapse runs of
 * whitespace.
 */
const cleanLine = (value: string) =>
  value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The message keeps its line breaks — losing someone’s paragraphs to
 * sanitisation only makes their enquiry harder to read. Every other control
 * character still goes.
 */
const cleanText = (value: string) =>
  value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, " ")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const line = z.string().transform(cleanLine);
const text = z.string().transform(cleanText);

export const MESSAGE_MAX = 1500;

export const inquirySchema = z
  .object({
    name: line.pipe(
      z
        .string()
        .min(2, "Please enter your name.")
        .max(80, "Please keep your name under 80 characters."),
    ),

    email: line.pipe(
      z
        .string()
        .min(1, "Please enter an email address so the restaurant can reply.")
        .max(254, "That email address is too long.")
        .pipe(z.email("Please check the email address — it needs an @ and a domain.")),
    ),

    phone: line.pipe(
      z
        .string()
        .max(30, "Please keep the phone number under 30 characters.")
        .regex(
          /^$|^[0-9+()\-.\s]{7,}$/,
          "Please use digits, spaces and + ( ) - only, or leave this blank.",
        ),
    ),

    message: text.pipe(
      z
        .string()
        .min(10, "Please add a little more detail — at least 10 characters.")
        .max(MESSAGE_MAX, `Please keep your message under ${MESSAGE_MAX} characters.`),
    ),

    consent: z.literal(true, {
      error: "Please tick the box so we know we may reply to you.",
    }),

    /**
     * Honeypot. Real people never see this field, so anything in it is a bot.
     *
     * Deliberately permissive: rejecting a filled honeypot *here* would answer
     * the bot with a validation error, which tells it exactly which field gave
     * it away. The route handler accepts the submission and quietly delivers
     * nothing instead. It also means a browser that autofills the field can
     * never trap a real person behind an error with no visible cause.
     */
    website: z.string().max(200).optional().default(""),
  })
  .strict();

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

export type FieldName = "name" | "email" | "phone" | "message" | "consent";

export const fieldOrder: FieldName[] = ["name", "email", "phone", "message", "consent"];

/** What the route handler returns, and what the form renders. */
export type InquiryResponse =
  | { ok: true }
  | {
      ok: false;
      /** Shown above the form and announced to screen readers. */
      formError: string;
      /** Keyed by field name; rendered inline and linked from the error summary. */
      fieldErrors?: Partial<Record<FieldName, string>>;
    };

/** Flatten Zod issues into the shape the form renders. */
export function toFieldErrors(error: z.ZodError) {
  const fieldErrors: Partial<Record<FieldName, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string" || field === "website") continue;
    const key = field as FieldName;
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
