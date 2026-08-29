"use client";

import { FormEvent, useState } from "react";

const initialForm = { name: "", email: "", company: "", message: "" };

type FormState = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (state === "error") setState("idle");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Please check your details and try again.");
        setState("error");
        return;
      }

      setState("success");
      setForm(initialForm);
    } catch {
      setError("Something went wrong on our side. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="form-success" role="status">
        <span className="success-mark">✓</span>
        <h3>Consider this a good beginning.</h3>
        <p>
          Thanks for reaching out. We’ll be in touch within two business days.
        </p>
        <button
          type="button"
          className="text-button"
          onClick={() => setState("idle")}
        >
          Send another note ↗
        </button>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      <div className="field-row">
        <label>
          {" "}
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label>
          {" "}
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </label>
      </div>
      <label>
        <span>
          Company <em>Optional</em>
        </span>
        <input
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder="Company name"
          autoComplete="organization"
        />
      </label>
      <label>
        <span>What are you working through?</span>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="A little context helps us make the first conversation useful."
        />
      </label>
      {state === "error" ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="submit-button"
        type="submit"
        disabled={state === "submitting"}
      >
        {state === "submitting"
          ? "Sending your note…"
          : "Start a conversation ↗"}
      </button>
    </form>
  );
}
