/* ============================================================
   VANCO PLATFORM — app root
   Public site <-> admin control room, with persistent local store.
   ============================================================ */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./store.jsx";
import { PublicSite } from "./PublicSite.jsx";
import { AdminApp, AdminLogin } from "./AdminApp.jsx";
import { ASSETS } from "./assets.js";
import "./styles/site.css";
import "./styles/admin.css";

const ADMIN_KEY = "vanco_admin"; // session token (presence = authenticated)

function Root() {
  // Admin is reachable only via the #admin hash (no public link), then gated by a passcode.
  const [view, setView] = useState(() => (location.hash === "#admin" ? "admin" : localStorage.getItem("vanco_view") || "site"));
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(ADMIN_KEY));

  useEffect(() => {
    localStorage.setItem("vanco_view", view);
    if (view === "admin") { location.hash = "admin"; } else if (location.hash === "#admin") { history.replaceState(null, "", location.pathname); }
    window.scrollTo(0, 0);
  }, [view]);

  // Let the team open the console by navigating to #admin at any time.
  useEffect(() => {
    const onHash = () => setView(location.hash === "#admin" ? "admin" : "site");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goSite = () => setView("site");
  const login = (token) => { localStorage.setItem(ADMIN_KEY, token || "1"); setAuthed(true); };
  const logout = () => { localStorage.removeItem(ADMIN_KEY); setAuthed(false); setView("site"); };

  return (
    <StoreProvider>
      <div className="view-fade" key={`${view}-${authed}`}>
        {view === "site"
          ? <PublicSite heroImg={ASSETS.blue} />
          : authed
            ? <AdminApp onExit={goSite} onLogout={logout} />
            : <AdminLogin onSuccess={login} onCancel={goSite} />}
      </div>
      <div className="grain" />
    </StoreProvider>
  );
}

createRoot(document.getElementById("root")).render(<Root />);

// Drop the boot splash once React has mounted.
const boot = document.getElementById("boot");
if (boot) {
  requestAnimationFrame(() => {
    boot.style.opacity = "0";
    setTimeout(() => boot.remove(), 500);
  });
}
