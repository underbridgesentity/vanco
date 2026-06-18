/* Audience / newsletter — public POST (subscribe), admin GET (list). */
import { sql, requireDb } from "../lib/db.js";
import { requireAdmin, dstr } from "../lib/api.js";

const map = (r) => ({ id: r.id, name: r.name || "", email: r.email, country: r.country || "", interests: r.interests || [], tier: r.tier, date: dstr(r.created_at) });

export default async function handler(req, res) {
  if (!requireDb(res)) return;
  try {
    if (req.method === "POST") {
      const { name, email, country, interests, tier } = req.body || {};
      if (!email) return res.status(400).json({ error: "missing-fields" });
      const list = Array.isArray(interests) ? interests : [];
      const [row] = await sql`insert into subscribers (name, email, country, interests, tier)
        values (${name || null}, ${email}, ${country || null}, ${list}, ${tier || "Free"}) returning *`;
      return res.status(201).json(map(row));
    }
    if (!requireAdmin(req, res)) return;
    if (req.method === "GET") {
      const rows = await sql`select * from subscribers order by created_at desc`;
      return res.status(200).json(rows.map(map));
    }
    return res.status(405).json({ error: "method-not-allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server-error" });
  }
}
