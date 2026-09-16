'use client';

import { FormEvent, useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

type FormValues = {
  name: string;
  email: string;
  organization: string;
  projectType: string;
  context: string;
  message: string;
};

const initialValues: FormValues = {
  name: '',
  email: '',
  organization: '',
  projectType: '',
  context: '',
  message: '',
};

const projectTypes = ['Brand identity', 'Digital experience', 'Campaign or launch', 'Something else'];

export function InquiryForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [formState, setFormState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: [] }));
    if (formState !== 'idle') {
      setFormState('idle');
      setError('');
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState('submitting');
    setError('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as {
        error?: string;
        fields?: Record<string, string[]>;
      };

      if (!response.ok) {
        setFieldErrors(payload.fields ?? {});
        setError(payload.error ?? 'Please check the form and try again.');
        setFormState('error');
        return;
      }

      setValues(initialValues);
      setFormState('success');
    } catch {
      setError('We could not send your note right now. Please try again in a moment.');
      setFormState('error');
    }
  }

  const message = formState === 'success' ? 'Your note is with us. We will be in touch shortly.' : error;

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" value={values.name} onChange={(value) => updateValue('name', value)} error={fieldErrors.name?.[0]} />
        <Field label="Email address" name="email" type="email" value={values.email} onChange={(value) => updateValue('email', value)} error={fieldErrors.email?.[0]} />
        <Field label="Organization" name="organization" value={values.organization} onChange={(value) => updateValue('organization', value)} error={fieldErrors.organization?.[0]} />
        <div>
          <label className="field-label" htmlFor="projectType">What can we help with?</label>
          <select className="field-control" id="projectType" name="projectType" value={values.projectType} onChange={(event) => updateValue('projectType', event.target.value)} aria-invalid={Boolean(fieldErrors.projectType?.[0])}>
            <option value="">Select a focus</option>
            {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          {fieldErrors.projectType?.[0] && <p className="field-error">{fieldErrors.projectType[0]}</p>}
        </div>
      </div>

      <Field label="Timing or budget" name="context" value={values.context} onChange={(value) => updateValue('context', value)} error={fieldErrors.context?.[0]} placeholder="A rough sense is perfect" />
      <div>
        <label className="field-label" htmlFor="message">Tell us about the project</label>
        <textarea className="field-control min-h-36 resize-y" id="message" name="message" value={values.message} onChange={(event) => updateValue('message', event.target.value)} placeholder="What are you hoping to make possible?" aria-invalid={Boolean(fieldErrors.message?.[0])} />
        {fieldErrors.message?.[0] && <p className="field-error">{fieldErrors.message[0]}</p>}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-[var(--ink-muted)]">We read every note. No mailing lists, no hand-offs to a sales team.</p>
        <button className="button button-dark" type="submit" disabled={formState === 'submitting'}>
          {formState === 'submitting' ? 'Sending…' : 'Send inquiry'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p className={`min-h-6 text-sm ${formState === 'success' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`} aria-live="polite">{message}</p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof FormValues;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
};

function Field({ label, name, type = 'text', value, placeholder, error, onChange }: FieldProps) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>{label}</label>
      <input className="field-control" id={name} name={name} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
