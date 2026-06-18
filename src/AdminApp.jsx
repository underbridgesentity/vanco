/* ============================================================
   VANCO — admin app
   ============================================================ */
import React, { useState, useEffect } from "react";
import { Icon, PLATFORMS, useStore, fmtDate, fmtFull, tourById } from "./store.jsx";
import { ASSETS } from "./assets.js";

const AA = { wordW: ASSETS.wordW, monoW: ASSETS.monoW, monoB: ASSETS.monoB };
const scClass = (s) => s.toLowerCase().replace(/\s+/g, "");
const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const todayStr = () => new Date().toISOString().slice(0, 10);
const mailto = (e) => `mailto:${e}`;
const httpify = (u) => (/^https?:\/\//.test(u) ? u : `https://${u}`);

function StatusChip({ s }) { return <span className={`sc ${scClass(s)}`}>{s}</span>; }

/* Download an array of flat objects as a CSV file (Excel-friendly, BOM + CRLF). */
function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* Lightweight transient toast for admin actions. */
function useToast() {
  const [notice, setNotice] = useState(null);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(null), 5000); return () => clearTimeout(t); }, [notice]);
  const node = notice ? <div className={`toast ${notice.kind || "info"}`}><Icon name={notice.icon || "check"} size={14} /> {notice.msg}</div> : null;
  return [node, (msg, opts = {}) => setNotice({ msg, ...opts })];
}

