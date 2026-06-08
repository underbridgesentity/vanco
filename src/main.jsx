/* ============================================================
   VANCO PLATFORM — app root
   Public site <-> admin control room, with persistent local store.
   ============================================================ */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "./store.jsx";
import { PublicSite } from "./PublicSite.jsx";
import { AdminApp } from "./AdminApp.jsx";
import { ASSETS } from "./assets.js";
import "./styles/site.css";
import "./styles/admin.css";

function Root() {
  const [view, setView] = useState(() => (location.hash === "#admin" ? "admin" : localStorage.getItem("vanco_view") || "site"));

  useEffect(() => {
    localStorage.setItem("vanco_view", view);
    if (view === "admin") { location.hash = "admin"; } else if (location.hash === "#admin") { history.replaceState(null, "", location.pathname); }
    window.scrollTo(0, 0);
  }, [view]);

  const goAdmin = () => setView("admin");
  const goSite = () => setView("site");

  return (
    <StoreProvider>
      <div className="view-fade" key={view}>
        {view === "site"
          ? <PublicSite onAdmin={goAdmin} heroImg={ASSETS.blue} />
          : <AdminApp onExit={goSite} />}
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
