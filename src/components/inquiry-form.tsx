"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneText } from "@/components/actions";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import {
  MESSAGE_MAX,
  fieldOrder,
  inquirySchema,
  toFieldErrors,
  type FieldName,
  type InquiryResponse,
} from "@/lib/inquiry-schema";

type Status = "idle" | "submitting" | "success" | "error";

// No min-height here: each control sets its own, so the value cannot be lost
// to a class-merge conflict with the primitive's default.
const fieldControl =
  "w-full rounded-sm border border-ink/25 bg-paper-raised px-4 py-3 text-base text-ink transition-colors placeholder:text-ink-soft/60 focus-visible:border-ink aria-invalid:border-destructive aria-invalid:ring-0";

export function InquiryForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<FieldName, string>>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [messageLength, setMessageLength] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const successRef = React.useRef<HTMLDivElement>(null);

  /** Fired once per visitor, on first interaction, with no field contents. */
  function handleFirstInput() {
    if (started) return;
    setStarted(true);
    track("form_start", { location: "contact" });
  }

  function focusField(name: FieldName) {
    const element = formRef.current?.elements.namedItem(name);
    if (element instanceof HTMLElement) element.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const candidate = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
    };

    // Validate with the same schema the server uses, so the visitor gets
    // errors without a round trip. The server checks again regardless.
    const parsed = inquirySchema.safeParse(candidate);
    if (!parsed.success) {
      const errors = toFieldErrors(parsed.error);
      setFieldErrors(errors);
      setFormError("Please check the highlighted fields and send again.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setFieldErrors({});
    setFormError(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as InquiryResponse;

      if (result.ok) {
        setStatus("success");
        track("form_success", { location: "contact" });
        form.reset();
        setMessageLength(0);
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setFormError(result.formError);
      setStatus("error");
    } catch {
      // The visitor's text stays in the form — a failed send must never cost
      // them what they wrote.
      setFormError(
        "Your message could not be sent — the connection dropped. Your text is still here, so you can try again.",
      );
      setStatus("error");
    }
  }

  // Move focus to whichever block just appeared, so a keyboard or screen
  // reader user lands on the outcome instead of hunting for it.
  React.useEffect(() => {
    if (status === "error") summaryRef.current?.focus();
    if (status === "success") successRef.current?.focus();
  }, [status]);

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border-l-2 border-brass bg-paper-raised p-6 sm:p-8"
      >
        <h3 className="text-2xl">Message sent</h3>
        <p className="mt-3 text-ink-soft">
          It has gone to the restaurant&apos;s inbox. Nobody has committed to a reply time
          yet, so if your question is urgent — whether they are open, whether a table is
          free — calling <PhoneText location="contact-success" /> will be faster.
        </p>
        <p className="mt-3 text-ink-soft">
          Your message is not stored on this website. It exists only in that inbox.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Write another message
        </Button>
      </div>
    );
  }

  const errorList = fieldOrder.filter((name) => fieldErrors[name]);
  const submitting = status === "submitting";

  return (
    /*
      `method`/`action` are the safety net, not the normal path. With JS the
      submit handler takes over and fetches. Without it — script blocked, JS
      failed to load — the browser falls back to these, and a POST keeps the
      visitor's name, email and message out of the URL. A bare <form> would
      GET, writing all of it into the address bar and the server logs.
    */
    <form
      ref={formRef}
      method="post"
      action="/api/inquiry"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-7"
    >
      {/* Error summary: announced, focusable, and each item jumps to its field. */}
      <div aria-live="assertive">
        {status === "error" && formError ? (
          <div
            ref={summaryRef}
            tabIndex={-1}
            className="border-l-2 border-destructive bg-destructive/5 p-5"
          >
            <h3 className="font-display font-semibold text-destructive">{formError}</h3>
            {errorList.length > 0 ? (
              <ul className="mt-3 space-y-1 text-sm">
                {errorList.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => focusField(name)}
                      className="text-left underline decoration-1 underline-offset-4 hover:decoration-2"
                    >
                      {fieldErrors[name]}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      <Field
        name="name"
        label="Your name"
        error={fieldErrors.name}
        control={(props) => (
          <Input
            {...props}
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            className={cn(fieldControl, "min-h-tap")}
          />
        )}
        onInput={handleFirstInput}
      />

      <Field
        name="email"
        label="Email"
        hint="So the restaurant can write back."
        error={fieldErrors.email}
        control={(props) => (
          <Input
            {...props}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            className={cn(fieldControl, "min-h-tap")}
          />
        )}
        onInput={handleFirstInput}
      />

      <Field
        name="phone"
        label="Phone"
        hint="Optional."
        error={fieldErrors.phone}
        control={(props) => (
          <Input
            {...props}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={30}
            className={cn(fieldControl, "min-h-tap")}
          />
        )}
        onInput={handleFirstInput}
      />

      <Field
        name="message"
        label="Message"
        hint={`${messageLength} of ${MESSAGE_MAX} characters used.`}
        error={fieldErrors.message}
        control={(props) => (
          <Textarea
            {...props}
            rows={6}
            required
            maxLength={MESSAGE_MAX}
            onChange={(event) => setMessageLength(event.target.value.length)}
            className={cn(fieldControl, "min-h-[10rem] resize-y leading-relaxed")}
          />
        )}
        onInput={handleFirstInput}
      />

      {/* Honeypot. Hidden from sight and from assistive technology, and never
          focusable by keyboard — anything typed here came from a script. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            name="consent"
            aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
            aria-invalid={fieldErrors.consent ? true : undefined}
            // The box is 20px, but its `after` pseudo-element carries the hit
            // area out to 44px so the target clears WCAG 2.2's minimum.
            className="mt-1.5 size-5 rounded-[3px] border-ink/35 after:-inset-x-3 after:-inset-y-3 data-checked:border-shade data-checked:bg-shade"
          />
          <label htmlFor="consent" className="text-[0.975rem] text-ink-soft">
            The restaurant may use my name and contact details to reply to this message.
          </label>
        </div>
        {fieldErrors.consent ? (
          <p id="consent-error" className="mt-2 text-sm text-destructive">
            {fieldErrors.consent}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="wide" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" />
              Sending
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <p className="text-sm text-ink-soft">
          Or call <PhoneText location="contact-form" />
        </p>
      </div>

      {/* Polite counterpart to the assertive summary: narrates the in-flight state. */}
      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your message." : ""}
      </p>
    </form>
  );
}

type ControlProps = {
  id: string;
  name: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

function Field({
  name,
  label,
  hint,
  error,
  control,
  onInput,
}: {
  name: FieldName;
  label: string;
  hint?: string;
  error?: string;
  control: (props: ControlProps) => React.ReactNode;
  onInput: () => void;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div onInput={onInput}>
      <label htmlFor={name} className="label mb-2 block text-ink">
        {label}
      </label>
      {control({
        id: name,
        name,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-2 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
