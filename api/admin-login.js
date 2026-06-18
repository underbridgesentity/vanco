/* ============================================================
   Vercel serverless function — admin password check.

   Validates the team passcode against the ADMIN_PASSWORD env var, which
   lives only on the server (never shipped in the public site bundle).

   Setup (Vercel → Project → Settings → Environment Variables):
     ADMIN_PASSWORD   the shared passcode for Vanco's team
   ============================================================ */
import crypto from "node:crypto";

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(200).json({ ok: false, reason: "not-configured" });

  const { password } = req.body || {};
  if (typeof password !== "string" || !password) return res.status(400).json({ ok: false, reason: "missing" });

  if (!safeEqual(password, expected)) return res.status(401).json({ ok: false, reason: "invalid" });

  // Opaque session marker. The admin holds no server-side data (it's a
  // client-side console), so this just unlocks the UI for the session.
  return res.status(200).json({ ok: true, token: crypto.randomUUID() });
}
