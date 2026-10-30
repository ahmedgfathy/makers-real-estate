"use server";

import { revalidatePath } from "next/cache";
import { canPublish, requireAdmin } from "@/lib/auth";
import { setPropertyPublished } from "@/lib/admin";
import { setProjectPublished } from "@/lib/projects";

/**
 * Publish switches for the public website.
 *
 * Only admin sessions (see ADMIN_USERNAMES in lib/auth.ts) may go live; the
 * checkbox is disabled for everyone else and this guard is the real boundary.
 */

export type PublishResult = { ok: boolean; error?: string };

const DENIED = "Only an admin can publish to the website.";

export async function publishProjectAction(
  slug: string,
  published: boolean
): Promise<PublishResult> {
  const session = await requireAdmin(`/dashboard/projects/${slug}`);
  if (!canPublish(session)) return { ok: false, error: DENIED };

  await setProjectPublished(slug, published);

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${slug}`);
  revalidatePath("/dashboard/primary");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);

  return { ok: true };
}

export async function publishPropertyAction(
  id: number,
  published: boolean
): Promise<PublishResult> {
  const session = await requireAdmin(`/dashboard/inventory/${id}`);
  if (!canPublish(session)) return { ok: false, error: DENIED };

  await setPropertyPublished(id, published);

  revalidatePath("/dashboard/inventory");
  revalidatePath(`/dashboard/inventory/${id}`);
  revalidatePath("/dashboard");
  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  revalidatePath("/projects");

  return { ok: true };
}
