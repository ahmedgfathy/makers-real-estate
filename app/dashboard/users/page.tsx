import { redirect } from "next/navigation";
import { canManageUsers, getSession, requireAdmin } from "@/lib/auth";
import { listUsers, type AdminUser } from "@/lib/users";
import { timeAgo } from "@/lib/format";
import {
  createUserAction,
  setActiveAction,
  setRoleAction,
  setPasswordAction,
} from "./actions";

export const dynamic = "force-dynamic";

type Search = { error?: string; ok?: string };

function roleName(user: AdminUser): string {
  return user.role === "admin" ? "Administrator" : "Editor";
}

function formatDate(value: Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  await requireAdmin("/dashboard/users");
  const session = await getSession();
  const mayManage = canManageUsers(session);
  const me = session?.username ?? "";
  const [users, params] = await Promise.all([listUsers(), searchParams]);

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Accounts</span>
          <h1>Dashboard access</h1>
          <p>
            Who can sign in to this dashboard. Administrators can publish to the public website
            and manage accounts; editors work with the data but cannot go live.
          </p>
        </div>
      </header>

      {params.error ? (
        <p className="dash-banner dash-banner--error" role="alert">
          {params.error}
        </p>
      ) : null}
      {params.ok ? (
        <p className="dash-banner dash-banner--ok" role="status">
          {params.ok}
        </p>
      ) : null}

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last signed in</th>
                <th>Created</th>
                {mayManage ? <th /> : null}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isMe = user.username === me;
                return (
                  <tr key={user.username}>
                    <td>
                      <span className="cell-strong">
                        {user.display_name ?? user.username}
                        {isMe ? <span className="cell-sub">you</span> : null}
                      </span>
                      <span className="cell-sub">{user.username}</span>
                    </td>
                    <td>{roleName(user)}</td>
                    <td>
                      <span
                        className={`dash-pill dash-pill--${user.active ? "ok" : "off"}`}
                      >
                        {user.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="cell-nowrap">
                      {user.last_login_at ? timeAgo(user.last_login_at) : "Never"}
                    </td>
                    <td className="cell-nowrap">{formatDate(user.created_at)}</td>
                    {mayManage ? (
                      <td className="cell-nowrap">
                        <div className="dash-row-actions">
                          <form action={setRoleAction}>
                            <input type="hidden" name="username" value={user.username} />
                            <input
                              type="hidden"
                              name="role"
                              value={user.role === "admin" ? "editor" : "admin"}
                            />
                            <button
                              type="submit"
                              className="dash-link"
                              disabled={isMe}
                              title={
                                isMe
                                  ? "You cannot change your own role here."
                                  : `Make ${user.username} ${user.role === "admin" ? "an editor" : "an administrator"}`
                              }
                            >
                              {user.role === "admin" ? "Make editor" : "Make admin"}
                            </button>
                          </form>
                          <form action={setActiveAction}>
                            <input type="hidden" name="username" value={user.username} />
                            <input
                              type="hidden"
                              name="active"
                              value={user.active ? "false" : "true"}
                            />
                            <button
                              type="submit"
                              className="dash-link dash-link--danger"
                              disabled={isMe}
                              title={isMe ? "You cannot disable your own account." : undefined}
                            >
                              {user.active ? "Disable" : "Enable"}
                            </button>
                          </form>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {mayManage ? (
        <section className="dash-grid" style={{ marginTop: "0.9rem" }}>
          <div className="dash-card">
            <h2 className="dash-card-title">Add an account</h2>
            <form className="dash-form" action={createUserAction}>
              <label className="dash-field">
                <span>Username</span>
                <input
                  className="dash-input"
                  name="username"
                  required
                  minLength={3}
                  maxLength={32}
                  pattern="[a-zA-Z0-9_.\-]{3,32}"
                  placeholder="e.g. karim"
                />
              </label>
              <label className="dash-field">
                <span>Display name</span>
                <input className="dash-input" name="display_name" placeholder="e.g. Karim Adel" />
              </label>
              <label className="dash-field">
                <span>Password</span>
                <input
                  className="dash-input"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </label>
              <label className="dash-field">
                <span>Role</span>
                <select className="dash-select" name="role" defaultValue="editor">
                  <option value="editor">Editor — manage data</option>
                  <option value="admin">Administrator — manage + publish</option>
                </select>
              </label>
              <button type="submit" className="dash-btn dash-btn--gold">
                Create account
              </button>
            </form>
          </div>

          <div className="dash-card">
            <h2 className="dash-card-title">Reset a password</h2>
            <form className="dash-form" action={setPasswordAction}>
              <label className="dash-field">
                <span>Account</span>
                <select className="dash-select" name="username" defaultValue="">
                  <option value="" disabled>
                    Choose an account
                  </option>
                  {users.map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </label>
              <label className="dash-field">
                <span>New password</span>
                <input
                  className="dash-input"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                />
              </label>
              <button type="submit" className="dash-btn">
                Update password
              </button>
            </form>

            <p className="dash-note" style={{ marginTop: "1.2rem" }}>
              The bootstrap <code>ADMIN_USERNAME</code> / <code>ADMIN_PASSWORD</code> pair from
              <code> .env</code> keeps working as a fallback, but accounts created here are stored
              in PostgreSQL with scrypt-hashed passwords and take precedence.
            </p>
          </div>
        </section>
      ) : (
        <p className="dash-note" style={{ marginTop: "0.9rem" }}>
          You are signed in as an editor. Ask an administrator to change a role, reset a
          password or add an account.
        </p>
      )}
    </div>
  );
}
