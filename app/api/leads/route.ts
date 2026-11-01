import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { recordAudit } from "@/lib/audit";
import { createLead } from "@/lib/admin";
import { normalizeLead, type LeadBody } from "@/lib/lead-intake";

export const dynamic = "force-dynamic";

/**
 * Public lead intake.
 *
 * Accepts either a plain JSON / website form payload or a Facebook Lead Ads
 * style payload (`field_data: [{ name, values }]`). Normalisation lives in
 * lib/lead-intake.ts so this endpoint and the Meta webhook behave identically.
 * If LEADS_API_KEY is set, callers must send it as `x-api-key` (or `?key=`).
 */
export async function POST(req: Request) {
  const expectedKey = process.env.LEADS_API_KEY;
  if (expectedKey) {
    const url = new URL(req.url);
    const provided = req.headers.get("x-api-key") ?? url.searchParams.get("key");
    if (provided !== expectedKey) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body" }, { status: 400 });
  }

  const input = normalizeLead(body);
  if ("error" in input) {
    return NextResponse.json({ ok: false, error: input.error }, { status: 400 });
  }

  try {
    const id = await createLead(input);
    await recordAudit({
      actor: `api:${input.source}`,
      action: "lead.created",
      entityType: "lead",
      entityId: id,
      detail: {
        name: input.full_name,
        project: input.project,
        form: input.form_name,
        via: "api",
      },
    });
    revalidatePath("/dashboard", "layout");
    return NextResponse.json({ ok: true, id, source: input.source }, { status: 201 });
  } catch (err) {
    console.error("[leads] intake failed:", err);
    return NextResponse.json({ ok: false, error: "Could not save lead" }, { status: 500 });
  }
}
