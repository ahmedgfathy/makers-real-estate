"use client";

import { useState, type FormEvent } from "react";
import type { Content, Lang } from "@/data/content";
import { capture } from "@/lib/analytics";
import { ui } from "@/lib/labels";

/**
 * Public "request a call back" form (section #enquiry on the landing page).
 *
 * Posts to the same POST /api/leads endpoint as Facebook lead ads, so every
 * visitor enquiry lands in the dashboard's Leads pipeline with source
 * `website`. A hidden honeypot field keeps basic spam bots out without a
 * captcha dependency. Success is a friendly confirmation with the advisor's
 * WhatsApp / phone kept one tap away.
 */
export default function LeadForm({
  c,
  lang,
  whatsapp,
  phoneHref,
}: {
  c: Content;
  lang: Lang;
  whatsapp: string;
  phoneHref: string;
}) {
  const f = c.leadForm;
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("full_name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const honeypot = String(data.get("_hp") ?? "");

    if (honeypot) {
      // Bot filled the hidden field: pretend success, store nothing.
      setDone(true);
      return;
    }

    if (!name || phone.replace(/\D/g, "").length < 8) {
      setError(f.required);
      return;
    }
    if (data.get("consent") !== "on") {
      setError(f.consent);
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          phone,
          email: String(data.get("email") ?? "").trim() || undefined,
          project: String(data.get("project") ?? "").trim() || undefined,
          bedrooms: bedroomsValue(String(data.get("bedrooms") ?? "")),
          message: String(data.get("message") ?? "").trim() || undefined,
          source: "website",
          form_name: "Website — Request a call",
          consent: true,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      capture("lead_form_submitted", {
        language: lang,
        project: String(data.get("project") ?? "") || "unspecified",
        surface: "enquiry",
      });
      setDone(true);
      form.reset();
    } catch {
      setError(f.error);
    } finally {
      setPending(false);
    }
  }

  const t = ui[lang];

  return (
    <section className="enquiry" id="enquiry" aria-labelledby="enquiry-title">
      <div className="enquiry-inner">
        <div className="enquiry-intro">
          <p className="enquiry-kicker">{f.kicker}</p>
          <h2 className="enquiry-title" id="enquiry-title">
            {f.title}
          </h2>
          <p className="enquiry-lede">{f.lede}</p>

          <div className="enquiry-alt">
            <a
              className="btn btn--ghost btn--sm"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="whatsapp"
              data-cta-surface="enquiry"
            >
              <span>{c.footer.whatsapp}</span>
            </a>
            <a
              className="btn btn--ghost btn--sm phone"
              href={phoneHref}
              data-cta="phone"
              data-cta-surface="enquiry"
            >
              <span>{c.footer.call}</span>
            </a>
          </div>
        </div>

        <div className="enquiry-card">
          {done ? (
            <div className="enquiry-done" role="status">
              <h3>{f.successTitle}</h3>
              <p>{f.successLede}</p>
              <div className="enquiry-alt">
                <a
                  className="btn btn--solid btn--sm"
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="whatsapp"
                  data-cta-surface="enquiry-success"
                >
                  <span>{c.footer.whatsapp}</span>
                </a>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setDone(false)}
                >
                  <span>{f.submit}</span>
                </button>
              </div>
            </div>
          ) : (
            <form className="enquiry-form" onSubmit={onSubmit} noValidate>
              {/* Honeypot — humans never see or fill this. */}
              <input
                type="text"
                name="_hp"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="enquiry-hp"
              />

              <label className="enquiry-field">
                <span>
                  {f.name} <b aria-hidden="true">*</b>
                </span>
                <input
                  type="text"
                  name="full_name"
                  autoComplete="name"
                  placeholder={f.nameHint}
                  required
                />
              </label>

              <label className="enquiry-field">
                <span>
                  {f.phone} <b aria-hidden="true">*</b>
                </span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  dir="ltr"
                  placeholder={f.phoneHint}
                  required
                />
              </label>

              <label className="enquiry-field">
                <span>{f.email}</span>
                <input type="email" name="email" autoComplete="email" placeholder={f.emailHint} />
              </label>

              <label className="enquiry-field">
                <span>{f.project}</span>
                <select name="project" defaultValue="">
                  <option value="" disabled />
                  {f.projectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="enquiry-field">
                <span>{f.bedrooms}</span>
                <select name="bedrooms" defaultValue="">
                  <option value="" disabled />
                  {f.bedroomOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="enquiry-field enquiry-field--wide">
                <span>{f.message}</span>
                <textarea name="message" rows={3} placeholder={f.messageHint} />
              </label>

              <label className="enquiry-consent enquiry-field--wide">
                <input type="checkbox" name="consent" required />
                <span>{f.consent}</span>
              </label>

              {error ? (
                <p className="enquiry-error enquiry-field--wide" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="enquiry-actions enquiry-field--wide">
                <button
                  type="submit"
                  className="btn btn--solid"
                  disabled={pending}
                  data-cta="lead_form"
                  data-cta-surface="enquiry"
                >
                  <span>{pending ? f.submitting : f.submit}</span>
                </button>
                <small className="enquiry-required">{f.required}</small>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/** "2" → 2, "4+" → 4, "Any"/"" → null (the API treats null as unset). */
function bedroomsValue(option: string): number | null {
  const digits = option.replace(/\D/g, "");
  if (!digits || /any|الكل/i.test(option)) return null;
  return Number(digits);
}
