/* ============================================================
   VANCO PLATFORM - app root
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

const ADMIN_KEY = "vanco_admin"; // signed session token (presence + unexpired = authenticated)

// Cheap client-side check of the token's expiry for UX (auto-logout). The real
// authorization happens server-side on protected endpoints; this never decides
// security on its own. Unparseable/legacy/dev tokens are treated as valid here.
function adminSessionValid() {
  const t = localStorage.getItem(ADMIN_KEY);
  if (!t) return false;
  const parts = t.split(".");
  if (parts.length !== 2) return true;
  try {
    const { exp } = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
    return !exp || Date.now() < exp;
  } catch {
    return true;
  }
}

function Root() {
  // Admin is reachable only via the #admin hash (no public link), then gated by a passcode.
  const [view, setView] = useState(() => (location.hash === "#admin" ? "admin" : localStorage.getItem("vanco_view") || "site"));
  const [authed, setAuthed] = useState(() => {
    const ok = adminSessionValid();
    if (!ok) localStorage.removeItem(ADMIN_KEY);
    return ok;
  });

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
