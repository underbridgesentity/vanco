/* ============================================================
   VANCO — public site
   ============================================================ */
import React, { useState, useEffect } from "react";
import { Icon, PLATFORMS, SEED, useStore, fmtDay, fmtMon, Reveal } from "./store.jsx";
import { ASSETS as A } from "./assets.js";

const NAVLINKS = [
  ["Music", "music"], ["Tour", "tour"], ["About", "about"], ["Submit", "submit"], ["Book", "book"],
];
const VENUES = ["Tomorrowland Dubai", "Ushuaïa Ibiza", "Blue Marlin Ibiza", "Fabric London", "Outernet London", "Ultra South Africa", "Club Chinois", "Playa Soleil", "Akasha Las Dalias", "Mixmag Lab Live SA"];

/* ---------- smart links ---------- */
function SmartLinks({ light }) {
  return (
    <div className="smartlinks">
      {PLATFORMS.map((p) => (
        <a key={p.key} className="slk" href="#" onClick={(e) => e.preventDefault()} title={`Listen on ${p.label}`}>
          <Icon name={p.icon} size={15} /> {p.label}
        </a>
      ))}
    </div>
  );
}

/* ---------- NAV ---------- */
function Nav({ active, onAdmin, playing }) {
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
            <a className="nav-admin" href="#" onClick={(e) => { e.preventDefault(); onAdmin(); }}><Icon name="grid" size={14} /> Admin</a>
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
        <a href="#" onClick={(e) => { e.preventDefault(); setOpen(false); onAdmin(); }}>Admin <Icon name="grid" size={20} /></a>
      </div>
    </>
  );
}

/* ---------- HERO ---------- */
function Hero({ onPlay, playing, heroImg }) {
  return (
    <header className="hero" id="top" data-screen-label="Hero">
      <div className="hero-bg"><img src={heroImg || A.blue} alt="Vanco" /></div>
      <img className="hero-mono" src={A.monoW} alt="" aria-hidden="true" />
      <div className="hero-in">
        <div className="hero-kick kicker">
          <span>Afro House</span><span className="dotsep" />
          <span>Melodic Techno</span><span className="dotsep" />
          <span>Johannesburg → World</span>
        </div>
        <h1>Rhythm<br />without<br /><span className="o">borders</span></h1>
        <p className="hero-sub">DJ and producer blending Afro house, melodic techno and tribal electronic rhythms — rooted in African spirit, designed for every dancefloor on earth.</p>
        <div className="hero-cta">
          <button className="btn btn-fill btn-lg" onClick={() => onPlay(SEED.releases[0])}>
            <Icon name="play" size={15} /> Play latest
          </button>
          <button className="np" onClick={() => onPlay(SEED.releases[0])}>
            <span className="pp"><Icon name={playing && playing.id === "r1" ? "pause" : "play"} size={14} /></span>
            <span className="meta">Now spinning · <b>Ma Tnsani</b> feat. Aya</span>
            <span className="eqbars"><i /><i /><i /><i /></span>
          </button>
        </div>
      </div>
      <div className="hero-foot">
        <span>80M+ Streams</span><span>·</span><span>#1 Shazam · Ibiza ’25</span><span>·</span><span>Scroll ↓</span>
      </div>
    </header>
  );
}

/* ---------- MARQUEE ---------- */
function Marquee({ lite, items = VENUES }) {
  const row = items.concat(items);
  return (
    <div className={`marquee ${lite ? "lite" : ""}`}>
      <div className="mtrack">{row.map((v, i) => <span key={i}>{v}</span>)}</div>
    </div>
  );
}

