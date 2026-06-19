/* Booking inquiries - public POST, admin GET / PATCH (status). */
import { sql, requireDb } from "../lib/db.js";
import { requireAdmin, dstr } from "../lib/api.js";

const map = (r) => ({ id: r.id, name: r.name, email: r.email, org: r.org || "", event: r.event, date: dstr(r.event_date), city: r.city, venue: r.venue || "", type: r.type, budget: r.budget || "", msg: r.msg || "", status: r.status, created: dstr(r.created_at) });

export default async function handler(req, res) {
  if (!requireDb(res)) return;
  try {
    if (req.method === "POST") {
      const { name, email, org, event, date, city, venue, type, budget, msg } = req.body || {};
      if (!name || !email || !event) return res.status(400).json({ error: "missing-fields" });
      const [row] = await sql`insert into bookings (name, email, org, event, event_date, city, venue, type, budget, msg)
        values (${name}, ${email}, ${org || null}, ${event}, ${date || null}, ${city || null}, ${venue || null}, ${type || null}, ${budget || null}, ${msg || null}) returning *`;
      return res.status(201).json(map(row));
    }
    if (!requireAdmin(req, res)) return;
    if (req.method === "GET") {
      const rows = await sql`select * from bookings order by created_at desc`;
      return res.status(200).json(rows.map(map));
    }
    if (req.method === "PATCH") {
      const { id, status } = req.body || {};
      if (!id || !status) return res.status(400).json({ error: "missing" });
      await sql`update bookings set status=${status} where id=${id}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "method-not-allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server-error" });
  }
}
