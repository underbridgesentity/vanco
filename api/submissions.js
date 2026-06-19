/* Promo submissions - public POST (submit), admin GET (list) / PATCH (status). */
import { sql, requireDb } from "../lib/db.js";
import { requireAdmin, dstr } from "../lib/api.js";

const map = (r) => ({ id: r.id, artist: r.artist, track: r.track, genre: r.genre, email: r.email, label: r.label || "", link: r.link || "", msg: r.msg || "", status: r.status, date: dstr(r.created_at) });

export default async function handler(req, res) {
  if (!requireDb(res)) return;
  try {
    if (req.method === "POST") {
      const { artist, email, track, link, genre, label, msg } = req.body || {};
      if (!artist || !email || !track) return res.status(400).json({ error: "missing-fields" });
      const [row] = await sql`insert into submissions (artist, track, genre, email, label, link, msg)
        values (${artist}, ${track}, ${genre || null}, ${email}, ${label || null}, ${link || null}, ${msg || null}) returning *`;
      return res.status(201).json(map(row));
    }
    if (!requireAdmin(req, res)) return;
    if (req.method === "GET") {
      const rows = await sql`select * from submissions order by created_at desc`;
      return res.status(200).json(rows.map(map));
    }
    if (req.method === "PATCH") {
      const { id, status } = req.body || {};
      if (!id || !status) return res.status(400).json({ error: "missing" });
      await sql`update submissions set status=${status} where id=${id}`;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: "method-not-allowed" });
  } catch (e) {
    return res.status(500).json({ error: "server-error" });
  }
}
