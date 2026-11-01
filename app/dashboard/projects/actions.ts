"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createProject, updateProject, type ProjectInput } from "@/lib/projects";
import { CATEGORIES, REGIONS, STATUSES } from "@/data/projects";
import { recordAudit } from "@/lib/audit";

function value(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function slugify(text: string): string {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parse(form: FormData): ProjectInput {
  const price = value(form, "price_from");
  const region = value(form, "region");
  const category = value(form, "category");
  const status = value(form, "status");
  return {
    developerSlug: value(form, "developer_slug"),
    name: value(form, "name"),
    nameAr: value(form, "name_ar") || null,
    region: (REGIONS as Record<string, unknown>)[region] ? region as ProjectInput["region"] : "east-cairo",
    location: value(form, "location"),
    category: (CATEGORIES as Record<string, unknown>)[category] ? category as ProjectInput["category"] : "residential",
    status: (STATUSES as Record<string, unknown>)[status] ? status as ProjectInput["status"] : "selling",
    tagline: value(form, "tagline") || null,
    taglineAr: value(form, "tagline_ar") || null,
    description: value(form, "description"),
    descriptionAr: value(form, "description_ar") || null,
    priceFrom: price && Number.isFinite(Number(price)) ? Number(price) : null,
    paymentPlan: value(form, "payment_plan") || null,
    paymentPlanAr: value(form, "payment_plan_ar") || null,
    finishing: value(form, "finishing") || null,
    heroImage: value(form, "hero_image") || null,
  };
}

function revalidate(slug: string) {
  revalidatePath("/dashboard/primary");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${slug}`);
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/dashboard/inventory");
}

export async function createProjectAction(form: FormData): Promise<void> {
  const session = await requireAdmin("/dashboard/primary");
  const input = parse(form);
  const slug = slugify(value(form, "slug") || input.name);
  if (!slug || !input.name || !input.location || !input.description || !input.developerSlug) {
    redirect("/dashboard/projects/new?error=Fill%20all%20required%20fields");
  }
  try {
    await createProject(slug, input);
  } catch {
    redirect("/dashboard/projects/new?error=Could%20not%20create%20project%20(check%20slug%20and%20developer)");
  }
  await recordAudit({ actor: session.username, action: "project.created", entityType: "project", entityId: slug, detail: { developer: input.developerSlug, name: input.name } });
  revalidate(slug);
  redirect(`/dashboard/projects/${slug}?ok=Project%20created`);
}

export async function updateProjectAction(form: FormData): Promise<void> {
  const session = await requireAdmin("/dashboard/projects");
  const slug = value(form, "slug");
  const input = parse(form);
  if (!slug || !input.name || !input.location || !input.description || !input.developerSlug) {
    redirect(`/dashboard/projects/${slug}?error=Fill%20all%20required%20fields`);
  }
  await updateProject(slug, input);
  await recordAudit({ actor: session.username, action: "project.updated", entityType: "project", entityId: slug, detail: { developer: input.developerSlug, name: input.name } });
  revalidate(slug);
  redirect(`/dashboard/projects/${slug}?ok=Project%20saved`);
}
