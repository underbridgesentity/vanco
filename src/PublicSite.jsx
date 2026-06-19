/* ============================================================
   VANCO — public site
   ============================================================ */
import React, { useState, useEffect } from "react";
import { Icon, SPOTIFY, RA_TOUR, SOCIALS, useStore, fmtDay, fmtMon, fmtFull, Reveal } from "./store.jsx";
import { ASSETS as A } from "./assets.js";

const NAVLINKS = [
  ["Music", "music"], ["Tour", "tour"], ["About", "about"], ["Submit", "submit"], ["Book", "book"],
];

/* ---------- NAV ---------- */
function Nav({ active }) {
  const [onHero, setOnHero] = useState(true);
  const [onLight, setOnLight] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sections = () => [...document.querySelectorAll("header.hero, section.sec, footer.footer")];
    const update = () => {
      const secs = sections();
      const under = secs.find((s) => { const r = s.getBoundingClientRect(); return r.top <= 70 && r.bottom > 70; }) || secs[0];
      if (!under) return;
      setOnHero(under.classList.contains("hero"));
      setOnLight(under.classList.contains("light"));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const raf = requestAnimationFrame(update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); cancelAnimationFrame(raf); };
  }, []);
  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <>
      <nav className={`nav ${onHero ? "" : "scrolled"} ${onLight ? "on-light" : ""}`}>
        <div className="nav-in">
          <a className="nav-logo" href="#top" onClick={(e) => { e.preventDefault(); go("top"); }}>
            <img src={onLight ? A.wordB : A.wordW} alt="VANCO" />
          </a>
          <div className="nav-links">
            {NAVLINKS.map(([l, id]) => (
              <a key={id} className={active === id ? "active" : ""} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{l}</a>
            ))}
          </div>
          <div className="nav-right">
            <button className="btn btn-fill" onClick={() => go("join")}>Join</button>
            <button className="nav-burger pill" onClick={() => setOpen(true)} aria-label="Menu"><Icon name="menu" size={18} /></button>
          </div>
        </div>
      </nav>
      <div className={`msheet ${open ? "open" : ""}`}>
        <div className="top">
          <img src={A.wordW} alt="VANCO" style={{ height: 24 }} />
          <button className="pill" onClick={() => setOpen(false)}><Icon name="x" size={18} /></button>
        </div>
        {NAVLINKS.concat([["Join", "join"]]).map(([l, id]) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{l} <Icon name="arrowUR" size={22} /></a>
        ))}
      </div>
    </>
  );
}

