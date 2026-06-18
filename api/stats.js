/* Public aggregate counts (no personal data) — powers the "X already in" total. */
import { sql, requireDb } from "../lib/db.js";

export default async function handler(req, res) {
  if (!requireDb(res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "method-not-allowed" });
  try {
    const [r] = await sql`select count(*)::int as subscribers from subscribers`;
    return res.status(200).json({ subscribers: r.subscribers });
  } catch (e) {
    return res.status(500).json({ error: "server-error" });
  }
}
