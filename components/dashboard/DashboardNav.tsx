"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { forgetUser } from "@/lib/analytics";

type NavItem = { href: string; label: string; icon: ReactNode };

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: (
      <Icon>
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.4" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/leads",
    label: "Leads",
    icon: (
      <Icon>
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.8 20c.5-3.4 3-5.4 6.2-5.4s5.7 2 6.2 5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M16 5.2a3 3 0 010 5.6M17.2 14.9c2.4.5 4 2.3 4.4 5.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/primary",
    label: "Primary",
    icon: (
      <Icon>
        <ellipse cx="12" cy="5.5" rx="7.5" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" stroke="currentColor" strokeWidth="1.4" />
      </Icon>
    ),
  },
  {
    href: "/dashboard/inventory",
    label: "Inventory",
    icon: (
      <Icon>
        <path d="M3 20V9.5L12 4l9 5.5V20" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6M6.5 11.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </Icon>
    ),
  },
];

export default function DashboardNav({
  username,
  role,
}: {
  username: string;
  role: "admin" | "editor";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("dash-nav-open", open);
    return () => document.body.classList.remove("dash-nav-open");
  }, [open]);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="dash-mobilebar">
        <a className="dash-brand dash-brand--mobile" href="/dashboard">
          <img
            src="/img/makers-logo.jpg"
            alt="Makers Real Estate"
            width={1536}
            height={1024}
          />
        </a>
        <button
          type="button"
          className="dash-menu-btn"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="dash-sidebar"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span />
          <span />
        </button>
      </header>

      <div
        className={`dash-scrim${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`dash-sidebar${open ? " is-open" : ""}`} id="dash-sidebar">
        <a className="dash-brand" href="/dashboard">
          <img
            src="/img/makers-logo.jpg"
            alt="Makers Real Estate"
            width={1536}
            height={1024}
          />
          <span>
            <small>Admin</small>
          </span>
        </a>

        <nav className="dash-nav" aria-label="Dashboard">
          <span className="dash-nav-label">Workspace</span>
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="dash-nav-link"
              data-active={isActive(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="dash-sidebar-foot">
          <a className="dash-site-link" href="/" target="_blank" rel="noopener noreferrer">
            View live site
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3.5 10.5 10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>

          <div className="dash-user">
            <span className="dash-avatar">{username.slice(0, 2).toUpperCase()}</span>
            <span className="dash-user-meta">
              <strong>{username}</strong>
              <small>{role === "admin" ? "Administrator" : "Editor · read-only"}</small>
            </span>
          </div>

          <form action="/api/auth/logout" method="post">
            <button type="submit" className="dash-logout" onClick={() => forgetUser()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
