import { Pool } from "pg";

/**
 * PostgreSQL connection pool.
 *
 * DATABASE_URL accepts a libpq connection string, e.g.
 *   postgresql://user:pass@localhost:5432/makers
 *   postgresql:///makers?host=/var/run/postgresql   (unix socket, peer auth)
 *
 * When unset we fall back to a local unix socket + the `makers` database,
 * which is the default for this project's development setup.
 */
const DEFAULT_HOST = "/var/run/postgresql";
const DEFAULT_DB = "makers";

type PoolConfig = ConstructorParameters<typeof Pool>[0];

const config: PoolConfig =
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : { host: DEFAULT_HOST, database: DEFAULT_DB };

// Survive Next.js dev-server hot reloads: keep one pool per process.
const globalForDb = globalThis as unknown as { __makersPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.__makersPool) {
    const pool = new Pool({
      ...config,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
    // Avoid crashing the process on idle-client errors (e.g. server restart).
    pool.on("error", (err) => {
      console.error("[db] idle client error:", err.message);
    });
    globalForDb.__makersPool = pool;
  }
  return globalForDb.__makersPool;
}

export async function query<T extends Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const res = await getPool().query<T>(text, params);
  return res.rows;
}

/** Run a function inside a transaction; rolls back on throw. */
export async function withTransaction<T>(fn: (client: TxClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client as TxClient);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* connection already broken */
    }
    throw err;
  } finally {
    client.release();
  }
}

export type TxClient = {
  query<T extends Record<string, unknown>>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
};

/** Lightweight connectivity probe used by scripts and the health check. */
export async function pingDb(): Promise<{ ok: boolean; version?: string; error?: string }> {
  try {
    const rows = await query<{ version: string }>("SELECT version() AS version");
    return { ok: true, version: rows[0]?.version };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
