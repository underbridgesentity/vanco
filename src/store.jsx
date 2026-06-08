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
    instagram: <g {...P}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></g>,
    spotify: <g><circle cx="12" cy="12" r="9.2" fill="currentColor" /><g stroke="#000" fill="none" strokeWidth="1.5" strokeLinecap="round"><path d="M7 9.8c3.2-.9 6.6-.6 9.4 1" /><path d="M7.6 13c2.6-.7 5.3-.4 7.5.9" /><path d="M8.2 15.9c2-.5 4-.3 5.7.7" /></g></g>,
    soundcloud: <g {...P}><path d="M9 17V9.5c0-.4.6-.6 1-.3 1.8 1.2 2.8 3 3 5" /><path d="M4 17v-4M6.5 17v-6M13 17h4.5a2.5 2.5 0 000-5c-.2 0-.5 0-.7.1" /></g>,
    apple: <path d="M16 13c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.2zM14.4 6.6c.6-.7 1-1.7.9-2.6-.8 0-1.9.5-2.5 1.3-.5.6-1 1.6-.9 2.5.9.1 1.8-.5 2.5-1.2z" fill="currentColor" stroke="none" />,
    youtube: <g><rect x="3" y="6" width="18" height="12" rx="3.5" fill="currentColor" /><path d="M10.5 9.2l4.3 2.8-4.3 2.8z" fill="#000" /></g>,
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
  { key: "beatport", label: "Beatport", icon: "beatport" },
];

/* ---------- seed data ---------- */
export const SEED = {
  releases: [
    { id: "r1", title: "Ma Tnsani", feat: "Aya", year: "2025", type: "Single", label: "ALGRA / Afro Republik", streams: "80.4M", hot: true, len: "6:18", note: "#1 most Shazammed track — Ibiza 2025", color: "#2347ff" },
    { id: "r2", title: "Borders", feat: "DEELA", year: "2026", type: "Single", label: "Afro Republik", streams: "2.1M", fresh: true, len: "7:02", note: "New — gaining traction on the floor", color: "#c8102e" },
    { id: "r3", title: "Water", feat: "Tyla — Vanco Remix", year: "2025", type: "Remix", label: "Epic / FAX", streams: "14.7M", len: "5:44", color: "#1f9d6b" },
    { id: "r4", title: "Dark Days", feat: "Moby — Vanco Remix", year: "2024", type: "Remix", label: "Mute", streams: "5.9M", len: "6:40", color: "#6b4fff" },
    { id: "r5", title: "Bailar Contigo", feat: "Black Eyed Peas & Daddy Yankee — Vanco Remix", year: "2024", type: "Remix", label: "Epic", streams: "9.2M", len: "5:12", color: "#ff7a00" },
    { id: "r6", title: "Sondela", feat: "Una Rams", year: "2024", type: "Single", label: "Sondela", streams: "6.4M", len: "6:55", color: "#0aa3a3" },
  ],
  tour: [
    { id: "t1", date: "2026-06-14", city: "Ibiza", country: "ES", venue: "Ushuaïa", region: "Europe", status: "Tickets" },
    { id: "t2", date: "2026-06-21", city: "Ibiza", country: "ES", venue: "Blue Marlin", region: "Europe", status: "Tickets" },
    { id: "t3", date: "2026-07-05", city: "Boom", country: "BE", venue: "Tomorrowland", region: "Europe", status: "Sold Out" },
    { id: "t4", date: "2026-07-19", city: "London", country: "UK", venue: "Fabric", region: "Europe", status: "Tickets" },
    { id: "t5", date: "2026-08-02", city: "Ibiza", country: "ES", venue: "Akasha, Las Dalias", region: "Europe", status: "Tickets" },
    { id: "t6", date: "2026-08-30", city: "Cape Town", country: "ZA", venue: "Ultra South Africa", region: "Africa", status: "Tickets" },
    { id: "t7", date: "2026-09-13", city: "Dubai", country: "AE", venue: "Club Chinois", region: "Middle East", status: "Tickets" },
    { id: "t8", date: "2026-10-04", city: "Sydney", country: "AU", venue: "Day One Festival", region: "Australasia", status: "RSVP" },
    { id: "t9", date: "2026-10-25", city: "New York", country: "US", venue: "Brooklyn Mirage", region: "Americas", status: "Announced" },
    { id: "t10", date: "2026-11-08", city: "Bali", country: "ID", venue: "Savaya", region: "Asia", status: "Tickets" },
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
  fanBase: 24716, // baseline count the recent list sits on top of
};

/* ---------- store w/ localStorage persistence ---------- */
const KEY = "vanco_platform_v1";
function loadStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { submissions: SEED.submissions, bookings: SEED.bookings, fans: SEED.fans };
}
function persist(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
}

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

export function StoreProvider({ children }) {
  const init = loadStore();
  const [submissions, setSubmissions] = useState(init.submissions);
  const [bookings, setBookings] = useState(init.bookings);
  const [fans, setFans] = useState(init.fans);

  useEffect(() => { persist({ submissions, bookings, fans }); }, [submissions, bookings, fans]);

  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (p) => p + Math.random().toString(36).slice(2, 8);

  const addSubmission = (d) => setSubmissions((x) => [{ id: uid("s"), status: "New", date: today(), _new: true, ...d }, ...x]);
  const addBooking = (d) => setBookings((x) => [{ id: uid("b"), status: "New", created: today(), _new: true, ...d }, ...x]);
  const addFan = (d) => setFans((x) => [{ id: uid("f"), date: today(), _new: true, ...d }, ...x]);
  const setSubStatus = (id, status) => setSubmissions((x) => x.map((s) => s.id === id ? { ...s, status } : s));
  const setBookStatus = (id, status) => setBookings((x) => x.map((b) => b.id === id ? { ...b, status } : b));
  const resetAll = () => { setSubmissions(SEED.submissions); setBookings(SEED.bookings); setFans(SEED.fans); };

  const fanTotal = SEED.fanBase + fans.length;

  const value = { submissions, bookings, fans, fanTotal, addSubmission, addBooking, addFan, setSubStatus, setBookStatus, resetAll };
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
