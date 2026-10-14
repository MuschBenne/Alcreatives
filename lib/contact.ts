/** Shared between the form and the API route so both agree on the rules. */

export const projectTypes = [
  "Automotive",
  "Product",
  "Commercial",
  "Other",
] as const;

export const budgetRanges = [
  "Under 25 000 SEK",
  "25 000 to 75 000 SEK",
  "75 000 to 150 000 SEK",
  "150 000 SEK +",
  "Not sure yet",
] as const;

export const timelines = [
  "Within 2 weeks",
  "1 to 2 months",
  "3 months +",
  "Flexible",
] as const;

export type ContactPayload = {
  name: string;
  company: string;
  email: string;
  projectType: (typeof projectTypes)[number] | "";
  budget: string;
  timeline: string;
  message: string;
  /** Honeypot: must stay empty. Real people never see this field. */
  website?: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const emptyContact: ContactPayload = {
  name: "",
  company: "",
  email: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  website: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * A field as a trimmed string, whatever arrived.
 *
 * The form only ever sends strings, but the route is a public endpoint and JSON
 * carries numbers, arrays and objects just as happily. `payload.name?.trim()`
 * throws on `{"name": 123}` — a crash rather than a validation error.
 */
function field(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContact(payload: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};

  const name = field(payload.name);
  if (name.length < 2) errors.name = "Please enter your name.";
  if (name.length > 120) errors.name = "That name is a little too long.";

  const email = field(payload.email);
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (!projectTypes.includes(field(payload.projectType) as (typeof projectTypes)[number]))
    errors.projectType = "Pick the closest project type.";

  const message = field(payload.message);
  if (message.length < 10) errors.message = "Tell me a little more about the project.";
  if (message.length > 4000) errors.message = "Please keep it under 4000 characters.";

  if (field(payload.company).length > 160) errors.company = "That company name is too long.";

  // Both are optional, but if something is there it has to be one of ours. They
  // were not checked at all, though the allowlists sit at the top of this file:
  // anything sent under these names went straight into both emails, at any
  // length the sender liked.
  const budget = field(payload.budget);
  if (budget && !budgetRanges.includes(budget as (typeof budgetRanges)[number]))
    errors.budget = "Pick one of the listed ranges.";

  const timeline = field(payload.timeline);
  if (timeline && !timelines.includes(timeline as (typeof timelines)[number]))
    errors.timeline = "Pick one of the listed timelines.";

  return errors;
}
