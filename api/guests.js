/* Guest-list requests — public POST, admin GET / PATCH (status). */
import { sql, requireDb } from "../lib/db.js";
import { requireAdmin, dstr } from "../lib/api.js";

const map = (r) => ({ id: r.id, eventId: r.event_id, name: r.name, email: r.email, instagram: r.instagram || "", guests: r.guests, msg: r.msg || "", status: r.status, date: dstr(r.created_at) });

export default async function handler(req, res) {
  if (!requireDb(res)) return;
  try {
    if (req.method === "POST") {
      const { eventId, name, email, instagram, guests, msg } = req.body || {};
      if (!eventId || !name || !email) return res.status(400).json({ error: "missing-fields" });
      const party = Math.max(1, Math.min(10, Number(guests) || 1));
      const [row] = await sql`insert into guest_requests (event_id, name, email, instagram, guests, msg)
        values (${eventId}, ${name}, ${email}, ${instagram || null}, ${party}, ${msg || null}) returning *`;
      return res.status(201).json(map(row));
    }
    if (!requireAdmin(req, res)) return;
    if (req.method === "GET") {
      const rows = await sql`select * from guest_requests order by created_at desc`;
      return res.status(200).json(rows.map(map));
    }
    if (req.method === "PATCH") {
      const { id, status } = req.body || {};
      if (!id || !status) return res.status(400).json({ error: "missing" });
      await sql`update guest_requests set status=${status} where id=${id}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "method-not-allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server-error" });
  }
}
