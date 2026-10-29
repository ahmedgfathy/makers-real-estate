"use client";

import { useEffect } from "react";
import { identify } from "@/lib/analytics";

/**
 * Attaches the signed-in admin session to the PostHog person for this browser,
 * so dashboard funnels and retention line up with a real user instead of an
 * anonymous id. Runs on every dashboard route; the consent gate lives in
 * lib/analytics.ts, so nothing is sent until analytics is allowed.
 */
export default function Identify({ username }: { username: string }) {
  useEffect(() => {
    identify(`admin:${username}`, { role: "admin", username });
  }, [username]);

  return null;
}
