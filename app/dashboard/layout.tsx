import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { getFollowUpAlerts } from "@/lib/admin";
import DashboardNav from "@/components/dashboard/DashboardNav";
import Identify from "@/components/dashboard/Identify";
import "./dashboard.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Makers Real Estate",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, alerts] = await Promise.all([requireAdmin(), getFollowUpAlerts()]);

  return (
    <div className="dash-shell">
      <Identify username={session.username} />
      <DashboardNav username={session.username} role={session.role} alerts={alerts} />
      <div className="dash-main">{children}</div>
    </div>
  );
}
