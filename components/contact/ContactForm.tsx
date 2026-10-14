"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  budgetRanges,
  emptyContact,
  projectTypes,
  timelines,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from "@/lib/contact";
import { easeOutExpo } from "@/lib/motion";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full border-b border-hairline bg-transparent py-3 text-sm text-ink outline-none transition-colors duration-300 placeholder:text-muted/70 focus:border-ink";

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const formId = useId();

  const update = (field: keyof ContactPayload) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validateContact(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      // Move focus to the first problem so keyboard users are not stranded.
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`${formId}-${firstField}`)?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        errors?: ContactErrors;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setStatus("error");
        setServerMessage(
          data.message ?? "Something went wrong. Please email me directly.",
        );
        return;
      }

      setStatus("success");
      setValues(emptyContact);
    } catch {
      setStatus("error");
      setServerMessage(
        "Could not reach the server. Please email me directly instead.",
      );
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        role="status"
        className="border-t border-hairline pt-8"
      >
        <p className="type-headline mb-3">Thanks, message sent.</p>
        <p className="type-body max-w-md text-muted">
          I read everything myself and normally reply within one working day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="type-label mt-8 text-muted transition-colors hover:text-ink"
        >
          Send another →
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Name"
          required
          error={errors.name}
          value={values.name}
          onChange={update("name")}
          autoComplete="name"
        />
        <Field
          id={`${formId}-company`}
          label="Company"
          error={errors.company}
          value={values.company}
          onChange={update("company")}
          autoComplete="organization"
        />
      </div>

      <Field
        id={`${formId}-email`}
        label="Email"
        type="email"
        required
        error={errors.email}
        value={values.email}
        onChange={update("email")}
        autoComplete="email"
      />

      <div className="grid gap-8 sm:grid-cols-3">
        <SelectField
          id={`${formId}-projectType`}
          label="Project type"
          required
          error={errors.projectType}
          value={values.projectType}
          onChange={update("projectType")}
          options={[...projectTypes]}
          placeholder="Select"
        />
        <SelectField
          id={`${formId}-budget`}
          label="Budget"
          value={values.budget}
          onChange={update("budget")}
          options={[...budgetRanges]}
          placeholder="Optional"
        />
        <SelectField
          id={`${formId}-timeline`}
          label="Timeline"
          value={values.timeline}
          onChange={update("timeline")}
          options={[...timelines]}
          placeholder="Optional"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="type-label text-muted">
          Project details <span aria-hidden>*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(event) => update("message")(event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          placeholder="Car, product, campaign, dates, deliverables…"
          className={`${fieldClass} mt-3 resize-y`}
        />
        <FieldError id={`${formId}-message-error`} message={errors.message} />
      </div>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => update("website")(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-hairline pt-8">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 rounded-full border border-hairline px-7 py-3.5 transition-colors duration-500 hover:border-ink/40 hover:bg-ink hover:text-bg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          <span className="type-label">
            {status === "submitting" ? "Sending…" : "Send inquiry"}
          </span>
          <span
            aria-hidden
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          >
            →
          </span>
        </button>

        <AnimatePresence>
          {status === "error" && serverMessage ? (
            <motion.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="type-label max-w-xs text-ink/80"
            >
              {serverMessage}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label text-muted">
        {label} {required ? <span aria-hidden>*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass} mt-3`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label text-muted">
        {label} {required ? <span aria-hidden>*</span> : null}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass} mt-3 appearance-none [&>option]:bg-surface [&>option]:text-ink`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs text-ink/70">
      {message}
    </p>
  );
}
