"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrors({});

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    const nextErrors: Errors = {};
    if (payload.name.trim().length < 2)
      nextErrors.name = "Please share your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      nextErrors.email = "Please enter a valid email.";
    }
    if (payload.message.trim().length < 10) {
      nextErrors.message = "Please tell us a little more.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setState("idle");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");
      event.currentTarget.reset();
      setState("success");
    } catch (error) {
      console.error("Contact form submission failed", error);
      setState("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>
          <span>Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <small id="name-error">{errors.name}</small>}
        </label>
        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <small id="email-error">{errors.email}</small>}
        </label>
      </div>
      <label>
        <span>How can we help?</span>
        <textarea
          name="message"
          rows={4}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && <small id="message-error">{errors.message}</small>}
      </label>
      <div className="form-footer">
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending note…" : "Start a conversation"}
          <span aria-hidden="true">↗</span>
        </button>
        {state === "success" && (
          <p className="form-message success" role="status">
            Thanks — we’ll be in touch within one business day.
          </p>
        )}
        {state === "error" && (
          <p className="form-message error" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