/* ---------- HERO ---------- */
function Hero({ onPlay, heroImg }) {
  return (
    <header className="hero" id="top" data-screen-label="Hero">
      <div className="hero-bg"><img src={heroImg || A.blue} alt="Vanco" /></div>
      <img className="hero-mono" src={A.monoW} alt="" aria-hidden="true" />
      <div className="hero-in">
        <h1>Rhythm<br />without<br /><span className="o">borders</span></h1>
        <p className="hero-sub">DJ and producer blending Afro house, melodic techno and tribal electronic rhythms — rooted in African spirit, designed for every dancefloor on earth.</p>
        <div className="hero-cta">
          <button className="btn btn-fill btn-lg" onClick={onPlay}>
            <Icon name="play" size={15} /> Play latest
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- MUSIC ---------- */
// Feeds live from Vanco's Spotify artist profile — always his real, current
// catalogue (latest releases + top tracks), playable in-page.
function MusicSection() {
  return (
    <section className="sec light sec-pad" id="music" data-screen-label="Music">
      <div className="wrap">
        <Reveal className="shead">
          <div>
            <div className="idx">(01) — Discography</div>
            <h2>Music</h2>
          </div>
          <a className="btn btn-fill on-light" href={SPOTIFY.artistUrl} target="_blank" rel="noreferrer">
            <Icon name="spotify" size={16} /> Open on Spotify
          </a>
        </Reveal>
        <Reveal className="spotify-feed">
          <iframe
            title="Vanco on Spotify"
            src={`https://open.spotify.com/embed/artist/${SPOTIFY.artistId}?utm_source=generator&theme=0`}
            width="100%" height="520" frameBorder="0" loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </Reveal>
        <Reveal className="spotify-note mono" as="div">
          Live from Vanco’s Spotify — always the latest releases &amp; top tracks. Press play to listen.
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- TOUR ---------- */
// Official ticket link where known, otherwise a precise per-event search.
const ticketUrl = (t) => t.tickets || `https://www.google.com/search?q=${encodeURIComponent(`Vanco ${t.venue} ${t.city} tickets 2026`)}`;

function TourSection() {
  const { events } = useStore();
  const [reg, setReg] = useState("All");
  const [guestEvent, setGuestEvent] = useState(null);
  const REGIONS = ["All", ...Array.from(new Set(events.map((t) => t.region).filter(Boolean)))];
  const list = events.filter((t) => reg === "All" || t.region === reg);
  return (
    <section className="sec dark sec-pad" id="tour" data-screen-label="Tour">
      <div className="wrap">
        <Reveal className="shead">
          <div>
            <div className="idx">(02) — 2026 Season</div>
            <h2>Tour</h2>
          </div>
          <div style={{ maxWidth: 360 }}>
            <p style={{ color: "var(--mute-d)", fontSize: 14.5, lineHeight: 1.5, marginBottom: 14 }}>Summer 2026 across Europe and North Africa. Every show holds a limited guest list — request your spot below.</p>
            <a className="ra-link mono" href={RA_TOUR} target="_blank" rel="noreferrer">All dates &amp; tickets on Resident Advisor <Icon name="arrowUR" size={14} className="mv" /></a>
          </div>
        </Reveal>
        <div className="tfilters">
          {REGIONS.map((r) => (
            <button key={r} className={`tfilter ${reg === r ? "active" : ""}`} onClick={() => setReg(r)}>{r}</button>
          ))}
        </div>
        <div>
          {list.map((t) => (
            <Reveal as="div" key={t.id} className="trow">
              <div className="tdate"><span className="d">{fmtDay(t.date)}</span><span className="m">{fmtMon(t.date)}</span></div>
              <div className="tinfo">
                <div className="tcity">{t.city}, {t.country}</div>
                <div className="tven">{t.venue}</div>
              </div>
              <div className="treg">{t.region}</div>
              <div className="tactions">
                {t.status === "Private" ? (
                  <span className="tag-sold">Private event</span>
                ) : (
                  <>
                    {t.cap ? <button className="btn btn-ghost tg-btn" onClick={() => setGuestEvent(t)}>Guest list</button> : null}
                    <a className="btn btn-fill tg-btn" href={ticketUrl(t)} target="_blank" rel="noreferrer">Tickets <Icon name="arrowUR" size={14} className="mv" /></a>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      {guestEvent && <GuestListModal event={guestEvent} onClose={() => setGuestEvent(null)} />}
    </section>
  );
}

/* ---------- GUEST LIST REQUEST ---------- */
function GuestListModal({ event, onClose }) {
  const { addGuest } = useStore();
  const [f, setF] = useState({ name: "", email: "", instagram: "", guests: 1, msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    addGuest({ eventId: event.id, name: f.name, email: f.email, instagram: f.instagram, guests: Number(f.guests), msg: f.msg });
    setSent(true);
  };
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        {sent ? (
          <div className="sent" style={{ padding: "32px 12px" }}>
            <div className="ck"><Icon name="check" size={32} /></div>
            <h4>You’re on the list</h4>
            <p>Request received for <b>{event.venue}</b>, {event.city}. Spots are limited — we’ll email you if you’re confirmed.</p>
            <button className="btn btn-ghost" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-head">
              <div className="idx kicker" style={{ opacity: .55, marginBottom: 10 }}>Guest list</div>
              <h3>{event.venue}</h3>
              <div className="modal-sub mono">{event.city}, {event.country} · {fmtFull(event.date)}</div>
            </div>
            <form className="form-grid" onSubmit={submit}>
              <Field label="Full name"><input required value={f.name} onChange={set("name")} placeholder="Your name" /></Field>
              <Field label="Email"><input required type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" /></Field>
              <Field label="Instagram (optional)"><input value={f.instagram} onChange={set("instagram")} placeholder="@handle" /></Field>
              <Field label="Party size">
                <div className="chips">
                  {[["1", "Just me"], ["2", "Me + 1"]].map(([v, l]) => (
                    <span key={v} className={`chip-sel ${String(f.guests) === v ? "on" : ""}`} onClick={() => setF({ ...f, guests: Number(v) })}>{l}</span>
                  ))}
                </div>
              </Field>
              <Field label="Why you (optional)" full><textarea value={f.msg} onChange={set("msg")} placeholder="Tell the team anything that helps your case" /></Field>
              <div className="form-foot">
                <span className="form-note">Limited spots · confirmed by email</span>
                <button className="btn btn-accent btn-lg" type="submit">Request a spot <Icon name="arrowR" size={15} className="mv" /></button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- ABOUT ---------- */
function AboutSection() {
  return (
    <section className="sec light sec-pad" id="about" data-screen-label="About">
      <div className="wrap">
        <Reveal className="shead">
          <div><div className="idx">(03) — Biography</div><h2>About</h2></div>
        </Reveal>
        <div className="about-grid">
          <Reveal className="about-portrait">
            <img src={A.hat} alt="Vanco portrait" />
            <span className="cap">Vanco — 2026</span>
          </Reveal>
          <Reveal className="about-body" delay={120}>
            <p className="lead">Rooted in African spirit and designed for the world — music that moves between soulful and cinematic.</p>
            <p>From Douglasdale, Johannesburg, Vanco has performed at the most respected venues on earth — Tomorrowland Dubai, Ushuaïa, Blue Marlin Ibiza, Fabric London and Ultra South Africa among them.</p>
            <p>In 2025, ‘Ma Tnsani’ feat. Aya became a global phenomenon — 80M+ streams, the #1 most Shazammed track of the Ibiza season — supported by Black Coffee, Keinemusik, Louie Vega, Pete Tong and Mahmut Orhan.</p>
            <div className="suprow">
              <div className="lab">Supported by</div>
              <div className="supchips">
                {["Black Coffee", "Keinemusik", "Louie Vega", "Pete Tong", "Mahmut Orhan"].map((n) => <span key={n} className="supchip">{n}</span>)}
              </div>
            </div>
            <div className="suprow">
              <div className="lab">Released on</div>
              <div className="supchips">
                {["Sony Music", "Universal", "Sondela", "ALGRA"].map((n) => <span key={n} className="supchip">{n}</span>)}
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal className="statline">
          <div className="st"><div className="n">80M+</div><div className="l">Global streams</div></div>
          <div className="st"><div className="n">6</div><div className="l">Continents toured</div></div>
          <div className="st"><div className="n">#1</div><div className="l">Shazam — Ibiza 2025</div></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- shared form bits ---------- */
function Field({ label, full, children }) {
  return <div className={`field ${full ? "full" : ""}`}><label>{label}</label>{children}</div>;
}
function Sent({ title, msg, onReset }) {
  return (
    <div className="sent">
      <div className="ck"><Icon name="check" size={32} /></div>
      <h4>{title}</h4>
      <p>{msg}</p>
      <button className="btn btn-ghost" onClick={onReset}><Icon name="arrowL" size={14} /> Send another</button>
    </div>
  );
}

/* ---------- SUBMIT PROMO ---------- */
const GENRES = ["Afro House", "Melodic Techno", "Tribal / Electronic", "Afro Tech", "Other"];
function SubmitSection() {
  const { addSubmission } = useStore();
  const [f, setF] = useState({ artist: "", email: "", track: "", link: "", genre: "Afro House", label: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); addSubmission(f); setSent(true); };
  return (
    <section className="sec dark sec-pad" id="submit" data-screen-label="Submit a promo">
      <div className="wrap">
        <Reveal className="split">
          <div className="lhs">
            <div className="idx kicker" style={{ marginBottom: 16, opacity: .55 }}>(04) — A&R</div>
            <h3>Submit a promo</h3>
            <p>Sending music for Vanco to play and for ALGRA — the label backing emerging Afro-electronic talent. Every track is heard. Real ones get played out on the road.</p>
            <div className="feats">
              <div><Icon name="check" size={16} /> Personally reviewed — no inbox black hole</div>
              <div><Icon name="check" size={16} /> Standout tracks tested in live sets</div>
              <div><Icon name="check" size={16} /> Signing opportunities via ALGRA</div>
            </div>
          </div>
          <div className="rhs">
            {sent ? <Sent title="Promo received" msg="Your track is in the queue. If it connects, you’ll hear from the team — keep an eye on your inbox." onReset={() => { setSent(false); setF({ artist: "", email: "", track: "", link: "", genre: "Afro House", label: "", msg: "" }); }} />
              : (
                <form className="form-grid" onSubmit={submit}>
                  <Field label="Artist / act name"><input required value={f.artist} onChange={set("artist")} placeholder="Your name" /></Field>
                  <Field label="Email"><input required type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" /></Field>
                  <Field label="Track title"><input required value={f.track} onChange={set("track")} placeholder="Track name" /></Field>
                  <Field label="Label (optional)"><input value={f.label} onChange={set("label")} placeholder="Independent" /></Field>
                  <Field label="Private track link" full><input required value={f.link} onChange={set("link")} placeholder="SoundCloud / private stream URL" /></Field>
                  <Field label="Genre" full>
                    <div className="chips">
                      {GENRES.map((g) => <span key={g} className={`chip-sel ${f.genre === g ? "on" : ""}`} onClick={() => setF({ ...f, genre: g })}>{g}</span>)}
                    </div>
                  </Field>
                  <Field label="Message (optional)" full><textarea value={f.msg} onChange={set("msg")} placeholder="Anything we should know" /></Field>
                  <div className="form-foot">
                    <span className="form-note">No WeTransfer links · streamable only</span>
                    <button className="btn btn-accent btn-lg" type="submit">Submit track <Icon name="arrowR" size={15} className="mv" /></button>
                  </div>
                </form>
              )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- BOOK ---------- */
const ETYPES = ["Festival", "Club", "Private", "Brand"];
function BookSection() {
  const { addBooking } = useStore();
  const [f, setF] = useState({ name: "", email: "", org: "", event: "", date: "", city: "", venue: "", type: "Festival", budget: "", msg: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => { e.preventDefault(); addBooking(f); setSent(true); };
  return (
    <section className="sec light sec-pad" id="book" data-screen-label="Book Vanco">
      <div className="wrap">
        <Reveal className="split">
          <div className="lhs">
            <div className="idx kicker" style={{ marginBottom: 16, opacity: .55 }}>(05) — Bookings</div>
            <h3>Book Vanco</h3>
            <p>Festivals, clubs, brand activations and private events worldwide. Tell us about the show — the booking team responds within 48 hours.</p>
            <div className="feats">
              <div><Icon name="globe" size={16} /> Touring Europe, Africa, Middle East, Asia</div>
              <div><Icon name="globe" size={16} /> 2026 opening up Australasia & the Americas</div>
              <div><Icon name="mail" size={16} /> Direct line to management — no middlemen</div>
            </div>
          </div>
          <div className="rhs">
            {sent ? <Sent title="Inquiry sent" msg="Thanks — the booking team has your details and will be in touch within 48 hours to talk dates and logistics." onReset={() => { setSent(false); setF({ name: "", email: "", org: "", event: "", date: "", city: "", venue: "", type: "Festival", budget: "", msg: "" }); }} />
              : (
                <form className="form-grid" onSubmit={submit}>
                  <Field label="Your name"><input required value={f.name} onChange={set("name")} placeholder="Full name" /></Field>
                  <Field label="Email"><input required type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" /></Field>
                  <Field label="Organisation"><input value={f.org} onChange={set("org")} placeholder="Promoter / brand" /></Field>
                  <Field label="Event name"><input required value={f.event} onChange={set("event")} placeholder="Event / show" /></Field>
                  <Field label="Event date"><input required type="date" value={f.date} onChange={set("date")} /></Field>
                  <Field label="City / country"><input required value={f.city} onChange={set("city")} placeholder="City, country" /></Field>
                  <Field label="Venue & capacity"><input value={f.venue} onChange={set("venue")} placeholder="Venue — capacity" /></Field>
                  <Field label="Budget (USD)"><input value={f.budget} onChange={set("budget")} placeholder="Range or on request" /></Field>
                  <Field label="Event type" full>
                    <div className="chips">
                      {ETYPES.map((g) => <span key={g} className={`chip-sel ${f.type === g ? "on" : ""}`} onClick={() => setF({ ...f, type: g })}>{g}</span>)}
                    </div>
                  </Field>
                  <Field label="Details" full><textarea value={f.msg} onChange={set("msg")} placeholder="Set time, slot, other artists, special requests" /></Field>
                  <div className="form-foot">
                    <span className="form-note">Response within 48 hours</span>
                    <button className="btn btn-fill on-light btn-lg" type="submit">Send inquiry <Icon name="arrowR" size={15} className="mv" /></button>
                  </div>
                </form>
              )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- JOIN ---------- */
const INTERESTS = ["Tour alerts", "New music", "Exclusive mixes", "Merch drops"];
function JoinSection() {
  const { addFan, fanTotal } = useStore();
  const [f, setF] = useState({ name: "", email: "", country: "", tier: "Free", interests: ["New music", "Tour alerts"] });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (i) => setF({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] });
  const submit = (e) => { e.preventDefault(); addFan(f); setSent(true); };
  return (
    <section className="sec dark sec-pad" id="join" data-screen-label="Join">
      <div className="wrap">
        <Reveal className="split">
          <div className="lhs">
            <div className="idx kicker" style={{ marginBottom: 16, opacity: .55 }}>(06) — The List</div>
            <h3>Join the<br />inner circle</h3>
            <p>One signal cuts through the noise. Get tour tickets before anyone, unreleased music, exclusive mixes and first dibs on merch.</p>
            <div className="feats">
              <div style={{ alignItems: "center" }}>
                <span className="eqbars" style={{ height: 16 }}><i /><i /><i /><i /></span>
                <span><b style={{ fontWeight: 700 }}>{fanTotal.toLocaleString()}</b> already in — across 60+ countries</span>
              </div>
            </div>
          </div>
          <div className="rhs">
            {sent ? <Sent title="You’re in" msg={`Welcome to the inner circle. ${f.tier === "Inner Circle" ? "Your exclusive mixes and early access are unlocked." : "Watch your inbox for first access to tickets and new music."}`} onReset={() => { setSent(false); setF({ name: "", email: "", country: "", tier: "Free", interests: ["New music", "Tour alerts"] }); }} />
              : (
                <form onSubmit={submit}>
                  <div className="tiers">
                    {[["Free", "Newsletter · tickets & music"], ["Inner Circle", "Exclusive mixes & content"]].map(([t, d]) => (
                      <div key={t} className={`tier ${f.tier === t ? "on" : ""}`} onClick={() => setF({ ...f, tier: t })}>
                        <div className="tn">{t}<span className="tradio" /></div>
                        <div className="tp">{d}</div>
                      </div>
                    ))}
                  </div>
                  <div className="form-grid">
                    <Field label="Name"><input required value={f.name} onChange={set("name")} placeholder="Your name" /></Field>
                    <Field label="Country"><input required value={f.country} onChange={set("country")} placeholder="Where you’re based" /></Field>
                    <Field label="Email" full><input required type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" /></Field>
                    <Field label="Send me" full>
                      <div className="chips">
                        {INTERESTS.map((g) => <span key={g} className={`chip-sel ${f.interests.includes(g) ? "on" : ""}`} onClick={() => toggle(g)}>{g}</span>)}
                      </div>
                    </Field>
                  </div>
                  <div className="form-foot">
                    <span className="form-note">No spam · leave anytime</span>
                    <button className="btn btn-fill btn-lg" type="submit">{f.tier === "Inner Circle" ? "Join Inner Circle" : "Join the list"} <Icon name="arrowR" size={15} className="mv" /></button>
                  </div>
                </form>
              )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- MERCH ---------- */
const PRODUCTS = [["Borders Tour Tee", "From $45"], ["V Monogram Cap", "$38"], ["Ma Tnsani — Vinyl", "$32"]];
function MerchSection() {
  return (
    <section className="sec light sec-pad" id="merch" data-screen-label="Merch">
      <div className="wrap">
        <Reveal className="shead">
          <div><div className="idx">(07) — Store</div><h2>Merch</h2></div>
          <span className="pill" style={{ borderColor: "var(--line-l)" }}><Icon name="dot" size={9} /> Dropping soon</span>
        </Reveal>
        <div className="merch-grid">
          {PRODUCTS.map(([n, p]) => (
            <Reveal as="div" key={n} className="mcard">
              <div className="mph"><span className="soon">Soon</span><img className="mlogo" src={A.monoB} alt="" /></div>
              <div className="mname">{n}</div>
              <div className="mprice">{p}</div>
              <button className="btn btn-ghost notify"><Icon name="mail" size={14} /> Notify me</button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function FooterSubscribe() {
  const { addFan } = useStore();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    addFan({ name: email.split("@")[0], email, country: "", tier: "Free", interests: ["New music", "Tour alerts"] });
    setDone(true);
  };
  if (done) return <div className="foot-subbed"><Icon name="check" size={15} /> You’re on the list — watch your inbox.</div>;
  return (
    <form className="foot-mini" onSubmit={submit}>
      <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" aria-label="Subscribe"><Icon name="arrowR" size={16} /></button>
    </form>
  );
}

function Footer() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const ext = { target: "_blank", rel: "noreferrer" };
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-logo"><img src={A.wordW} alt="VANCO" /></div>
            <p className="foot-blurb">Rhythm travels without borders. Afro house, melodic techno and tribal electronic — from Johannesburg to the world.</p>
          </div>
          <div className="foot-col">
            <h5>Explore</h5>
            {NAVLINKS.map(([l, id]) => <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{l}</a>)}
          </div>
          <div className="foot-col">
            <h5>Connect</h5>
            <a href={SOCIALS.instagram} {...ext}>Instagram</a>
            <a href={SOCIALS.spotify} {...ext}>Spotify</a>
            <a href={SOCIALS.soundcloud} {...ext}>SoundCloud</a>
            <a href={SOCIALS.youtube} {...ext}>YouTube</a>
          </div>
          <div className="foot-col">
            <h5>Join the list</h5>
            <p className="foot-blurb" style={{ marginBottom: 14 }}>Tickets first. New music first.</p>
            <FooterSubscribe />
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Vanco · ALGRA</span>
          <div className="foot-socials">
            <a href={SOCIALS.instagram} {...ext} aria-label="Instagram"><Icon name="instagram" size={18} /></a>
            <a href={SOCIALS.spotify} {...ext} aria-label="Spotify"><Icon name="spotify" size={18} /></a>
            <a href={SOCIALS.soundcloud} {...ext} aria-label="SoundCloud"><Icon name="soundcloud" size={18} /></a>
            <a href={SOCIALS.youtube} {...ext} aria-label="YouTube"><Icon name="youtube" size={18} /></a>
          </div>
          <span>Booking · ALGRA Management</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- PLAYER BAR ---------- */
// Docks the official Spotify player for the featured single — real audio in-page
// (full track if the visitor is signed into Spotify, 30s preview otherwise).
function PlayerBar({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="playerbar spotify">
      <iframe
        title={`${SPOTIFY.featuredTitle} on Spotify`}
        src={`https://open.spotify.com/embed/track/${SPOTIFY.featuredTrackId}?utm_source=generator&theme=0`}
        width="100%" height="80" frameBorder="0" loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
      <button className="pb-x pb-x-embed" onClick={onClose} aria-label="Close player"><Icon name="x" size={16} /></button>
    </div>
  );
}

/* ---------- PUBLIC SITE ROOT ---------- */
export function PublicSite({ heroImg }) {
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState("top");
  const togglePlay = () => setPlaying((p) => !p);
  useEffect(() => {
    const ids = ["music", "tour", "about", "submit", "book"];
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <div>
      <Nav active={active} />
      <Hero onPlay={togglePlay} heroImg={heroImg} />
      <MusicSection />
      <TourSection />
      <AboutSection />
      <SubmitSection />
      <BookSection />
      <JoinSection />
      {/* Merch hidden until products are live — re-enable <MerchSection /> when ready. */}
      <Footer />
      <PlayerBar open={playing} onClose={() => setPlaying(false)} />
    </div>
  );
}
