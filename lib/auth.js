/* ============================================================
   Shared admin-session signing (used by the Vercel functions only —
   never imported into the public site bundle).

   A session token is `<payload>.<sig>` where payload is base64url JSON
   { exp } and sig is HMAC-SHA256(payload) keyed by SESSION_SECRET
   (falls back to ADMIN_PASSWORD so no extra config is required).
   Because it's signed server-side, it can't be forged in the browser.
   ============================================================ */
import crypto from "node:crypto";

const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

export function signToken(ttlMs = 12 * 60 * 60 * 1000) {
  const s = secret();
  if (!s) return null;
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + ttlMs })).toString("base64url");
  const sig = crypto.createHmac("sha256", s).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  const s = secret();
  if (!s || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", s).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}
