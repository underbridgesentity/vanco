/* ============================================================
   Vercel serverless function - admin password check.

   Validates the team passcode against the ADMIN_PASSWORD env var, which
   lives only on the server (never shipped in the public site bundle).

   Setup (Vercel → Project → Settings → Environment Variables):
     ADMIN_PASSWORD   the shared passcode for Vanco's team
   ============================================================ */
import crypto from "node:crypto";
import { signToken } from "../lib/auth.js";

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

// Best-effort per-IP throttle. Lives in the warm instance's memory, so it
// slows down a single attacker but isn't a hard limit across instances -
// the real brute-force defenses are a long random ADMIN_PASSWORD and (later)
// durable rate limiting via the backend. Tune as needed.
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;
const attempts = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear(); // crude memory cap
  return recent.length > MAX_ATTEMPTS;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ ok: false, reason: "rate-limited" });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return res.status(200).json({ ok: false, reason: "not-configured" });

  const { password } = req.body || {};
  if (typeof password !== "string" || !password) return res.status(400).json({ ok: false, reason: "missing" });

  if (!safeEqual(password, expected)) return res.status(401).json({ ok: false, reason: "invalid" });

  // Signed, expiring session token - verifiable by other functions, not forgeable in the browser.
  return res.status(200).json({ ok: true, token: signToken() });
}
