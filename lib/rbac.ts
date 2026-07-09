import { ROLE_PERMISSIONS } from "./constants";
import type { Role } from "@/types";

/**
 * Resolve whether a role + granular overrides grant a permission.
 * SUPER_ADMIN (or a "*" override) passes everything.
 */
export function can(role: Role, overrides: string[], permission: string): boolean {
  if (role === "SUPER_ADMIN") return true;
  const base = ROLE_PERMISSIONS[role] ?? [];
  if (base.includes("*") || overrides.includes("*")) return true;
  return base.includes(permission) || overrides.includes(permission);
}

/** Effective permission list for display in the admin UI. */
export function effectivePermissions(role: Role, overrides: string[]): string[] {
  if (role === "SUPER_ADMIN") return ["*"];
  return Array.from(new Set([...(ROLE_PERMISSIONS[role] ?? []), ...overrides]));
}
