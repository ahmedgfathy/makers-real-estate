"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, canManageUsers } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  countActiveAdmins,
  createUser,
  setPassword,
  setUserActive,
  setUserRole,
  type Role,
} from "@/lib/users";

/**
 * Account management for the dashboard (admin_users).
 *
 * Every action re-reads the session server-side: rendering a form for admins
 * only is not a boundary. Editors are refused with a clear message.
 */

const DENIED = "Only an administrator can manage accounts.";

async function requireAccountAdmin(): Promise<{ username: string }> {
  const session = await requireAdmin("/dashboard/users");
  if (!canManageUsers(session)) {
    redirect(`/dashboard/users?error=${encodeURIComponent(DENIED)}`);
  }
  return session;
}

function text(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function fail(message: string): never {
  redirect(`/dashboard/users?error=${encodeURIComponent(message)}`);
}

export async function createUserAction(formData: FormData) {
  const actor = await requireAccountAdmin();

  const username = text(formData, "username");
  const password = text(formData, "password");
  const displayName = text(formData, "display_name");
  const rawRole = text(formData, "role") ?? "editor";
  const role: Role = rawRole === "admin" ? "admin" : "editor";

  if (!username || !password) fail("Username and password are required.");

  try {
    await createUser({ username, password, displayName, role });
  } catch (err) {
    fail(err instanceof Error ? err.message : "Could not create the account.");
  }

  await recordAudit({
    actor: actor.username,
    action: "user.created",
    entityType: "admin_user",
    entityId: username.toLowerCase(),
    detail: { role, display_name: displayName },
  });

  revalidatePath("/dashboard/users");
  redirect(`/dashboard/users?ok=${encodeURIComponent(`Account "${username}" created.`)}`);
}

export async function setPasswordAction(formData: FormData) {
  const actor = await requireAccountAdmin();

  const username = text(formData, "username");
  const password = text(formData, "password");
  if (!username || !password) fail("Choose an account and a new password.");

  try {
    await setPassword(username, password);
  } catch (err) {
    fail(err instanceof Error ? err.message : "Could not update the password.");
  }

  await recordAudit({
    actor: actor.username,
    action: "user.password_set",
    entityType: "admin_user",
    entityId: username.toLowerCase(),
    detail: {},
  });

  revalidatePath("/dashboard/users");
  redirect(`/dashboard/users?ok=${encodeURIComponent(`Password updated for "${username}".`)}`);
}

export async function setRoleAction(formData: FormData) {
  const actor = await requireAccountAdmin();

  const username = text(formData, "username");
  const rawRole = text(formData, "role");
  const role: Role = rawRole === "admin" ? "admin" : "editor";
  if (!username) fail("Account not found.");

  if (role === "editor") {
    // Never lock the dashboard out of its last administrator.
    const current = await countActiveAdmins(username);
    if (current < 1) fail("This is the last active administrator — promote another account first.");
  }

  await setUserRole(username, role);
  await recordAudit({
    actor: actor.username,
    action: "user.role_changed",
    entityType: "admin_user",
    entityId: username.toLowerCase(),
    detail: { role },
  });

  revalidatePath("/dashboard/users");
  redirect(
    `/dashboard/users?ok=${encodeURIComponent(`${username} is now ${role === "admin" ? "an administrator" : "an editor"}.`)}`
  );
}

export async function setActiveAction(formData: FormData) {
  const actor = await requireAccountAdmin();

  const username = text(formData, "username");
  const active = text(formData, "active") === "true";
  if (!username) fail("Account not found.");

  if (!active) {
    const current = await countActiveAdmins(username);
    if (current < 1) fail("This is the last active administrator — they cannot be disabled.");
  }

  await setUserActive(username, active);
  await recordAudit({
    actor: actor.username,
    action: active ? "user.enabled" : "user.disabled",
    entityType: "admin_user",
    entityId: username.toLowerCase(),
    detail: {},
  });

  revalidatePath("/dashboard/users");
  redirect(
    `/dashboard/users?ok=${encodeURIComponent(`${username} ${active ? "enabled" : "disabled"}.`)}`
  );
}
