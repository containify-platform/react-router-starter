// Applies migrations/*.sql in name order, once each, recording them in
// schema_migrations. Containify runs it as the pre-deploy command, before a
// new release takes traffic: `node scripts/migrate.mjs`.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const dir = join(import.meta.dirname, "..", "migrations");
const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });

try {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
  const applied = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name));
  for (const name of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
    if (applied.has(name)) continue;
    const text = await readFile(join(dir, name), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(text);
      await tx`INSERT INTO schema_migrations (name) VALUES (${name})`;
    });
    console.log(`applied ${name}`);
  }
  console.log("migrations up to date");
} finally {
  await sql.end();
}
