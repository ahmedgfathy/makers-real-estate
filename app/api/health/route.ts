import { NextResponse } from "next/server";
import { getSite, siteSource } from "@/lib/content-db";
import { pingDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/health — database reachability + which content source is live. */
export async function GET() {
  const db = await pingDb();
  const site = await getSite();
  const source = siteSource();

  return NextResponse.json(
    {
      ok: db.ok && source === "postgres",
      source, // "postgres" | "static"
      db: db.ok
        ? { version: (db.version ?? "").split(" ").slice(0, 2).join(" ") }
        : { error: db.error },
      locales: Object.keys(site.content),
      tiles: { en: site.content.en.tiles.length, ar: site.content.ar.tiles.length },
      contact: { name: site.contact.name.en, phone: site.contact.phoneLabel },
      uptimeSec: Math.round(process.uptime()),
      ts: new Date().toISOString(),
    },
    { status: db.ok && source === "postgres" ? 200 : 503 }
  );
}
