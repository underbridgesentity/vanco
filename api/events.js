/* Tour events - public GET (list, auto-seeds the 2026 dates on first read),
   admin POST / PATCH / DELETE. Drives the public Tour section and the
   guest-list event references. */
import crypto from "node:crypto";
import { sql, requireDb } from "../lib/db.js";
import { requireAdmin } from "../lib/api.js";
import { DEFAULT_EVENTS } from "../lib/events.js";

const dstr = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);
const map = (r) => ({ id: r.id, date: dstr(r.event_date), city: r.city, country: r.country || "", venue: r.venue, region: r.region || "", status: r.status, tickets: r.tickets || "", cap: r.cap });

async function seedIfEmpty() {
  const [{ n }] = await sql`select count(*)::int as n from events`;
  if (n > 0) return;
  for (const e of DEFAULT_EVENTS) {
    await sql`insert into events (id, event_date, city, country, venue, region, status, tickets, cap)
      values (${e.id}, ${e.date}, ${e.city}, ${e.country || null}, ${e.venue}, ${e.region || null}, ${e.status || "Tickets"}, ${e.tickets || null}, ${e.cap || 0})
      on conflict (id) do nothing`;
  }
}

export default async function handler(req, res) {
  if (!requireDb(res)) return;
  try {
    if (req.method === "GET") {
      await seedIfEmpty();
      const rows = await sql`select * from events order by event_date`;
      return res.status(200).json(rows.map(map));
    }
    if (!requireAdmin(req, res)) return;
    if (req.method === "POST") {
      const { date, city, country, venue, region, status, tickets, cap } = req.body || {};
      if (!date || !city || !venue) return res.status(400).json({ error: "missing-fields" });
      const id = "e" + crypto.randomUUID().slice(0, 8);
      const [row] = await sql`insert into events (id, event_date, city, country, venue, region, status, tickets, cap)
        values (${id}, ${date}, ${city}, ${country || null}, ${venue}, ${region || null}, ${status || "Tickets"}, ${tickets || null}, ${Number(cap) || 0}) returning *`;
      return res.status(201).json(map(row));
    }
    if (req.method === "PATCH") {
      const { id, date, city, country, venue, region, status, tickets, cap } = req.body || {};
      if (!id) return res.status(400).json({ error: "missing-id" });
      const [row] = await sql`update events set
        event_date=${date}, city=${city}, country=${country || null}, venue=${venue}, region=${region || null}, status=${status || "Tickets"}, tickets=${tickets || null}, cap=${Number(cap) || 0}
        where id=${id} returning *`;
      if (!row) return res.status(404).json({ error: "not-found" });
      return res.status(200).json(map(row));
    }
    if (req.method === "DELETE") {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: "missing-id" });
      await sql`delete from events where id=${id}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "method-not-allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server-error" });
  }
}
