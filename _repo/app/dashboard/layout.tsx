import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";
import "./dashboard.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard — Makers Real Estate",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="dash-shell">
      <DashboardNav username={session.username} />
      <div className="dash-main">{children}</div>
    </div>
  );
}
