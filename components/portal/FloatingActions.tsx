/**
 * Fixed call / WhatsApp buttons, mirroring the reference layout's contact rail.
 */
export default function FloatingActions({
  phoneHref,
  whatsapp,
  callLabel,
  whatsappLabel,
}: {
  phoneHref: string;
  whatsapp: string;
  callLabel: string;
  whatsappLabel: string;
}) {
  return (
    <div className="pfloat">
      <a
        className="pfloat-call"
        href={phoneHref}
        aria-label={callLabel}
        data-cta="phone"
        data-cta-surface="float"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7.2 3.8h2.2l1.2 4.1-1.8 1.6a15.3 15.3 0 0 0 5.7 5.7l1.6-1.8 4.1 1.2v2.2c0 1.1-.9 2-2 2A15.2 15.2 0 0 1 5.2 5.8c0-1.1.9-2 2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <a
        className="pfloat-wa"
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
        data-cta="whatsapp"
        data-cta-surface="float"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 11.7a8.1 8.1 0 0 1-11.9 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20 11.7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.6 8.6c.4 2.5 2.3 4.4 4.9 4.9l1-1.1 1.7.8c.2.1.3.3.2.5-.2.8-.8 1.3-1.7 1.3-3.5 0-7.4-3.9-7.4-7.4 0-.9.5-1.5 1.3-1.7.2-.1.4 0 .5.2l.8 1.7-1.3.8Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
