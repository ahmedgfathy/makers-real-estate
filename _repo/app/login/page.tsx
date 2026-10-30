import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, safeNext } from "@/lib/auth";
import LoginForm from "./LoginForm";
import "./login.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin login — Makers Real Estate",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const params = await searchParams;

  return (
    <main className="login-page">
      <a className="login-back" href="/">
        <span aria-hidden="true">←</span> Back to the site
      </a>

      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <img src="/img/makers-mark.png" alt="" width={220} height={209} />
          <span>
            <strong>Makers</strong>
            <small>Real Estate</small>
          </span>
        </div>

        <span className="login-eyebrow">Admin dashboard</span>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-intro">
          Sign in to manage leads, primary data and the property inventory for SODIC East.
        </p>

        <LoginForm next={safeNext(params.next)} />

        <p className="login-foot">Authorised staff only. Sessions expire after eight hours.</p>
      </section>

      <aside className="login-visual" aria-hidden="true">
        <div className="login-visual-inner">
          <span className="login-visual-eyebrow">The Lakes · SODIC East</span>
          <p className="login-visual-title">Where the water meets the address.</p>
          <div className="login-visual-stats">
            <span>
              <strong>655</strong> acres
            </span>
            <span>
              <strong>55%</strong> open space
            </span>
            <span>
              <strong>0%</strong> down
            </span>
          </div>
        </div>
      </aside>
    </main>
  );
}
