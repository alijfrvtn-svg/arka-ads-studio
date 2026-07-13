// Shared domain types. Prisma stores JSON-shaped fields as strings;
// these describe the parsed shapes used across the UI.

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "AUTHOR" | "VIEWER" | "STAFF";
export type Department = "FILM" | "DIGITAL" | "DESIGN" | "STRATEGY";
export type LeadStatus = "NEW" | "CONTACTED" | "PROPOSAL" | "WON" | "LOST";
export type MediaType = "IMAGE" | "VIDEO" | "DOC";
export type Locale = "fa" | "en" | "ar";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Metric {
  label: string;
  value: string;
  suffix?: string;
}
export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}
export interface Faq {
  q: string;
  a: string;
}
export interface PricingTier {
  name: string;
  price: string;
  unit?: string;
  features: string[];
  featured?: boolean;
  cta?: string;
}
export interface Credit {
  role: string;
  name: string;
}
export interface Social {
  platform: string;
  href: string;
  label?: string;
}

export interface SessionPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
  [key: string]: unknown;
}
