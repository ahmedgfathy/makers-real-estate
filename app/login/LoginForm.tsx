"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, next }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        redirect?: string;
      };

      if (!response.ok || !data.ok) {
        setError(data.error ?? "Unable to sign in. Please try again.");
        setPending(false);
        return;
      }

      router.replace(data.redirect ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Network error — check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form className="login-form" onSubmit={onSubmit} noValidate>
      <label className="login-field">
        <span>Username</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoFocus
        />
      </label>

      <label className="login-field">
        <span>Password</span>
        <span className="login-password">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            className="login-reveal"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.5 6.9C4.6 8.2 3.1 10 2 12c2 3.5 5.5 6 10 6 1.4 0 2.7-.3 3.9-.8M9.9 5.2A11.8 11.8 0 0112 5c4.5 0 8 2.5 10 7a15 15 0 01-2.5 3.3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2 12c2-4.5 5.5-7 10-7s8 2.5 10 7c-2 4.5-5.5 7-10 7S4 16.5 2 12z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </span>
      </label>

      {error ? (
        <p className="login-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="login-submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in to dashboard"}
      </button>
    </form>
  );
}
