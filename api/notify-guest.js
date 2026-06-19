/* ============================================================
   Vercel serverless function - guest-list approval email.

   Sends a "you're on the guest list" email via Resend when the admin
   approves a request. Safe by default: with no RESEND_API_KEY set it
   simply reports "not configured" so approvals never break.

   Setup (Vercel → Project → Settings → Environment Variables):
     RESEND_API_KEY   required - your Resend API key (https://resend.com)
     GUEST_FROM       optional - e.g. "Vanco <guestlist@yourdomain.com>"
                      (defaults to Resend's test sender for unverified domains)
     GUEST_REPLY_TO   optional - reply-to address (e.g. management email)

   Requires a valid signed admin session (Authorization: Bearer <token>) so
   it can't be abused as an open email relay.
   ============================================================ */
import { verifyToken } from "../lib/auth.js";

const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function emailHtml({ name, eventName, eventCity, eventDate, guests }) {
  const party = Number(guests) > 1 ? `${guests} guests` : "1 guest";
  const when = eventDate
    ? new Date(eventDate + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
      })
    : "";
  return `<!DOCTYPE html><html><body style="margin:0;background:#050506;font-family:'Helvetica Neue',Arial,sans-serif;color:#fff;">
    <div style="max-width:520px;margin:0 auto;padding:40px 28px;">
      <div style="font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:#f5b301;">VANCO · Guest list</div>
      <h1 style="font-size:30px;line-height:1.1;letter-spacing:-.02em;text-transform:uppercase;margin:18px 0 8px;">You're on the list</h1>
      <p style="font-size:16px;line-height:1.55;color:rgba(255,255,255,.82);">Hi ${esc(name) || "there"}, your guest-list spot for <strong style="color:#fff;">${esc(eventName)}</strong>${eventCity ? ` in ${esc(eventCity)}` : ""} is confirmed.</p>
      <div style="border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:20px 22px;margin:22px 0;">
        <div style="font-size:18px;font-weight:700;text-transform:uppercase;">${esc(eventName)}</div>
        ${when ? `<div style="font-size:14px;color:rgba(255,255,255,.6);margin-top:6px;">${esc(when)}</div>` : ""}
        <div style="font-size:13px;color:#f5b301;margin-top:10px;">${esc(party)} · arrive early, names checked at the door</div>
      </div>
      <p style="font-size:14px;line-height:1.55;color:rgba(255,255,255,.6);">Bring ID matching the name on the list. See you on the floor.</p>
      <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:32px;">Vanco · ALGRA</p>
    </div></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Must come from a logged-in admin - blocks anonymous abuse of the mailer.
  const bearer = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!verifyToken(bearer)) return res.status(401).json({ sent: false, error: "unauthorized" });

  const { name, email, eventName, eventCity, eventDate, guests } = req.body || {};
  if (!email || !eventName) return res.status(400).json({ sent: false, error: "Missing email or event" });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(200).json({ sent: false, reason: "email-not-configured" });

  const from = process.env.GUEST_FROM || "Vanco <onboarding@resend.dev>";
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `You're on the guest list - ${eventName}`,
        html: emailHtml({ name, eventName, eventCity, eventDate, guests }),
        ...(process.env.GUEST_REPLY_TO ? { reply_to: process.env.GUEST_REPLY_TO } : {}),
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return res.status(502).json({ sent: false, error: detail || `Resend ${r.status}` });
    }
    return res.status(200).json({ sent: true });
  } catch (e) {
    return res.status(502).json({ sent: false, error: String(e) });
  }
}
