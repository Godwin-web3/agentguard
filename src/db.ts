import { SUPABASE_ROOT_CA_2021 } from "./supabase-ca.ts";
import { AsyncLocalStorage } from "node:async_hooks";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Storage backend behind one small async interface. SQL is written once in a portable subset (`?` placeholders,
 * ON CONFLICT upserts, RETURNING, json_extract(col,'$.key')); the Postgres adapter rewrites placeholders and
 * json_extract. SQLite (node:sqlite) is for local runs and tests; Postgres (Supabase) for serverless deploys.
 *
 * Atomicity: tx() is the unit of serialization. SQLite: one connection, BEGIN IMMEDIATE plus an in-process mutex.
 * Postgres: a pinned client, BEGIN, then pg_advisory_xact_lock(AGENTGUARD_LOCK) so concurrent function instances
 * serialize every write transaction (reservations, dedup, the audit-chain append) exactly as SQLite's write lock did.
 * tx() is reentrant: a nested call joins the outer transaction (tracked per async context, not per process).
 */
export interface RunResult { changes: number }
export interface Stmt { get(...p: unknown[]): Promise<any>; all(...p: unknown[]): Promise<any[]>; run(...p: unknown[]): Promise<RunResult> }
export interface Sql {
  readonly dialect: "sqlite" | "pg";
  prepare(sql: string): Stmt;
  exec(sql: string): Promise<void>;
  /** Idempotent SQLite schema DDL (sync). No-op on Postgres, whose schema is applied as a migration (db/postgres.sql). */
  ddl(sqliteSql: string): void;
  /** Column names of a table (SQLite only; Postgres returns null so callers skip legacy column migrations). */
  columns(table: string): string[] | null;
  tx<T>(fn: () => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

const UNIQUE = (e: any) => { if (e?.code === "23505") e.message = `UNIQUE constraint failed: ${e.message}`; return e; };

// ---------------- SQLite ----------------
export class SqliteSql implements Sql {
  readonly dialect = "sqlite" as const;
  readonly raw: import("node:sqlite").DatabaseSync;
  private als = new AsyncLocalStorage<boolean>();
  private lock: Promise<void> = Promise.resolve();
  private held = false;
  constructor(raw: import("node:sqlite").DatabaseSync) { this.raw = raw; }
  static async open(path: string): Promise<SqliteSql> { return SqliteSql.openSync(path); }
  /** node:sqlite is loaded lazily so serverless bundles that only use Postgres never touch it. */
  static openSync(path: string): SqliteSql {
    const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite") as typeof import("node:sqlite");
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    const db = new DatabaseSync(path);
    db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
    return new SqliteSql(db);
  }
  /** Outside a tx, wait for any open tx (owned by another async flow) so we never write into it. */
  private async gate<T>(f: () => T): Promise<T> {
    if (this.als.getStore() || !this.held) return f();
    await this.lock; return this.gate(f);
  }
  prepare(sql: string): Stmt {
    return {
      get: (...p) => this.gate(() => this.raw.prepare(sql).get(...(p as any[])) ?? undefined),
      all: (...p) => this.gate(() => this.raw.prepare(sql).all(...(p as any[])) as any[]),
      run: (...p) => this.gate(() => ({ changes: Number(this.raw.prepare(sql).run(...(p as any[])).changes) })),
    };
  }
  async exec(sql: string) { await this.gate(() => this.raw.exec(sql)); }
  ddl(sql: string) { this.raw.exec(sql); }
  columns(t: string) { return (this.raw.prepare(`PRAGMA table_info(${t})`).all() as any[]).map(c => c.name); }
  async tx<T>(fn: () => Promise<T>): Promise<T> {
    if (this.als.getStore()) return fn();
    let release!: () => void;
    const prev = this.lock; this.lock = new Promise<void>(r => (release = r));
    await prev; this.held = true;
    try {
      this.raw.exec("BEGIN IMMEDIATE");
      try { const r = await this.als.run(true, fn); this.raw.exec("COMMIT"); return r; }
      catch (e) { this.raw.exec("ROLLBACK"); throw e; }
    } finally { this.held = false; release(); }
  }
  async close() { this.raw.close(); }
}

// ---------------- Postgres ----------------
/** `?` -> `$n` (outside quotes) and json_extract(col,'$.k') -> (col::jsonb->>'k'). */
export function toPg(sql: string): string {
  let out = "", n = 0, q = false;
  for (const ch of sql) { if (ch === "'") q = !q; out += !q && ch === "?" ? `$${++n}` : ch; }
  return out.replace(/json_extract\(\s*(\w+)\s*,\s*'\$\.(\w+)'\s*\)/g, "($1::jsonb->>'$2')");
}
const LOCK_KEY = 0x41474744; // "AGGD": the single advisory lock all write transactions take

export class PgSql implements Sql {
  readonly dialect = "pg" as const;
  readonly pool: import("pg").Pool;
  private als = new AsyncLocalStorage<import("pg").PoolClient>();
  private cache = new Map<string, string>();
  constructor(pool: import("pg").Pool) { this.pool = pool; }
  static async open(url: string, o: { max?: number; schema?: string } = {}): Promise<PgSql> {
    if (o.schema && !/^[a-z_][a-z0-9_]*$/.test(o.schema)) throw new Error("invalid schema name");
    const pg = (await import("pg")).default;
    // TLS is always verified (unless the URL says sslmode=no-verify). Supabase signs its pooler certs with its own root,
    // so that root is pinned for *.supabase.com; AGENTGUARD_DATABASE_CA (PEM) overrides for other providers.
    const u = new URL(url); const noVerify = u.searchParams.get("sslmode") === "no-verify"; u.searchParams.delete("sslmode");
    const local = ["localhost", "127.0.0.1"].includes(u.hostname) || u.hostname.startsWith("/");
    const pool = new pg.Pool({ connectionString: u.toString(), max: o.max ?? Number(process.env.AGENTGUARD_PG_POOL ?? 3), idleTimeoutMillis: 10_000,
      ...(o.schema ? { options: `-c search_path=${o.schema}` } : {}),
      ssl: local ? undefined : { rejectUnauthorized: !noVerify, ca: process.env.AGENTGUARD_DATABASE_CA || (/\.supabase\.(com|co)$/.test(u.hostname) ? SUPABASE_ROOT_CA_2021 : undefined) } });
    // COUNT/SUM return int8/numeric; amounts are minor units well inside 2^53, so parse as numbers like SQLite does.
    pg.types.setTypeParser(20, v => Number(v)); pg.types.setTypeParser(1700, v => Number(v));
    pool.on("error", e => console.error("[pg] idle client error", e.message));
    return new PgSql(pool);
  }
  private q(sql: string) { let s = this.cache.get(sql); if (!s) { s = toPg(sql); this.cache.set(sql, s); } return s; }
  private async query(sql: string, p: unknown[]) {
    const c = this.als.getStore();
    try { return await (c ?? this.pool).query(this.q(sql), p as any[]); } catch (e) { throw UNIQUE(e); }
  }
  prepare(sql: string): Stmt {
    return {
      get: async (...p) => (await this.query(sql, p)).rows[0],
      all: async (...p) => (await this.query(sql, p)).rows,
      run: async (...p) => ({ changes: (await this.query(sql, p)).rowCount ?? 0 }),
    };
  }
  async exec(sql: string) { const c = this.als.getStore(); await (c ?? this.pool).query(sql); }
  ddl(_sql: string) { /* schema is a migration on Postgres */ }
  columns(_t: string) { return null; }
  async tx<T>(fn: () => Promise<T>): Promise<T> {
    if (this.als.getStore()) return fn();
    const c = await this.pool.connect();
    try {
      await c.query("BEGIN");
      await c.query("SELECT pg_advisory_xact_lock($1)", [LOCK_KEY]);
      try { const r = await this.als.run(c, fn); await c.query("COMMIT"); return r; }
      catch (e) { await c.query("ROLLBACK").catch(() => {}); throw UNIQUE(e); }
    } finally { c.release(); }
  }
  async close() { await this.pool.end(); }
}

/** AGENTGUARD_DATABASE_URL (postgres://...) selects Postgres; otherwise SQLite at AGENTGUARD_DB. */
export async function openSql(o: { url?: string; path?: string } = {}): Promise<Sql> {
  const url = o.url ?? process.env.AGENTGUARD_DATABASE_URL;
  if (url && /^postgres(ql)?:/.test(url)) return PgSql.open(url);
  return SqliteSql.open(o.path ?? process.env.AGENTGUARD_DB ?? "./data/agentguard.db");
}
