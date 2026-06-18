/* Shared helpers for the data API functions. */
import { verifyToken } from "./auth.js";

// Gate admin-only operations behind a valid signed session token.
export function requireAdmin(req, res) {
  const bearer = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!verifyToken(bearer)) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
}

// Postgres timestamp/date → "YYYY-MM-DD" (the shape the UI expects).
export const dstr = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);
