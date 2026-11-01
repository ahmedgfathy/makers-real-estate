import { NextResponse } from "next/server";
import { recordAudit } from "@/lib/audit";
import {
  SESSION_COOKIE,
  authenticate,
  createSessionToken,
  safeNext,
  sessionCookieOptions,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

type LoginBody = {
  username?: unknown;
  password?: unknown;
  next?: unknown;
};

async function readBody(req: Request): Promise<LoginBody> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    try {
      return (await req.json()) as LoginBody;
    } catch {
      return {};
    }
  }
  const form = await req.formData();
  return {
    username: form.get("username"),
    password: form.get("password"),
    next: form.get("next"),
  };
}

export async function POST(req: Request) {
  const body = await readBody(req);
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "Enter your username and password." },
      { status: 400 }
    );
  }

  const auth = await authenticate(username, password);
  if (!auth) {
    await recordAudit({
      actor: username,
      action: "auth.login_failed",
      entityType: "session",
      detail: { ip: req.headers.get("x-real-ip") ?? null },
    });
    return NextResponse.json(
      { ok: false, error: "Invalid username or password." },
      { status: 401 }
    );
  }

  await recordAudit({
    actor: username,
    action: "auth.login",
    entityType: "session",
    detail: { role: auth.role },
  });

  const redirectTo = safeNext(typeof body.next === "string" ? body.next : null);
  const response = NextResponse.json({ ok: true, redirect: redirectTo });
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(username, auth.role),
    sessionCookieOptions()
  );
  return response;
}
