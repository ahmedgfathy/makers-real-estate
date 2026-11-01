import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { recordAudit } from "@/lib/audit";
import { createLead } from "@/lib/admin";
import { first, normalizeLead, type LeadBody } from "@/lib/lead-intake";

export const dynamic = "force-dynamic";

/**
 * Meta (Facebook / Instagram) lead ads webhook.
 *
 * Setup in the Meta developer app:
 *   1. Callback URL:  https://<your-domain>/api/webhooks/meta
 *      Verify token:  META_VERIFY_TOKEN (any secret you choose)
 *   2. Subscribe the app to the `leadgen` topic.
 *   3. META_APP_SECRET validates X-Hub-Signature-256 on every delivery.
 *   4. META_ACCESS_TOKEN (a page/user token with `leads_retrieval`) lets the
 *      endpoint fetch the lead's answers — Meta only sends the leadgen_id.
 *
 * Deliveries are retried by Meta on non-2xx, so a transient Graph API failure
 * answers 500 and comes back. Duplicate leadgen_ids are absorbed by the
 * unique index on leads.external_id, so redeliveries never create two rows.
 *
 * META_GRAPH_BASE points at graph.facebook.com and exists for local testing.
 */

const GRAPH_BASE = process.env.META_GRAPH_BASE ?? "https://graph.facebook.com";
const GRAPH_VERSION = "v21.0";

function configured(): { verifyToken: string; appSecret: string; accessToken: string } | null {
  const verifyToken = process.env.META_VERIFY_TOKEN ?? "";
  const appSecret = process.env.META_APP_SECRET ?? "";
  const accessToken = process.env.META_ACCESS_TOKEN ?? "";
  if (!verifyToken || !appSecret || !accessToken) return null;
  return { verifyToken, appSecret, accessToken };
}

/** GET /api/webhooks/meta — Meta's subscription confirmation handshake. */
export async function GET(req: Request) {
  const cfg = configured();
  if (!cfg) {
    return NextResponse.json(
      { ok: false, error: "Meta webhook is not configured (see META_* env vars)" },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === cfg.verifyToken && challenge != null) {
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }
  return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 403 });
}

function validSignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const provided = header.slice("sha256=".length);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

type LeadgenEntry = {
  leadgen_id?: string;
  form_id?: string;
  ad_id?: string;
  adgroup_id?: string;
  created_time?: string;
  page_id?: string;
};

/** Ask Graph API for the lead's answers (field_data) by leadgen id. */
async function fetchLeadDetails(
  leadgenId: string,
  accessToken: string
): Promise<LeadBody | null> {
  const url = `${GRAPH_BASE}/${GRAPH_VERSION}/${encodeURIComponent(leadgenId)}?access_token=${encodeURIComponent(accessToken)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`[webhook:meta] graph ${leadgenId} -> HTTP ${res.status}`);
      return null;
    }
    const data = (await res.json()) as LeadBody & {
      field_data?: { name?: string; values?: string[] }[];
      ad_id?: string;
      adgroup_id?: string;
      created_time?: string;
    };
    return data;
  } catch (err) {
    console.error(
      "[webhook:meta] graph fetch failed:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

/** POST /api/webhooks/meta — receive leadgen deliveries. */
export async function POST(req: Request) {
  const cfg = configured();
  if (!cfg) {
    return NextResponse.json(
      { ok: false, error: "Meta webhook is not configured (see META_* env vars)" },
      { status: 503 }
    );
  }

  const rawBody = await req.text();
  if (!validSignature(rawBody, req.headers.get("x-hub-signature-256"), cfg.appSecret)) {
    return NextResponse.json({ ok: false, error: "Bad signature" }, { status: 401 });
  }

  let payload: { entry?: LeadgenEntry[] };
  try {
    payload = JSON.parse(rawBody) as { entry?: LeadgenEntry[] };
  } catch {
    return NextResponse.json({ ok: false, error: "Expected JSON" }, { status: 400 });
  }

  const entries = Array.isArray(payload.entry) ? payload.entry : [];
  const seen: string[] = [];
  let failures = 0;

  for (const entry of entries) {
    const leadgenId = first(entry.leadgen_id);
    if (!leadgenId) continue;

    const details = await fetchLeadDetails(leadgenId, cfg.accessToken);
    if (!details) {
      // Answer 5xx so Meta retries this delivery later.
      failures++;
      continue;
    }

    const input = normalizeLead({
      ...details,
      leadgen_id: leadgenId,
      form_name: details.form_name ?? entry.form_id ?? null,
    });
    if ("error" in input) {
      console.error(`[webhook:meta] lead ${leadgenId} rejected: ${input.error}`);
      continue;
    }

    const id = await createLead(input);
    seen.push(leadgenId);
    await recordAudit({
      actor: `api:facebook`,
      action: "lead.created",
      entityType: "lead",
      entityId: id,
      detail: {
        name: input.full_name,
        leadgen_id: leadgenId,
        form: input.form_name,
        ad: first(entry.ad_id, entry.adgroup_id),
        via: "meta-webhook",
      },
    });
  }

  if (seen.length) revalidatePath("/dashboard", "layout");
  if (failures > 0) {
    return NextResponse.json(
      { ok: false, error: "Could not fetch some leads; retry later", stored: seen.length },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, stored: seen.length, received: entries.length });
}
