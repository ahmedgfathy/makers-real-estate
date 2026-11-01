"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createDeveloper, updateDeveloper } from "@/lib/developers";
import { recordAudit } from "@/lib/audit";

function value(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function slugify(text: string): string {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function payload(form: FormData) {
  const establishedRaw = value(form, "established");
  const established = establishedRaw ? Number(establishedRaw) : null;
  return {
    name: value(form, "name"),
    name_ar: value(form, "name_ar") || null,
    description: value(form, "description") || null,
    description_ar: value(form, "description_ar") || null,
    established: established != null && Number.isInteger(established) ? established : null,
    website: value(form, "website") || null,
  };
}

export async function createDeveloperAction(form: FormData): Promise<void> {
  const session = await requireAdmin("/dashboard/primary");
  const developer = payload(form);
  const slug = slugify(value(form, "slug") || developer.name);
  if (!developer.name || !slug) redirect("/dashboard/developers/new?error=Name%20is%20required");
  try {
    await createDeveloper(slug, developer);
  } catch {
    redirect("/dashboard/developers/new?error=That%20developer%20slug%20already%20exists");
  }
  await recordAudit({ actor: session.username, action: "developer.created", entityType: "developer", entityId: slug, detail: { name: developer.name } });
  revalidatePath("/dashboard/primary");
  revalidatePath("/developers");
  redirect(`/dashboard/developers/${slug}`);
}

export async function updateDeveloperAction(form: FormData): Promise<void> {
  const session = await requireAdmin("/dashboard/primary");
  const slug = value(form, "slug");
  const developer = payload(form);
  if (!slug || !developer.name) redirect(`/dashboard/developers/${slug}?error=Name%20is%20required`);
  await updateDeveloper(slug, developer);
  await recordAudit({ actor: session.username, action: "developer.updated", entityType: "developer", entityId: slug, detail: { name: developer.name } });
  revalidatePath("/dashboard/primary");
  revalidatePath(`/dashboard/developers/${slug}`);
  revalidatePath("/developers");
  revalidatePath("/projects");
  redirect(`/dashboard/developers/${slug}?ok=Developer%20saved`);
}
