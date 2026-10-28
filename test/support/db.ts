import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { SqliteSql, PgSql, type Sql } from "../../src/db.ts";

/**
 * Fresh database per test. AGENTGUARD_TEST_PG=postgres://... runs the suite on Postgres: each call gets its own schema
 * with db/postgres.sql applied; otherwise an in-memory SQLite database.
 */
export async function testSql(): Promise<Sql> {
  const url = process.env.AGENTGUARD_TEST_PG;
  if (!url) return SqliteSql.openSync(":memory:");
  const schema = "t_" + randomBytes(6).toString("hex");
  const admin = await PgSql.open(url, { max: 1 });
  await admin.exec(`CREATE SCHEMA ${schema}; SET search_path=${schema};\n` + readFileSync(new URL("../../db/postgres.sql", import.meta.url), "utf8"));
  await admin.close();
  return PgSql.open(url, { schema, max: 4 });
}
