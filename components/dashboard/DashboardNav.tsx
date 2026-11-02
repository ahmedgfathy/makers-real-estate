"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { forgetUser } from "@/lib/analytics";
import type { FollowUpAlerts } from "@/lib/admin";

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
    href: "/dashboard/follow-ups",
    label: "Follow-ups",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 7.4V12l3.2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </Icon>
    ),
  },
];

export default function DashboardNav({
  username,
  role,
  alerts,
}: {
  username: string;
  role: "admin" | "editor";
  alerts: FollowUpAlerts;
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

  const due = alerts.overdue + alerts.dueToday;

  return (
    <>
      <header className="dash-mobilebar">
        <a className="dash-brand dash-brand--mobile" href="/dashboard">
          <img
            src="/img/makers-logo-black.png"
            alt="Makers Real Estate"
            width={1183}
            height={752}
          />
        </a>
        {due > 0 ? (
          <a className="dash-bell" href="/dashboard/follow-ups" aria-label={`${due} follow-ups due`}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 15.5V11a6 6 0 10-12 0v4.5L4.6 17.6h14.8L18 15.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M9.8 20.4a2.4 2.4 0 004.4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="dash-bell-count">{due > 99 ? "99+" : due}</span>
          </a>
        ) : null}
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
            src="/img/makers-logo-black.png"
            alt="Makers Real Estate"
            width={1183}
            height={752}
          />
          <span>
            <small>Admin</small>
          </span>
        </a>

        <nav className="dash-nav" aria-label="Dashboard">
          <span className="dash-nav-label">Workspace</span>
          {NAV.map((item) => {
            const badge = item.href === "/dashboard/follow-ups" && due > 0 ? due : null;
            return (
              <a
                key={item.href}
                href={item.href}
                className="dash-nav-link"
                data-active={isActive(item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
                {badge ? (
                  <em className="dash-nav-badge" aria-label={`${badge} follow-ups due`}>
                    {badge > 99 ? "99+" : badge}
                  </em>
                ) : null}
              </a>
            );
          })}
        </nav>

        {due > 0 ? (
          <a className="dash-queue-card" href="/dashboard/follow-ups">
            <strong>
              {alerts.overdue > 0
                ? `${alerts.overdue} follow-up${alerts.overdue === 1 ? "" : "s"} overdue`
                : `${alerts.dueToday} follow-up${alerts.dueToday === 1 ? "" : "s"} due today`}
            </strong>
            <small>
              {alerts.overdue > 0 && alerts.dueToday > 0
                ? `+ ${alerts.dueToday} due today`
                : alerts.overdue > 0
                  ? "Oldest first — open the queue"
                  : "Schedule the next round"}
            </small>
          </a>
        ) : null}

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
