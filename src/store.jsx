/* ============================================================
   VANCO PLATFORM — shared store, primitives, icons
   ============================================================ */
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";

/* ---------- icons (feather-ish, 1.6 stroke) ---------- */
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
export const Icon = ({ name, size = 18, style, ...rest }) => {
  const paths = {
    play: <path d="M6 4l13 8-13 8z" fill="currentColor" stroke="none" />,
    pause: <g fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></g>,
    arrowUR: <g {...P}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></g>,
    arrowR: <g {...P}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></g>,
    arrowL: <g {...P}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></g>,
    menu: <g {...P}><path d="M3 6h18M3 12h18M3 18h18" /></g>,
    x: <g {...P}><path d="M6 6l12 12M18 6L6 18" /></g>,
    check: <g {...P}><path d="M4 12l5 5L20 6" /></g>,
    search: <g {...P}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></g>,
    music: <g {...P}><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><path d="M9 18V5l12-2v13" /></g>,
    calendar: <g {...P}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></g>,
    users: <g {...P}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.5a3 3 0 010 5.6M21 20c0-2.6-1.6-4.8-4-5.6" /></g>,
    inbox: <g {...P}><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v6H3v-6z" /></g>,
    bag: <g {...P}><path d="M5 8h14l-1 12H6z" /><path d="M9 8a3 3 0 016 0" /></g>,
    settings: <g {...P}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2" /></g>,
    grid: <g {...P}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></g>,
    plus: <g {...P}><path d="M12 5v14M5 12h14" /></g>,
    external: <g {...P}><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></g>,
    mail: <g {...P}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></g>,
    globe: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></g>,
    pin: <g {...P}><path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></g>,
    clock: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    trend: <g {...P}><path d="M3 17l6-6 4 4 7-7" /><path d="M17 8h4v4" /></g>,
    download: <g {...P}><path d="M12 3v12M7 11l5 5 5-5" /><path d="M4 21h16" /></g>,
    chevron: <g {...P}><path d="M9 6l6 6-6 6" /></g>,
    chevronD: <g {...P}><path d="M6 9l6 6 6-6" /></g>,
    dot: <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />,
    star: <path d="M12 3l2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.8 6.5 20.3l1.1-6.3L3 9.6l6.3-.9z" {...P} />,
    instagram: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="currentColor" stroke="none" />,
    spotify: <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" fill="currentColor" stroke="none" />,
    soundcloud: <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.06.045.094.09.094s.089-.045.104-.104l.21-1.308-.21-1.336c-.014-.057-.045-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.21 2.458c0 .06.045.12.119.12.061 0 .105-.061.121-.12l.254-2.458-.254-2.563c-.016-.06-.061-.12-.121-.12m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.193 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.15l.225-2.532-.225-2.64c0-.075-.06-.135-.149-.135m1.155.36c-.005-.09-.075-.149-.159-.149-.09 0-.158.06-.164.149l-.18 2.43.18 2.563c.006.09.075.157.164.157.084 0 .151-.068.159-.158l.203-2.563-.203-2.43m.824-1.025c-.105 0-.18.09-.187.196l-.165 3.255.165 2.563c.007.107.082.196.187.196.104 0 .181-.09.182-.198l.18-2.563-.18-3.252c-.014-.107-.09-.196-.196-.196m1.005-.494c-.121 0-.211.09-.225.21l-.15 3.75.15 2.544c.014.12.104.21.225.21.119 0 .209-.09.225-.211l.165-2.544-.165-3.749c-.016-.12-.106-.21-.225-.21m1.184-.071c-.135 0-.24.105-.24.24l-.149 3.585.149 2.535c0 .136.105.24.24.24.135 0 .24-.105.24-.24l.165-2.535-.165-3.585c0-.135-.105-.24-.24-.24m1.245-.045c-.15 0-.255.12-.27.255l-.12 3.66.12 2.52c.015.135.12.255.27.255.149 0 .254-.12.254-.255l.135-2.52-.135-3.66c0-.135-.105-.255-.254-.255M12 8.776c-.165 0-.285.12-.285.285l-.105 5.355.105 2.49c0 .166.12.286.285.286.164 0 .284-.12.284-.286l.12-2.49-.12-5.355c0-.165-.12-.285-.284-.285m1.245.06c-.18 0-.3.135-.314.299l-.09 5.265.09 2.475c.014.165.134.3.314.3s.3-.135.3-.3l.105-2.475-.105-5.265c0-.164-.12-.299-.3-.299m1.305-.314c-.195 0-.329.149-.329.329l-.075 5.55.075 2.444c0 .181.134.33.329.33.18 0 .33-.149.33-.33l.09-2.444-.09-5.55c0-.18-.15-.33-.33-.33m1.32.659c-.21 0-.359.165-.359.359l-.061 4.891.061 2.43c0 .195.149.36.359.36.195 0 .345-.165.359-.36l.075-2.43-.075-4.891c-.014-.194-.164-.359-.359-.359m1.379-.21c-.225 0-.39.18-.39.39l-.045 5.131.045 2.4c0 .21.165.39.39.39.21 0 .375-.18.39-.39l.06-2.4-.06-5.131c-.015-.21-.18-.39-.39-.39m1.5-.045c-.255 0-.434.195-.45.434l-.029 4.847.029 2.385c.016.24.195.434.45.434.24 0 .434-.195.434-.434l.045-2.385-.045-4.847c0-.24-.195-.434-.434-.434m1.439 1.665c-.27 0-.479.225-.479.495v6.241c0 .27.21.495.479.495.255 0 .465-.225.465-.495V11.4c0-.27-.21-.495-.465-.495M24 14.475c0-.6-.27-1.155-.69-1.575-.42-.42-.99-.69-1.605-.69h-.045c-.18-2.79-2.49-5.01-5.31-5.01-.69 0-1.365.135-1.965.39-.225.09-.285.18-.285.36v11.34c0 .18.135.345.315.36.015 0 9.075.015 9.135.015 1.32 0 2.4-1.08 2.4-2.4 0-.06 0-.135-.014-.195" fill="currentColor" stroke="none" />,
    apple: <path d="M16 13c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.2zM14.4 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.5-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.5-1.2z" fill="currentColor" stroke="none" />,
    youtube: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor" stroke="none" />,
    beatport: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></g>,
    waveform: null,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block", flex: "none", ...style }} {...rest}>
      {paths[name] || null}
    </svg>
  );
};