/* ---------- OVERVIEW ---------- */
function Overview({ go }) {
  const { submissions, bookings, fans, guestlist, fanTotal } = useStore();
  const newSubs = submissions.filter((s) => s.status === "New").length;
  const pendBook = bookings.filter((b) => b.status === "New" || b.status === "Reviewing").length;
  const inner = fans.filter((f) => f.tier === "Inner Circle").length;
  const feed = [
    ...submissions.slice(0, 4).map((s) => ({ ic: "music", t: <><b>{s.artist}</b> submitted “{s.track}”</>, d: `${s.genre} · ${fmtDate(s.date)}`, _d: s.date })),
    ...bookings.slice(0, 3).map((b) => ({ ic: "calendar", t: <><b>{b.org || b.name}</b> — {b.event}</>, d: `${b.type} · ${b.city}`, _d: b.created })),
    ...guestlist.slice(0, 3).map((g) => ({ ic: "pin", t: <><b>{g.name}</b> requested guest list{tourById[g.eventId] ? ` — ${tourById[g.eventId].venue}` : ""}</>, d: `${g.guests} ${g.guests > 1 ? "people" : "person"} · ${fmtDate(g.date)}`, _d: g.date })),
    ...fans.slice(0, 3).map((f) => ({ ic: "users", t: <><b>{f.name}</b> joined{f.tier === "Inner Circle" ? " — Inner Circle" : ""}</>, d: `${f.country} · ${fmtDate(f.date)}`, _d: f.date })),
  ].sort((a, b) => (a._d < b._d ? 1 : -1)).slice(0, 8);
  const growth = [62, 70, 58, 88, 96, 110, 134, 128, 156, 172, 198, 240];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const mx = Math.max(...growth);
  const cards = [
    { ic: "inbox", n: newSubs, l: "New submissions", d: <span className="up"><Icon name="trend" size={12} /> {submissions.length} total in queue</span>, go: "submissions" },
    { ic: "calendar", n: pendBook, l: "Open bookings", d: <span className="up"><Icon name="trend" size={12} /> {bookings.length} inquiries</span>, go: "bookings" },
    { ic: "users", n: fanTotal.toLocaleString(), l: "Audience", d: <span className="up"><Icon name="trend" size={12} /> +18% this month</span>, go: "audience" },
    { ic: "star", n: inner + 1842, l: "Inner Circle", d: <span className="up"><Icon name="trend" size={12} /> paid tier</span>, go: "audience" },
  ];
  return (
    <div>
      <div className="stat-grid">
        {cards.map((c, i) => (
          <div className="statcard" key={i} onClick={() => go(c.go)} style={{ cursor: "pointer" }}>
            <div className="sc-top"><div className="ic"><Icon name={c.ic} size={17} /></div><Icon name="arrowUR" size={16} /></div>
            <div className="sc-n">{c.n}</div>
            <div className="sc-l">{c.l}</div>
            <div className="sc-d">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-h"><h3><Icon name="dot" size={12} style={{ color: "var(--accent)" }} /> Recent activity</h3><span className="mono">LIVE</span></div>
          <div className="feed">
            {feed.map((f, i) => (
              <div className="feed-item" key={i}>
                <div className="fi-ic"><Icon name={f.ic} size={15} /></div>
                <div><div className="fi-t">{f.t}</div><div className="fi-d">{f.d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-h"><h3>Audience growth</h3><span className="mono">2026</span></div>
          <div className="chart">
            <div className="bars">
              {growth.map((g, i) => <div className="bar" key={i} style={{ height: `${(g / mx) * 100}%`, background: i === growth.length - 1 ? "var(--accent)" : undefined }}><span>{g}k</span></div>)}
            </div>
            <div className="bars-x">{months.map((m, i) => <span key={i}>{m}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SUBMISSIONS ---------- */
const SUB_STATUSES = ["New", "Listened", "Shortlist", "Signed", "Passed"];
function Submissions({ query }) {
  const { submissions, setSubStatus } = useStore();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const [toast, showToast] = useToast();
  const list = submissions.filter((s) =>
    (filter === "All" || s.status === filter) &&
    (!query || (s.artist + s.track + s.genre).toLowerCase().includes(query.toLowerCase())));
  const cur = submissions.find((s) => s.id === open);
  const exportCsv = () => {
    downloadCsv(`vanco-submissions-${todayStr()}.csv`, list.map((s) => ({ Artist: s.artist, Track: s.track, Genre: s.genre, Email: s.email, Label: s.label || "", Link: s.link, Status: s.status, Received: s.date })));
    showToast(`Exported ${list.length} submission${list.length === 1 ? "" : "s"} to CSV.`, { kind: "ok" });
  };
  return (
    <div>
      <div className="filterbar">
        {["All", ...SUB_STATUSES].map((f) => <button key={f} className={`fchip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}{f !== "All" ? ` · ${submissions.filter((s) => s.status === f).length}` : ""}</button>)}
        <span className="spacer" />
        <button className="abtn ghost" onClick={exportCsv} disabled={!list.length}><Icon name="download" size={14} /> Export</button>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Artist</th><th>Track</th><th>Genre</th><th>Received</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className={s._new ? "row-new" : ""} onClick={() => setOpen(s.id)}>
                  <td><div className="cellflex"><span className="tav">{initials(s.artist)}</span><span className="strong">{s.artist}</span></div></td>
                  <td>{s.track}{s._new && <span className="cellsub" style={{ color: "var(--accent)" }}>● just submitted</span>}</td>
                  <td className="muted">{s.genre}</td>
                  <td className="mono muted">{fmtDate(s.date)}</td>
                  <td><StatusChip s={s.status} /></td>
                  <td><Icon name="chevron" size={16} style={{ color: "var(--amute)" }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty">No submissions match.</div>}
        </div>
      </div>
      {cur && (
        <Drawer onClose={() => setOpen(null)} title={cur.track} sub={`${cur.artist} · ${cur.genre}`}
          foot={<>
            <button className="abtn primary" onClick={() => { setSubStatus(cur.id, "Shortlist"); }}><Icon name="star" size={14} /> Shortlist</button>
            <button className="abtn ghost" onClick={() => setSubStatus(cur.id, "Listened")}><Icon name="check" size={14} /> Mark listened</button>
            <button className="abtn danger" onClick={() => setSubStatus(cur.id, "Passed")}>Pass</button>
          </>}>
          <a className="drawer-play" href={cur.link ? httpify(cur.link) : undefined} target="_blank" rel="noreferrer" title="Open the submitted track" style={{ cursor: cur.link ? "pointer" : "default", textDecoration: "none" }}>
            <span className="pp"><Icon name="play" size={16} /></span>
            <span className="miniwave">{Array.from({ length: 30 }).map((_, i) => <i key={i} style={{ height: `${20 + Math.abs(Math.sin(i)) * 80}%`, animationDelay: `${i * 0.04}s` }} />)}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--amute)" }}>OPEN ↗</span>
          </a>
          <dl className="dl">
            <dt>Status</dt><dd><StatusChip s={cur.status} /></dd>
            <dt>Artist</dt><dd>{cur.artist}</dd>
            <dt>Email</dt><dd><a href={mailto(cur.email)}>{cur.email}</a></dd>
            <dt>Label</dt><dd>{cur.label || "—"}</dd>
            <dt>Genre</dt><dd>{cur.genre}</dd>
            <dt>Link</dt><dd>{cur.link ? <a href={httpify(cur.link)} target="_blank" rel="noreferrer">{cur.link}</a> : "—"}</dd>
            <dt>Received</dt><dd>{fmtFull(cur.date)}</dd>
          </dl>
          {cur.msg && <div className="dmsg"><div className="lab">Message</div>{cur.msg}</div>}
        </Drawer>
      )}
      {toast}
    </div>
  );
}

/* ---------- BOOKINGS ---------- */
const BOOK_STATUSES = ["New", "Reviewing", "Confirmed", "Declined"];
function Bookings({ query }) {
  const { bookings, setBookStatus } = useStore();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const list = bookings.filter((b) =>
    (filter === "All" || b.status === filter) &&
    (!query || (b.event + b.org + b.city + b.name).toLowerCase().includes(query.toLowerCase())));
  const cur = bookings.find((b) => b.id === open);
  return (
    <div>
      <div className="filterbar">
        {["All", ...BOOK_STATUSES].map((f) => <button key={f} className={`fchip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}{f !== "All" ? ` · ${bookings.filter((b) => b.status === f).length}` : ""}</button>)}
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Event</th><th>Type</th><th>When</th><th>Location</th><th>Budget</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className={b._new ? "row-new" : ""} onClick={() => setOpen(b.id)}>
                  <td><div className="strong">{b.event}</div><div className="cellsub">{b.org || b.name}{b._new && " · NEW"}</div></td>
                  <td className="muted">{b.type}</td>
                  <td className="mono muted">{fmtDate(b.date, { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="muted">{b.city}</td>
                  <td className="mono">{b.budget}</td>
                  <td><StatusChip s={b.status} /></td>
                  <td><Icon name="chevron" size={16} style={{ color: "var(--amute)" }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty">No bookings match.</div>}
        </div>
      </div>
      {cur && (
        <Drawer onClose={() => setOpen(null)} title={cur.event} sub={`${cur.type} · ${cur.city}`}
          foot={<>
            <button className="abtn primary" onClick={() => setBookStatus(cur.id, "Confirmed")}><Icon name="check" size={14} /> Confirm</button>
            <button className="abtn ghost" onClick={() => setBookStatus(cur.id, "Reviewing")}>Reviewing</button>
            <button className="abtn danger" onClick={() => setBookStatus(cur.id, "Declined")}>Decline</button>
          </>}>
          <dl className="dl">
            <dt>Status</dt><dd><StatusChip s={cur.status} /></dd>
            <dt>Contact</dt><dd>{cur.name}</dd>
            <dt>Org</dt><dd>{cur.org || "—"}</dd>
            <dt>Email</dt><dd><a href={mailto(cur.email)}>{cur.email}</a></dd>
            <dt>Date</dt><dd>{fmtFull(cur.date)}</dd>
            <dt>Location</dt><dd>{cur.city}</dd>
            <dt>Venue</dt><dd>{cur.venue || "—"}</dd>
            <dt>Budget</dt><dd>{cur.budget}</dd>
          </dl>
          {cur.msg && <div className="dmsg"><div className="lab">Details</div>{cur.msg}</div>}
        </Drawer>
      )}
    </div>
  );
}

/* ---------- AUDIENCE ---------- */
function Audience({ query }) {
  const { fans, fanTotal } = useStore();
  const [toast, showToast] = useToast();
  const list = fans.filter((f) => !query || (f.name + f.email + f.country).toLowerCase().includes(query.toLowerCase()));
  const byRegion = [["South Africa", 38], ["Europe", 27], ["Americas", 14], ["Middle East", 11], ["Asia", 10]];
  const byInterest = [["New music", 92], ["Tour alerts", 78], ["Exclusive mixes", 54], ["Merch drops", 41]];
  const exportCsv = () => {
    downloadCsv(`vanco-subscribers-${todayStr()}.csv`, list.map((f) => ({ Name: f.name, Email: f.email, Country: f.country, Interests: (f.interests || []).join("; "), Tier: f.tier, Joined: f.date })));
    showToast(`Exported ${list.length} subscriber${list.length === 1 ? "" : "s"} to CSV.`, { kind: "ok" });
  };
  return (
    <div>
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="statcard"><div className="sc-top"><div className="ic"><Icon name="users" size={17} /></div></div><div className="sc-n">{fanTotal.toLocaleString()}</div><div className="sc-l">Total subscribers</div><div className="sc-d up"><Icon name="trend" size={12} /> +4,210 this month</div></div>
        <div className="statcard"><div className="sc-top"><div className="ic"><Icon name="star" size={17} /></div></div><div className="sc-n">1,8{fans.filter((f) => f.tier === "Inner Circle").length}2</div><div className="sc-l">Inner Circle (paid)</div><div className="sc-d up"><Icon name="trend" size={12} /> $24/yr</div></div>
        <div className="statcard"><div className="sc-top"><div className="ic"><Icon name="globe" size={17} /></div></div><div className="sc-n">64</div><div className="sc-l">Countries</div><div className="sc-d up"><Icon name="trend" size={12} /> global</div></div>
      </div>
      <div className="aud-grid">
        <div className="panel">
          <div className="panel-h"><h3>Subscribers</h3><button className="abtn ghost" onClick={exportCsv} disabled={!list.length}><Icon name="download" size={14} /> Export CSV</button></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Name</th><th>Country</th><th>Interests</th><th>Tier</th><th>Joined</th></tr></thead>
              <tbody>
                {list.map((f) => (
                  <tr key={f.id} className={f._new ? "row-new" : ""}>
                    <td><div className="cellflex"><span className="tav">{initials(f.name)}</span><div><div className="strong">{f.name}</div><div className="cellsub">{f.email}</div></div></div></td>
                    <td className="muted">{f.country}</td>
                    <td className="muted" style={{ fontSize: 12 }}>{f.interests.join(", ")}</td>
                    <td><span className={`sc ${f.tier === "Inner Circle" ? "inner" : "free"}`}>{f.tier}</span></td>
                    <td className="mono muted">{fmtDate(f.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && <div className="empty">No subscribers match.</div>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel">
            <div className="panel-h"><h3>By region</h3></div>
            {byRegion.map(([r, v]) => <div className="mini-stat" key={r}><span className="ms-l">{r}</span><span className="barline"><span style={{ width: `${v}%` }} /></span><span className="ms-n">{v}%</span></div>)}
          </div>
          <div className="panel">
            <div className="panel-h"><h3>By interest</h3></div>
            {byInterest.map(([r, v]) => <div className="mini-stat" key={r}><span className="ms-l">{r}</span><span className="barline"><span style={{ width: `${v}%` }} /></span><span className="ms-n">{v}%</span></div>)}
          </div>
        </div>
      </div>
      {toast}
    </div>
  );
}

/* ---------- MERCH ---------- */
const ADMIN_PRODUCTS = [
  { n: "Borders Tour Tee", p: "$45", s: "Draft", stock: "—" },
  { n: "V Monogram Cap", p: "$38", s: "Draft", stock: "—" },
  { n: "Ma Tnsani — Vinyl", p: "$32", s: "Draft", stock: "500 planned" },
];
function Merch() {
  const [toast, showToast] = useToast();
  const soon = () => showToast("The store isn’t live yet — product tools unlock at launch.", { kind: "info", icon: "bag" });
  return (
    <div>
      <div className="filterbar">
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--amute)", letterSpacing: ".06em" }}>STORE — NOT YET LIVE</span>
        <span className="spacer" />
        <button className="abtn primary" onClick={soon}><Icon name="plus" size={14} /> Add product</button>
      </div>
      <div className="prod-grid">
        {ADMIN_PRODUCTS.map((p) => (
          <div className="prodcard" key={p.n}>
            <div className="pimg"><img src={AA.monoW} alt="" /></div>
            <div className="pbody">
              <div className="pn">{p.n}</div>
              <div className="pp">{p.p} · {p.stock} in stock</div>
              <div className="prow"><span className="sc passed">{p.s}</span><button className="abtn ghost" style={{ padding: "8px 12px" }} onClick={soon}>Edit</button></div>
            </div>
          </div>
        ))}
        <div className="prodcard" onClick={soon} style={{ display: "grid", placeItems: "center", minHeight: 220, border: "1px dashed var(--aline)", background: "transparent", cursor: "pointer" }}>
          <div style={{ textAlign: "center", color: "var(--amute)" }}><Icon name="plus" size={24} style={{ margin: "0 auto 10px" }} /><div style={{ fontSize: 13 }}>New product</div></div>
        </div>
      </div>
      {toast}
    </div>
  );
}

/* ---------- SETTINGS ---------- */
function Settings({ onReset }) {
  const [t, setT] = useState({ submissions: true, bookings: true, weekly: false });
  return (
    <div style={{ maxWidth: 680 }}>
      <div className="set-card">
        <h3>Smart links</h3>
        <p>The streaming destinations used across the public site’s “listen” buttons and player.</p>
        {PLATFORMS.map((pl) => (
          <div className="set-row" key={pl.key}><span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}><Icon name={pl.icon} size={18} /> {pl.label}</span><span className="mono" style={{ color: "var(--amute)", fontSize: 12 }}>Connected</span></div>
        ))}
      </div>
      <div className="set-card">
        <h3>Notifications</h3>
        <p>Get alerted when new activity hits the platform.</p>
        {[["submissions", "New promo submissions"], ["bookings", "New booking inquiries"], ["weekly", "Weekly audience digest"]].map(([k, l]) => (
          <div className="set-row" key={k}><span style={{ fontSize: 14 }}>{l}</span><button className={`toggle ${t[k] ? "on" : ""}`} onClick={() => setT({ ...t, [k]: !t[k] })} /></div>
        ))}
      </div>
      <div className="set-card">
        <h3>Guest-list emails</h3>
        <p>When you approve a guest-list request, the fan is automatically emailed a confirmation. This runs through the <span className="mono" style={{ color: "var(--amute)" }}>/api/notify-guest</span> function — set <span className="mono" style={{ color: "var(--amute)" }}>RESEND_API_KEY</span> (and optionally <span className="mono" style={{ color: "var(--amute)" }}>GUEST_FROM</span>) in your Vercel project to switch it on. Until then, approvals still work — they just won't send mail.</p>
        <div className="set-row"><span style={{ fontSize: 14 }}>Auto-email on approval</span><span className="mono" style={{ color: "var(--amute)", fontSize: 12 }}>Configure in Vercel</span></div>
      </div>
      <div className="set-card">
        <h3>Demo data</h3>
        <p>This prototype stores submissions, bookings, subscribers and guest-list requests locally so anything submitted on the public site appears here. Reset to the original sample set.</p>
        <button className="abtn danger" onClick={onReset}>Reset demo data</button>
      </div>
    </div>
  );
}

/* ---------- GUEST LIST ---------- */
const GUEST_STATUSES = ["Pending", "Approved", "Waitlist", "Declined"];

// Best-effort approval email via the /api/notify-guest serverless function.
// Never throws — returns a status the UI can surface gently.
async function notifyApproved(g, ev) {
  try {
    const r = await fetch("/api/notify-guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: g.name, email: g.email, eventName: ev.venue, eventCity: ev.city, eventDate: ev.date, guests: g.guests }),
    });
    if (!r.ok) return { sent: false, reason: "error" };
    return await r.json().catch(() => ({ sent: false, reason: "error" }));
  } catch (e) {
    return { sent: false, reason: "no-endpoint" }; // e.g. local dev without the function
  }
}

function GuestList({ query }) {
  const { guestlist, setGuestStatus, approvedFor } = useStore();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const [notice, setNotice] = useState(null);
  const approve = async (g, ev) => {
    setGuestStatus(g.id, "Approved");
    const res = await notifyApproved(g, ev);
    if (res.sent) setNotice({ kind: "ok", msg: `Approved — confirmation emailed to ${g.name}.` });
    else if (res.reason === "email-not-configured") setNotice({ kind: "info", msg: `${g.name} approved. Add RESEND_API_KEY in Vercel to auto-email confirmations.` });
    else setNotice({ kind: "info", msg: `${g.name} approved. (Email service not reachable here.)` });
  };
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(null), 6000); return () => clearTimeout(t); }, [notice]);
  const list = guestlist.filter((g) =>
    (filter === "All" || g.status === filter) &&
    (!query || (g.name + g.email + (tourById[g.eventId]?.venue || "")).toLowerCase().includes(query.toLowerCase())));
  const cur = guestlist.find((g) => g.id === open);
  const ev = cur ? tourById[cur.eventId] : null;
  const eventsWithReq = [...new Set(guestlist.map((g) => g.eventId))]
    .map((id) => tourById[id]).filter(Boolean)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const exportCsv = () => {
    downloadCsv(`vanco-guestlist-${todayStr()}.csv`, list.map((g) => {
      const e = tourById[g.eventId] || {};
      return { Guest: g.name, Email: g.email, Instagram: g.instagram || "", Party: g.guests, Event: e.venue || "", City: e.city || "", "Event date": e.date || "", Requested: g.date, Status: g.status };
    }));
    setNotice({ kind: "ok", msg: `Exported ${list.length} request${list.length === 1 ? "" : "s"} to CSV.` });
  };
  return (
    <div>
      <div className="cap-grid">
        {eventsWithReq.map((e) => {
          const approved = approvedFor(e.id);
          const pending = guestlist.filter((g) => g.eventId === e.id && g.status === "Pending").length;
          const full = approved >= (e.cap || 0);
          const pct = e.cap ? Math.min(100, Math.round((approved / e.cap) * 100)) : 0;
          return (
            <div className="capcard" key={e.id}>
              <div className="cap-top"><div className="cap-ev">{e.venue}</div><span className="mono cap-date">{fmtDate(e.date)}</span></div>
              <div className="cap-city mono">{e.city}, {e.country}</div>
              <div className="cap-bar"><span className={full ? "full" : ""} style={{ width: `${pct}%` }} /></div>
              <div className="cap-meta"><span><b>{approved}</b> / {e.cap} approved</span>{pending > 0 && <span className="cap-pending">{pending} pending</span>}</div>
            </div>
          );
        })}
      </div>
      <div className="filterbar">
        {["All", ...GUEST_STATUSES].map((f) => <button key={f} className={`fchip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>{f}{f !== "All" ? ` · ${guestlist.filter((g) => g.status === f).length}` : ""}</button>)}
        <span className="spacer" />
        <button className="abtn ghost" onClick={exportCsv} disabled={!list.length}><Icon name="download" size={14} /> Export</button>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Guest</th><th>Event</th><th>Party</th><th>Requested</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((g) => {
                const e = tourById[g.eventId];
                return (
                  <tr key={g.id} className={g._new ? "row-new" : ""} onClick={() => setOpen(g.id)}>
                    <td><div className="cellflex"><span className="tav">{initials(g.name)}</span><div><div className="strong">{g.name}</div><div className="cellsub">{g.email}</div></div></div></td>
                    <td><div>{e?.venue || "—"}</div><div className="cellsub">{e ? `${fmtDate(e.date)} · ${e.city}` : ""}</div></td>
                    <td className="muted">{g.guests} {g.guests > 1 ? "people" : "person"}</td>
                    <td className="mono muted">{fmtDate(g.date)}</td>
                    <td><StatusChip s={g.status} /></td>
                    <td><Icon name="chevron" size={16} style={{ color: "var(--amute)" }} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty">No guest-list requests match.</div>}
        </div>
      </div>
      {cur && ev && (
        <Drawer onClose={() => setOpen(null)} title={cur.name} sub={`${ev.venue} · ${fmtDate(ev.date)}`}
          foot={<>
            <button className="abtn primary" onClick={() => approve(cur, ev)}><Icon name="check" size={14} /> Approve</button>
            <button className="abtn ghost" onClick={() => setGuestStatus(cur.id, "Waitlist")}>Waitlist</button>
            <button className="abtn danger" onClick={() => setGuestStatus(cur.id, "Declined")}>Decline</button>
          </>}>
          {(() => {
            const approved = approvedFor(ev.id);
            const full = approved >= (ev.cap || 0);
            return <div className={`cap-banner ${full ? "full" : ""}`}><Icon name={full ? "x" : "check"} size={14} /> {approved} / {ev.cap} approved{full ? " — at capacity" : ` · ${ev.cap - approved} spot${ev.cap - approved === 1 ? "" : "s"} left`}</div>;
          })()}
          <dl className="dl">
            <dt>Status</dt><dd><StatusChip s={cur.status} /></dd>
            <dt>Event</dt><dd>{ev.venue}, {ev.city}</dd>
            <dt>Date</dt><dd>{fmtFull(ev.date)}</dd>
            <dt>Email</dt><dd><a href={mailto(cur.email)}>{cur.email}</a></dd>
            <dt>Instagram</dt><dd>{cur.instagram ? <a href={`https://instagram.com/${cur.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer">{cur.instagram}</a> : "—"}</dd>
            <dt>Party size</dt><dd>{cur.guests} {cur.guests > 1 ? "people" : "person"}</dd>
            <dt>Requested</dt><dd>{fmtFull(cur.date)}</dd>
          </dl>
          {cur.msg && <div className="dmsg"><div className="lab">Why them</div>{cur.msg}</div>}
        </Drawer>
      )}
      {notice && <div className={`toast ${notice.kind}`}><Icon name="check" size={14} /> {notice.msg}</div>}
    </div>
  );
}

/* ---------- DRAWER ---------- */
function Drawer({ title, sub, children, foot, onClose }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-h">
          <div><h2>{title}</h2><div className="sub">{sub}</div></div>
          <button className="abtn ghost" style={{ padding: 10 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {foot && <div className="drawer-foot">{foot}</div>}
      </div>
    </>
  );
}

/* ---------- ADMIN LOGIN ---------- */
// Password is checked by the /api/admin-login serverless function, so the
// passcode lives only in Vercel env (ADMIN_PASSWORD), never in this bundle.
export function AdminLogin({ onSuccess, onCancel }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!pw || busy) return;
    setBusy(true); setErr("");
    const devBypass = () => { if (import.meta.env.DEV && pw === "admin") { onSuccess("dev"); return true; } return false; };
    try {
      const r = await fetch("/api/admin-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const data = await r.json().catch(() => ({ ok: false, reason: "unreachable" }));
      if (data.ok) { onSuccess(data.token || "1"); return; }
      if (devBypass()) return;
      setErr(
        data.reason === "not-configured" ? "Admin login isn’t set up yet — add ADMIN_PASSWORD in Vercel." :
        data.reason === "unreachable" ? "Couldn’t reach the login service. Try again." :
        "Incorrect password."
      );
    } catch {
      if (!devBypass()) setErr("Couldn’t reach the login service. Try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin-login">
      <form className="al-card" onSubmit={submit}>
        <img className="al-logo" src={AA.monoW} alt="VANCO" />
        <div className="al-kicker mono">Team access</div>
        <h1>Admin</h1>
        <p>This area is private. Enter the team passcode to continue.</p>
        <input className="al-input" type="password" autoFocus value={pw} placeholder="Passcode" onChange={(e) => { setPw(e.target.value); setErr(""); }} />
        {err && <div className="al-err">{err}</div>}
        <button className="abtn primary al-submit" type="submit" disabled={busy}>{busy ? "Checking…" : "Enter admin"} <Icon name="arrowR" size={15} /></button>
        <button className="al-back" type="button" onClick={onCancel}><Icon name="arrowL" size={14} /> Back to site</button>
      </form>
    </div>
  );
}

/* ---------- ADMIN ROOT ---------- */
const NAV = [
  ["overview", "Overview", "grid"],
  ["submissions", "Submissions", "inbox"],
  ["bookings", "Bookings", "calendar"],
  ["guestlist", "Guest List", "pin"],
  ["audience", "Audience", "users"],
  ["merch", "Merch", "bag"],
  ["settings", "Settings", "settings"],
];
export function AdminApp({ onExit, onLogout }) {
  const store = useStore();
  const [page, setPage] = useState("overview");
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const newSubs = store.submissions.filter((s) => s.status === "New").length;
  const newBooks = store.bookings.filter((b) => b.status === "New").length;
  const pendGuests = store.guestlist.filter((g) => g.status === "Pending").length;
  const counts = { submissions: newSubs, bookings: newBooks, guestlist: pendGuests };
  const titles = {
    overview: ["Overview", "Control room — everything at a glance"],
    submissions: ["Submissions", "Promo & demo inbox — A&R for ALGRA"],
    bookings: ["Bookings", "Inbound show & event inquiries"],
    guestlist: ["Guest List", "Per-show guest list — requests & capacity"],
    audience: ["Audience", "The database — fans & subscribers"],
    merch: ["Merch", "Store & product management"],
    settings: ["Settings", "Platform configuration"],
  };
  const go = (p) => { setPage(p); setNavOpen(false); setQuery(""); };
  const showSearch = ["submissions", "bookings", "guestlist", "audience"].includes(page);
  return (
    <div className="admin">
      <aside className={`aside ${navOpen ? "open" : ""}`}>
        <div className="aside-logo"><img src={AA.wordW} alt="VANCO" /><span className="tag">Admin</span></div>
        <nav className="anav">
          {NAV.map(([id, label, ic]) => (
            <button key={id} className={page === id ? "on" : ""} onClick={() => go(id)}>
              <Icon name={ic} size={17} /> {label}
              {counts[id] > 0 && <span className="count">{counts[id]}</span>}
            </button>
          ))}
        </nav>
        <div className="aside-foot">
          <button onClick={onExit}><Icon name="arrowL" size={16} /> View public site</button>
          {onLogout && <button onClick={onLogout}><Icon name="x" size={16} /> Log out</button>}
          <div className="aprofile"><span className="av">V</span><div><div className="nm">Vanco</div><div className="rl">Owner · ALGRA</div></div></div>
        </div>
      </aside>
      {navOpen && <div className="drawer-scrim" style={{ zIndex: 1399 }} onClick={() => setNavOpen(false)} />}
      <div className="amain">
        <header className="atop">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="aside-toggle abtn ghost" style={{ padding: 9 }} onClick={() => setNavOpen(true)}><Icon name="menu" size={18} /></button>
            <div><h1>{titles[page][0]}</h1><div className="sub">{titles[page][1]}</div></div>
          </div>
          <div className="atop-actions">
            {showSearch && <div className="asearch"><Icon name="search" size={15} /><input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>}
            <button className="abtn ghost" onClick={onExit}><Icon name="external" size={14} /> Site</button>
          </div>
        </header>
        <main className="abody">
          {page === "overview" && <Overview go={go} />}
          {page === "submissions" && <Submissions query={query} />}
          {page === "bookings" && <Bookings query={query} />}
          {page === "guestlist" && <GuestList query={query} />}
          {page === "audience" && <Audience query={query} />}
          {page === "merch" && <Merch />}
          {page === "settings" && <Settings onReset={store.resetAll} />}
        </main>
      </div>
    </div>
  );
}
