/* ============================================================
   Neon (serverless Postgres) client - used by the Vercel API
   functions only, never in the public site bundle.

   Set DATABASE_URL (Neon connection string) in Vercel env. When it's
   absent the API reports "db-not-configured" and the app falls back to
   local mode, so nothing breaks before the database is wired up.
   ============================================================ */
import { neon } from "@neondatabase/serverless";

export const dbReady = () => !!process.env.DATABASE_URL;

// Tagged-template query fn (parameterised - safe from injection).
// Throws clearly if called without DATABASE_URL configured.
export const sql = dbReady() ? neon(process.env.DATABASE_URL) : null;

export function requireDb(res) {
  if (!dbReady()) {
    res.status(503).json({ error: "db-not-configured" });
    return false;
  }
  return true;
}