/* ---------- platform smart-link config ---------- */
export const PLATFORMS = [
  { key: "spotify", label: "Spotify", icon: "spotify" },
  { key: "apple", label: "Apple Music", icon: "apple" },
  { key: "soundcloud", label: "SoundCloud", icon: "soundcloud" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
];

/* Vanco's real Spotify identity. The site feeds from his artist profile via the
   official Spotify embed, so the catalogue always reflects what's live on Spotify
   (latest releases + popular tracks) — no hardcoded track lists to go stale. */
export const SPOTIFY = {
  artistId: "2KShewLkb92FKEZ6N4cVP9",
  artistUrl: "https://open.spotify.com/artist/2KShewLkb92FKEZ6N4cVP9",
  // Signature single surfaced by the hero "Play latest" CTA. Update if a newer
  // flagship release should lead.
  featuredTrackId: "01WFjqzUwrD4nfSQsHMVNm",
  featuredTitle: "Ma Tnsani (Yalla Habibi)",
  featuredFeat: "feat. AYA",
};

// Vanco's official Resident Advisor tour page — canonical, always-current ticket listings.
export const RA_TOUR = "https://ra.co/dj/vanco/tour-dates";

// Real social / streaming profiles — used by nav, footer and listen links.
export const SOCIALS = {
  instagram: "https://www.instagram.com/vanco_sa",
  spotify: "https://open.spotify.com/artist/2KShewLkb92FKEZ6N4cVP9",
  soundcloud: "https://soundcloud.com/vanco_sa",
  youtube: "https://www.youtube.com/channel/UCV3quDD0_ElMIQ0Yh-f7Mgg",
};

/* ---------- seed data ---------- */
export const SEED = {
  // 2026 tour. `tickets` = official link where known (otherwise the UI builds a
  // precise per-event search). `cap` = guest-list spots Vanco releases per show
  // (0 / omitted = no guest list, e.g. private bookings).
  tour: [
    { id: "t1", date: "2026-06-01", city: "Ibiza", country: "ES", venue: "Hï Ibiza", region: "Europe", status: "Tickets", tickets: "https://www.hiibiza.com/events-calendar", cap: 20 },
    { id: "t2", date: "2026-06-05", city: "Monte Carlo", country: "MC", venue: "Nikki Beach — F1 Grand Prix", region: "Europe", status: "Tickets", cap: 15 },
    { id: "t3", date: "2026-06-06", city: "Monte Carlo", country: "MC", venue: "Private Party", region: "Europe", status: "Private" },
    { id: "t4", date: "2026-06-07", city: "Ibiza", country: "ES", venue: "Mestiza · Hï Ibiza", region: "Europe", status: "Tickets", tickets: "https://www.hiibiza.com/events/2026/mestiza", cap: 20 },
    { id: "t5", date: "2026-06-12", city: "Porto Cervo", country: "IT", venue: "Twiga · Sardinia", region: "Europe", status: "Tickets", cap: 18 },
    { id: "t6", date: "2026-06-14", city: "Costa da Caparica", country: "PT", venue: "Maresia Intimate Festival", region: "Europe", status: "Tickets", cap: 25 },
    { id: "t7", date: "2026-06-15", city: "Ibiza", country: "ES", venue: "Hï Ibiza", region: "Europe", status: "Tickets", tickets: "https://www.hiibiza.com/events-calendar", cap: 20 },
    { id: "t8", date: "2026-06-18", city: "Lisbon", country: "PT", venue: "SunceBeat", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t9", date: "2026-06-19", city: "London", country: "GB", venue: "Ministry of Sound", region: "Europe", status: "Tickets", tickets: "https://www.ministryofsound.com/whats-on/", cap: 25 },
    { id: "t10", date: "2026-06-20", city: "Yeni İskele", country: "CY", venue: "Pera Mackenzie", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t11", date: "2026-06-26", city: "Paris", country: "FR", venue: "l’Envol", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t12", date: "2026-06-27", city: "Stuttgart", country: "DE", venue: "Zubrovka House Festival", region: "Europe", status: "Tickets", cap: 25 },
    { id: "t13", date: "2026-06-29", city: "Mykonos", country: "GR", venue: "Cavo", region: "Europe", status: "Tickets", cap: 18 },
    { id: "t14", date: "2026-07-02", city: "Casablanca", country: "MA", venue: "Cazaloka", region: "Africa", status: "Tickets", cap: 20 },
    { id: "t15", date: "2026-07-03", city: "Ibiza", country: "ES", venue: "Chinois", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t16", date: "2026-07-04", city: "Jesolo Lido", country: "IT", venue: "King’s Club", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t17", date: "2026-07-09", city: "Saint-Tropez", country: "FR", venue: "Naomad", region: "Europe", status: "Tickets", cap: 15 },
    { id: "t18", date: "2026-07-10", city: "Alanya", country: "TR", venue: "Sundaze Beach Club", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t19", date: "2026-07-11", city: "Ibiza", country: "ES", venue: "Hï Ibiza", region: "Europe", status: "Tickets", tickets: "https://www.hiibiza.com/events-calendar", cap: 20 },
    { id: "t20", date: "2026-07-17", city: "Boom", country: "BE", venue: "Tomorrowland", region: "Europe", status: "Tickets", tickets: "https://www.tomorrowland.com/", cap: 30 },
    { id: "t21", date: "2026-07-18", city: "Tivat", country: "ME", venue: "Aura Beach", region: "Europe", status: "Tickets", cap: 20 },
    { id: "t22", date: "2026-07-24", city: "Bucharest", country: "RO", venue: "Nebula", region: "Europe", status: "Tickets", cap: 25 },
    { id: "t23", date: "2026-07-25", city: "Marseille", country: "FR", venue: "Delta Festival", region: "Europe", status: "Tickets", cap: 30 },
    { id: "t24", date: "2026-07-29", city: "Alta Rocca", country: "FR", venue: "L’Alta Rocca", region: "Europe", status: "Tickets", cap: 18 },
    { id: "t25", date: "2026-07-30", city: "Tunis", country: "TN", venue: "Calypso", region: "Africa", status: "Tickets", cap: 20 },
  ],
  submissions: [
    { id: "s1", artist: "Kioko", track: "Midnight in Maputo", genre: "Afro House", email: "kioko@mail.com", label: "—", link: "soundcloud.com/kioko/midnight", msg: "Long-time fan. Built this around a marimba loop — would love your ears on it.", status: "New", date: "2026-05-29" },
    { id: "s2", artist: "ANROK", track: "Cobalt", genre: "Melodic Techno", email: "hello@anrok.live", label: "Independent", link: "soundcloud.com/anrok/cobalt-priv", msg: "Peak-time roller, 122bpm. Open to ALGRA.", status: "Shortlist", date: "2026-05-27" },
    { id: "s3", artist: "Nina Sol", track: "Umoya", genre: "Afro House", email: "nina@solmusic.co", label: "—", link: "soundcloud.com/ninasol/umoya", msg: "Vocal by my sister, recorded in Soweto.", status: "New", date: "2026-05-26" },
    { id: "s4", artist: "Lebo Jr", track: "Spirit Drum", genre: "Tribal", email: "lebojr@mail.com", label: "—", link: "soundcloud.com/lebojr/spirit", msg: "Tribal percussion edit, hoping for a Tomorrowland test.", status: "Listened", date: "2026-05-24" },
    { id: "s5", artist: "TKZ", track: "Lowveld", genre: "Afro Tech", email: "tkz@mail.com", label: "—", link: "soundcloud.com/tkz/lowveld", msg: "First track. Be honest!", status: "Passed", date: "2026-05-20" },
  ],
  bookings: [
    { id: "b1", name: "Mara Ionescu", org: "Sunwaves Festival", event: "SW Summer 2026", email: "talent@sunwaves.ro", date: "2026-08-15", city: "Mamaia, RO", venue: "Beachfront — 18,000", type: "Festival", budget: "$40k–60k", msg: "Sunset slot, Saturday main stage.", status: "Reviewing", created: "2026-05-30" },
    { id: "b2", name: "Daniel Cho", org: "Hï Ibiza", event: "Residency night", email: "bookings@hiibiza.com", date: "2026-07-26", city: "Ibiza, ES", venue: "Theatre — 1,500", type: "Club", budget: "On request", msg: "2-hour closing set.", status: "New", created: "2026-05-31" },
    { id: "b3", name: "Aïsha Bello", org: "Private", event: "Beach wedding", email: "aisha.b@mail.com", date: "2026-09-20", city: "Mauritius", venue: "Private villa — 200", type: "Private", budget: "$25k", msg: "Two-hour sunset set for a private celebration.", status: "New", created: "2026-05-31" },
    { id: "b4", name: "Mixmag SA", org: "Mixmag", event: "Lab Live SA S2", email: "lab@mixmag.co.za", date: "2026-10-10", city: "Johannesburg, ZA", venue: "Studio — stream", type: "Brand", budget: "$15k", msg: "Return for season two of the Lab.", status: "Confirmed", created: "2026-05-22" },
  ],
  fans: [
    { id: "f1", name: "Thandi M.", email: "thandi@mail.com", country: "South Africa", interests: ["Tour alerts", "New music"], date: "2026-05-31", tier: "Free" },
    { id: "f2", name: "Marco R.", email: "marco@mail.it", country: "Italy", interests: ["Exclusive mixes", "Tour alerts"], date: "2026-05-31", tier: "Inner Circle" },
    { id: "f3", name: "Yuki T.", email: "yuki@mail.jp", country: "Japan", interests: ["New music", "Merch"], date: "2026-05-30", tier: "Free" },
    { id: "f4", name: "Sara K.", email: "sara@mail.ae", country: "UAE", interests: ["Tour alerts"], date: "2026-05-30", tier: "Free" },
    { id: "f5", name: "Liam O.", email: "liam@mail.uk", country: "UK", interests: ["Exclusive mixes", "New music", "Tour alerts"], date: "2026-05-29", tier: "Inner Circle" },
    { id: "f6", name: "Naledi P.", email: "naledi@mail.com", country: "South Africa", interests: ["New music"], date: "2026-05-29", tier: "Free" },
    { id: "f7", name: "Diego F.", email: "diego@mail.mx", country: "Mexico", interests: ["Tour alerts", "Merch"], date: "2026-05-28", tier: "Free" },
    { id: "f8", name: "Amara N.", email: "amara@mail.ng", country: "Nigeria", interests: ["New music", "Exclusive mixes"], date: "2026-05-28", tier: "Inner Circle" },
  ],
  guestlist: [
    { id: "g1", eventId: "t9", name: "Sofia Marais", email: "sofia@mail.com", instagram: "@sofiam", guests: 2, msg: "Huge fan — would love to bring my sister to the Ministry show.", status: "Pending", date: "2026-06-10" },
    { id: "g2", eventId: "t1", name: "Léa Dubois", email: "lea@mail.fr", instagram: "@lea.d", guests: 1, msg: "", status: "Approved", date: "2026-05-28" },
    { id: "g3", eventId: "t9", name: "Tom Blake", email: "tom@mail.uk", instagram: "", guests: 2, msg: "Following since Ma Tnsani — first time catching a set.", status: "Pending", date: "2026-06-11" },
    { id: "g4", eventId: "t20", name: "Andrei Pop", email: "andrei@mail.ro", instagram: "@andrei.p", guests: 1, msg: "Travelling from Bucharest for Tomorrowland.", status: "Waitlist", date: "2026-06-09" },
    { id: "g5", eventId: "t15", name: "Marie Laurent", email: "marie@mail.fr", instagram: "@marie.l", guests: 2, msg: "", status: "Pending", date: "2026-06-12" },
    { id: "g6", eventId: "t1", name: "Diego Fernández", email: "diego@mail.es", instagram: "@dfernandez", guests: 1, msg: "Local to Ibiza, never miss a Vanco night.", status: "Approved", date: "2026-05-26" },
  ],
  fanBase: 24716, // baseline count the recent list sits on top of
};

// Quick lookup from event id → tour entry (for guest-list views).

/* ---------- store: API-backed (Neon) with localStorage fallback ----------
   Mode is decided once at startup by probing /api/stats:
     • "api"   — DATABASE_URL is live → data lives in Neon; public can submit,
                 only authenticated admins can read/manage.
     • "local" — no backend (local dev or before Neon is configured) → the
                 original localStorage behaviour, so the app never breaks.
   The useStore() interface is identical in both modes.                      */
const KEY = "vanco_platform_v2";
const DEFAULT_STORE = { submissions: SEED.submissions, bookings: SEED.bookings, fans: SEED.fans, guestlist: SEED.guestlist };
function loadStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_STORE, ...JSON.parse(raw) };
  } catch (e) {}
  return DEFAULT_STORE;
}
function persist(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
}

