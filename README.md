# VANCO — Platform

Cutting-edge platform for **Vanco**, DJ and producer (Afro house · melodic techno · tribal electronic) — _rhythm without borders_.

Two halves of one loop:

- **Public site** — a bold, black ↔ white alternating editorial experience with a gold accent. Hero, live Spotify catalogue, filterable 2026 tour with **ticket links** and a per-show **guest-list request**, biography, **promo submissions**, **booking inquiries**, and **fan / Inner Circle sign-up**.
- **Admin control room** — a dark dashboard contrasting the editorial site: overview with live stats + growth chart, A&R **Submissions** inbox with detail drawers and status actions, **Bookings**, **Guest List** (per-show capacity + approve/waitlist/decline), **Audience** database with breakdowns + CSV export, Merch and Settings.

### Admin access

The admin console is **not linked anywhere on the public site**. The team reaches it by going to `/#admin`, which shows a passcode screen. The passcode is checked by the [`api/admin-login.js`](api/admin-login.js) serverless function against the `ADMIN_PASSWORD` env var — so the password lives only on Vercel, never in the shipped front-end. Set it in Vercel → Project → Settings → Environment Variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_PASSWORD` | yes | Shared team passcode — use a long, random value (16+ chars) |
| `SESSION_SECRET` | no | Key used to sign session tokens (falls back to `ADMIN_PASSWORD`) |

On success the function returns a **signed, expiring (12h) session token** (HMAC) — it can't be forged in the browser, and protected endpoints (e.g. the approval mailer) verify it. The login is also **rate-limited** per IP (best-effort, in-memory). A "Log out" button in the admin sidebar clears the session. In local `npm run dev` (no serverless functions) the dev passcode is `admin`; that bypass is compiled **out** of production builds.

**Hardening status**
- Passcode validated server-side; never shipped in the bundle.
- Session tokens are signed + expiring; the approval-email endpoint requires a valid admin session (no anonymous abuse).
- Login throttled per IP. For durable, cross-instance rate limiting add Vercel KV / Upstash.

> This gates the admin **UI** and protects the serverless endpoints. The prototype's *data* still lives in the browser (`localStorage`), so it isn't yet a hard multi-user boundary — moving data behind a backend with real auth is the next step (see below).

### Guest list

Each tour date holds a limited guest list (capacity set per event via `cap` in `SEED.tour`). Fans request a spot from the Tour section; requests flow into the admin **Guest List** page, which tracks approved heads against each show's cap and lets the team approve, waitlist or decline.

When a request is **approved**, the fan is automatically emailed a confirmation via the [`api/notify-guest.js`](api/notify-guest.js) Vercel serverless function (using [Resend](https://resend.com)). It's safe by default — with no key configured, approvals still work and simply skip the email. To switch it on, set these in Vercel → Project → Settings → Environment Variables (see [`.env.example`](.env.example)):

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key — without it, no email is sent |
| `GUEST_FROM` | no | Sender, e.g. `Vanco <guestlist@yourdomain.com>` (verify the domain in Resend) |
| `GUEST_REPLY_TO` | no | Reply-to address (e.g. management inbox) |

Anything submitted on the public site flows straight into admin — submissions, bookings and subscribers are persisted in the browser via `localStorage`, so the full loop is demonstrable end-to-end.

## Tech

- [Vite](https://vite.dev/) + [React 18](https://react.dev/)
- Plain CSS design system (`src/styles/`) — Space Grotesk + Space Mono, token-driven black/white with a single cobalt accent
- No backend yet — state lives in `localStorage`

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Project structure

```
index.html              # entry + fonts + boot splash
src/
  main.jsx              # app root — public site <-> admin view switching
  store.jsx             # shared store (localStorage), icons, seed data, primitives
  PublicSite.jsx        # public site: nav, hero, music, tour, about, forms, footer, player
  AdminApp.jsx          # admin: overview, submissions, bookings, audience, merch, settings
  assets.js             # brand asset registry
  assets/               # logos & portraits
  styles/
    site.css            # public site + design tokens
    admin.css           # admin control room
```

## Status & next steps

- **Music** feeds live from Vanco's real Spotify artist profile via the official
  Spotify embed (`SPOTIFY` in `src/store.jsx`), so the catalogue always reflects
  what's current on Spotify — latest releases and top tracks — and plays in-page
  (full track if the visitor is signed into Spotify, 30s preview otherwise). No
  hardcoded discography.
- Forms persist to the browser locally so you can demo the flow — no real backend,
  payments, or email yet (except guest-list approval emails, above).
- Social / streaming links (nav, footer, Music) point to Vanco's real profiles
  (`SOCIALS` in `src/store.jsx`). The footer "join the list" box subscribes
  straight into the Audience database.
- Admin tables export to CSV (Submissions, Subscribers, Guest List); contact
  emails are `mailto:` and submission links open the real stream.
- **Merch** is hidden on the public site until products are live — re-enable
  `<MerchSection />` in `src/PublicSite.jsx` when ready.
- Suggested next steps: decide Inner Circle pricing/perks.

## Backend (Neon)

The app talks to serverless API functions backed by **Neon (serverless Postgres)**. The data layer auto-detects its mode at startup:

- **`api` mode** — when `DATABASE_URL` is set, all data lives in Neon. The public can **submit** (promos, bookings, guest requests, subscribes); only an **authenticated admin** can read or manage it. Authorization is enforced server-side on every read/write (`requireAdmin`), so the admin data is genuinely protected.
- **`local` mode** — with no `DATABASE_URL` (local dev, or before you provision the DB), it falls back to `localStorage` so nothing breaks.

### One-time setup
1. Create a free project at [neon.tech](https://neon.tech).
2. In the Neon **SQL editor**, run [`schema.sql`](schema.sql) (creates the tables).
3. In Vercel → Project → Settings → Environment Variables, add **`DATABASE_URL`** (Neon's pooled connection string). Optionally set `SESSION_SECRET`.
4. Redeploy. The app flips to `api` mode automatically.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes (for live data) | Neon connection string |

API routes (`api/`): `events` (public `GET`, admin `POST`/`PATCH`/`DELETE`), `submissions`, `bookings`, `guests`, `subscribers` (public `POST`; admin `GET`/`PATCH`), `stats` (public counts), `admin-login`, `notify-guest`.

### Tour dates

Tour dates live in the `events` table and are managed from the admin **Tour** page (add / edit / delete date, venue, city, country, region, status, ticket link, and guest-list capacity). The public Tour section reads them, and each guest-list request links to its event. On first read, `api/events` auto-seeds the 2026 dates if the table is empty.

> If you set up the database before this feature existed, re-run [`schema.sql`](schema.sql) once (it's idempotent — `create table if not exists`) to add the `events` table, then redeploy.

> Auth note: admin access still uses the shared passcode + signed session. For per-person team logins, add an auth provider (e.g. Clerk) in front of the admin — the API functions already verify a session, so that's a drop-in upgrade.

---

© 2026 Vanco · ALGRA
