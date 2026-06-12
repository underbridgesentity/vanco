# VANCO — Platform

Cutting-edge platform for **Vanco**, DJ and producer (Afro house · melodic techno · tribal electronic) — _rhythm without borders_.

Two halves of one loop:

- **Public site** — a bold, black ↔ white alternating editorial experience with an electric-cobalt accent. Hero, discography with a docking player bar, filterable 2026 tour, biography, **promo submissions**, **booking inquiries**, **fan / Inner Circle sign-up**, and a merch teaser.
- **Admin control room** — a dark dashboard contrasting the editorial site: overview with live stats + growth chart, A&R **Submissions** inbox with detail drawers and status actions, **Bookings**, **Audience** database with breakdowns + CSV export, Merch and Settings.

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
  payments, or email yet.
- **Tour** dates are placeholders awaiting the real schedule (in `SEED.tour`,
  `src/store.jsx`).
- **Merch** is hidden on the public site until products are live — re-enable
  `<MerchSection />` in `src/PublicSite.jsx` when ready.
- Socials and ticket buttons are placeholders — wire them to real URLs when ready.
- Suggested next steps: drop in the real tour dates and decide Inner Circle
  pricing/perks.

To go live, the natural next layer is a backend (e.g. an API + database) behind the existing store interface in `src/store.jsx`, plus real auth on the admin view.

---

© 2026 Vanco · ALGRA