const authHeaders = () => { const t = localStorage.getItem("vanco_admin"); return t ? { Authorization: `Bearer ${t}` } : {}; };
async function apiJson(url, opts = {}) {
  const r = await fetch(url, opts);
  const ct = r.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error("non-json");
  const data = await r.json();
  if (!r.ok) throw Object.assign(new Error(data.error || "api-error"), { status: r.status });
  return data;
}

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const [mode, setMode] = useState("loading"); // 'loading' | 'api' | 'local'
  const [submissions, setSubmissions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [fans, setFans] = useState([]);
  const [guestlist, setGuestlist] = useState([]);
  const [events, setEvents] = useState(SEED.tour);
  const [subCount, setSubCount] = useState(0);

  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => p + Math.random().toString(36).slice(2, 8);
  const byDate = (a, b) => (a.date < b.date ? -1 : 1);

  async function fetchAdminLists() {
    const [s, b, g, f] = await Promise.all([
      apiJson("/api/submissions", { headers: authHeaders() }),
      apiJson("/api/bookings", { headers: authHeaders() }),
      apiJson("/api/guests", { headers: authHeaders() }),
      apiJson("/api/subscribers", { headers: authHeaders() }),
    ]);
    setSubmissions(s); setBookings(b); setGuestlist(g); setFans(f);
  }

  // Decide mode and hydrate once.
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const stats = await apiJson("/api/stats");
        if (off) return;
        setSubCount(stats.subscribers || 0);
        // Events are public; fall back to the bundled defaults if the table
        // isn't there yet, so the Tour section is never empty.
        try { const ev = await apiJson("/api/events"); if (!off && ev.length) setEvents(ev); } catch {}
        if (localStorage.getItem("vanco_admin")) { try { await fetchAdminLists(); } catch {} }
        if (!off) setMode("api");
      } catch {
        if (off) return;
        const init = loadStore();
        setSubmissions(init.submissions); setBookings(init.bookings); setFans(init.fans); setGuestlist(init.guestlist);
        setEvents(SEED.tour);
        setMode("local");
      }
    })();
    return () => { off = true; };
  }, []);

  // Persist to localStorage only in local mode.
  useEffect(() => { if (mode === "local") persist({ submissions, bookings, fans, guestlist }); }, [mode, submissions, bookings, fans, guestlist]);

  // Pull admin lists when the console opens (covers logging in mid-session).
  const loadAdmin = () => { if (mode === "api") fetchAdminLists().catch(() => {}); };

  // ----- writes: optimistic; persisted to Neon (api) or localStorage (local) -----
  const addVia = async (resource, d, optimistic, setter) => {
    if (mode === "api") {
      try {
        const row = await apiJson(`/api/${resource}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) });
        setter((x) => [{ ...row, _new: true }, ...x]);
        return;
      } catch {}
    }
    setter((x) => [optimistic, ...x]);
  };
  const addSubmission = (d) => addVia("submissions", d, { id: uid("s"), status: "New", date: today(), _new: true, ...d }, setSubmissions);
  const addBooking = (d) => addVia("bookings", d, { id: uid("b"), status: "New", created: today(), _new: true, ...d }, setBookings);
  const addFan = (d) => addVia("subscribers", d, { id: uid("f"), date: today(), _new: true, ...d }, setFans).then(() => { if (mode === "api") setSubCount((c) => c + 1); });
  const addGuest = (d) => addVia("guests", d, { id: uid("g"), status: "Pending", date: today(), _new: true, ...d }, setGuestlist);

  const patchStatus = (resource, id, status) => {
    if (mode === "api") apiJson(`/api/${resource}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ id, status }) }).catch(() => {});
  };
  const setSubStatus = (id, status) => { setSubmissions((x) => x.map((s) => s.id === id ? { ...s, status } : s)); patchStatus("submissions", id, status); };
  const setBookStatus = (id, status) => { setBookings((x) => x.map((b) => b.id === id ? { ...b, status } : b)); patchStatus("bookings", id, status); };
  const setGuestStatus = (id, status) => { setGuestlist((x) => x.map((g) => g.id === id ? { ...g, status } : g)); patchStatus("guests", id, status); };

  // Demo reset only applies to local mode (Neon is the source of truth in api mode).
  const resetAll = () => {
    if (mode === "api") { fetchAdminLists().catch(() => {}); return; }
    setSubmissions(SEED.submissions); setBookings(SEED.bookings); setFans(SEED.fans); setGuestlist(SEED.guestlist);
  };

  // ----- tour events (admin-managed; public reads them) -----
  const addEvent = async (d) => {
    if (mode === "api") {
      try { const row = await apiJson("/api/events", { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(d) }); setEvents((x) => [...x, row].sort(byDate)); return row; } catch {}
    }
    const e = { id: uid("e"), status: "Tickets", cap: 0, ...d };
    setEvents((x) => [...x, e].sort(byDate));
    return e;
  };
  const updateEvent = async (id, d) => {
    if (mode === "api") {
      try { const row = await apiJson("/api/events", { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ id, ...d }) }); setEvents((x) => x.map((e) => e.id === id ? row : e).sort(byDate)); return; } catch {}
    }
    setEvents((x) => x.map((e) => e.id === id ? { ...e, ...d } : e).sort(byDate));
  };
  const deleteEvent = async (id) => {
    if (mode === "api") apiJson("/api/events", { method: "DELETE", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ id }) }).catch(() => {});
    setEvents((x) => x.filter((e) => e.id !== id));
  };
  const eventById = Object.fromEntries(events.map((e) => [e.id, e]));

  // Heads approved for an event (sums party sizes), used against each event's cap.
  const approvedFor = (eventId) => guestlist
    .filter((g) => g.eventId === eventId && g.status === "Approved")
    .reduce((n, g) => n + (Number(g.guests) || 1), 0);

  const fanTotal = SEED.fanBase + (mode === "api" ? subCount : fans.length);

  const value = { mode, submissions, bookings, fans, guestlist, events, eventById, fanTotal, loadAdmin, addSubmission, addBooking, addFan, addGuest, addEvent, updateEvent, deleteEvent, setSubStatus, setBookStatus, setGuestStatus, approvedFor, resetAll };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

/* ---------- small UI primitives ---------- */
export const fmtDate = (iso, opts = { day: "2-digit", month: "short" }) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-GB", opts);
export const fmtDay = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit" });
export const fmtMon = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
export const fmtFull = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

/* reveal-on-scroll wrapper */
export function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>{children}</Tag>;
}