/* ---------- MUSIC ---------- */
function MusicSection({ playing, onPlay }) {
  const feat = SEED.releases[0];
  const rest = SEED.releases.slice(1);
  const isPlaying = (id) => playing && playing.id === id;
  return (
    <section className="sec light sec-pad" id="music" data-screen-label="Music">
      <div className="wrap">
        <Reveal className="shead">
          <div>
            <div className="idx">(01) — Discography</div>
            <h2>Music</h2>
          </div>
          <SmartLinksMini />
        </Reveal>

        <Reveal className="feature">
          <div className="feature-art">
            <img src={A.blue} alt={feat.title} />
            <div className="ov" />
            <span className="pill tag" style={{ borderColor: "rgba(255,255,255,.5)", color: "#fff" }}><Icon name="dot" size={9} /> Latest single</span>
            <button className="bigplay" onClick={() => onPlay(feat)} aria-label="Play">
              <Icon name={isPlaying(feat.id) ? "pause" : "play"} size={22} />
            </button>
          </div>
          <div className="feature-body">
            <div className="ftitle">{feat.title}</div>
            <div className="ffeat">feat. {feat.feat} · {feat.label}</div>
            <div className={`wave ${isPlaying(feat.id) ? "playing" : ""}`}>
              {Array.from({ length: 56 }).map((_, i) => (
                <i key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.5)) * 80}%`, animationDelay: `${i * 0.03}s` }} />
              ))}
            </div>
            <p className="feature-note">{feat.note}.</p>
            <div className="feature-stats">
              <div><div className="n">80.4M</div><div className="l">Global streams</div></div>
              <div><div className="n">200k+</div><div className="l">TikTok videos</div></div>
              <div><div className="n">#1</div><div className="l">Shazam · Ibiza ’25</div></div>
            </div>
            <SmartLinks />
          </div>
        </Reveal>

        <div className="rel-list">
          {rest.map((r, i) => (
            <Reveal as="div" key={r.id} className="rel" onClick={() => onPlay(r)} delay={i * 40}>
              <div className="rnum mono">{String(i + 2).padStart(2, "0")}</div>
              <div>
                <div className="rt">{r.title}{r.fresh && <span className="badge-new">New</span>}</div>
                <div className="rf">{r.feat}</div>
              </div>
              <div className="rtype">{r.type} · {r.year}</div>
              <div className="rstream">{r.streams}</div>
              <div className="rplay"><Icon name={isPlaying(r.id) ? "pause" : "play"} size={15} /></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function SmartLinksMini() {
  return (
    <div className="foot-socials" style={{ color: "var(--mute-l)" }}>
      {PLATFORMS.map((p) => <a key={p.key} href="#" onClick={(e) => e.preventDefault()} title={p.label} style={{ color: "inherit" }}><Icon name={p.icon} size={20} /></a>)}
    </div>
  );
}

/* ---------- TOUR ---------- */
const REGIONS = ["All", "Europe", "Africa", "Middle East", "Asia", "Australasia", "Americas"];
function TourSection() {
  const [reg, setReg] = useState("All");
  const list = SEED.tour.filter((t) => reg === "All" || t.region === reg);
  return (
    <section className="sec dark sec-pad" id="tour" data-screen-label="Tour">
      <div className="wrap">
        <Reveal className="shead">
          <div>
            <div className="idx">(02) — 2026 Season</div>
            <h2>Tour</h2>
          </div>
          <div style={{ maxWidth: 340 }}>
            <p style={{ color: "var(--mute-d)", fontSize: 14.5, lineHeight: 1.5 }}>From Ibiza to Bali — now opening up Australasia and the Americas. Members get tickets first.</p>
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
              <div>
                <div className="tcity">{t.city}, {t.country}</div>
                <div className="tven">{t.venue}</div>
              </div>
              <div className="treg">{t.region}</div>
              <div className="tstatus">
                {t.status === "Sold Out"
                  ? <span className="tag-sold">Sold Out</span>
                  : t.status === "Announced"
                    ? <span className="tag-sold">Just announced</span>
                    : <button className="btn btn-ghost">{t.status === "RSVP" ? "RSVP" : "Tickets"} <Icon name="arrowUR" size={14} className="mv" /></button>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
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
function Footer({ onAdmin }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            <a href="#merch" onClick={(e) => { e.preventDefault(); go("merch"); }}>Merch</a>
          </div>
          <div className="foot-col">
            <h5>Connect</h5>
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Spotify</a>
            <a href="#" onClick={(e) => e.preventDefault()}>SoundCloud</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onAdmin(); }}>Admin</a>
          </div>
          <div className="foot-col">
            <h5>Join the list</h5>
            <p className="foot-blurb" style={{ marginBottom: 14 }}>Tickets first. New music first.</p>
            <div className="foot-mini">
              <input placeholder="your@email.com" onClick={(e) => e.preventDefault()} />
              <button onClick={() => go("join")}><Icon name="arrowR" size={16} /></button>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Vanco · ALGRA</span>
          <div className="foot-socials">
            <a href="#" onClick={(e) => e.preventDefault()}><Icon name="instagram" size={18} /></a>
            <a href="#" onClick={(e) => e.preventDefault()}><Icon name="spotify" size={18} /></a>
            <a href="#" onClick={(e) => e.preventDefault()}><Icon name="soundcloud" size={18} /></a>
            <a href="#" onClick={(e) => e.preventDefault()}><Icon name="youtube" size={18} /></a>
          </div>
          <span>Booking · ALGRA Management</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- PLAYER BAR ---------- */
function PlayerBar({ track, onToggle, onClose }) {
  const [prog, setProg] = useState(18);
  useEffect(() => { setProg(8); const t = setInterval(() => setProg((p) => (p >= 100 ? 8 : p + 0.4)), 200); return () => clearInterval(t); }, [track?.id]);
  if (!track) return null;
  return (
    <div className="playerbar">
      <div className="pb-prog"><span style={{ width: `${prog}%` }} /></div>
      <div className="pb-in">
        <button className="pb-pp" onClick={onToggle}><Icon name="pause" size={16} /></button>
        <div className="pb-meta">
          <div className="pb-t">{track.title}</div>
          <div className="pb-f">{track.feat}</div>
        </div>
        <span className="eqbars" style={{ height: 16 }}><i /><i /><i /><i /></span>
        <div className="pb-links">
          {PLATFORMS.slice(0, 4).map((p) => <a key={p.key} href="#" onClick={(e) => e.preventDefault()} title={p.label}><Icon name={p.icon} size={17} /></a>)}
        </div>
        <div className="pb-time mono">{track.len}</div>
        <button className="pb-x" onClick={onClose} aria-label="Close"><Icon name="x" size={16} /></button>
      </div>
    </div>
  );
}

/* ---------- PUBLIC SITE ROOT ---------- */
export function PublicSite({ onAdmin, heroImg }) {
  const [playing, setPlaying] = useState(null);
  const [active, setActive] = useState("top");
  const onPlay = (t) => setPlaying((cur) => (cur && cur.id === t.id ? null : t));
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
      <Nav active={active} onAdmin={onAdmin} playing={playing} />
      <Hero onPlay={onPlay} playing={playing} heroImg={heroImg} />
      <Marquee />
      <MusicSection playing={playing} onPlay={onPlay} />
      <TourSection />
      <AboutSection />
      <SubmitSection />
      <BookSection />
      <JoinSection />
      <MerchSection />
      <Footer onAdmin={onAdmin} />
      <PlayerBar track={playing} onToggle={() => setPlaying(null)} onClose={() => setPlaying(null)} />
    </div>
  );
}
