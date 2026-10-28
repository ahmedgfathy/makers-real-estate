import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  checkCredentials,
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

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, error: "Invalid username or password." },
      { status: 401 }
    );
  }

  const redirectTo = safeNext(typeof body.next === "string" ? body.next : null);
  const response = NextResponse.json({ ok: true, redirect: redirectTo });
  response.cookies.set(SESSION_COOKIE, createSessionToken(username), sessionCookieOptions());
  return response;
}
