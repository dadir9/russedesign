"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const navLinks = [
  ["Pakker", "/#pakker"],
  ["Galleri", "/#galleri"],
  ["Bestill", "/bestill"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setLoggedIn(!!s));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.96)", borderBottom: "1px solid #e5e7eb", backdropFilter: "blur(12px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 40 }}>

        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <span style={{ fontWeight: 900, fontSize: 16, color: "#111827" }}>RusseDesign</span>
        </a>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 32, flex: 1 }} className="hidden md:flex">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#111827")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
              {label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }} className="hidden md:flex">
          <a href={loggedIn ? "/konto/dashboard" : "/konto"}
            style={{ fontSize: 14, fontWeight: 500, color: "#374151", textDecoration: "none" }}>
            {loggedIn ? "Min side" : "Logg inn"}
          </a>
          <a href="/bestill"
            style={{ fontSize: 14, fontWeight: 700, color: "#fff", background: "#7c3aed", padding: "8px 18px", borderRadius: 8, textDecoration: "none" }}>
            Bestill nå
          </a>
        </div>

        {/* Mobile hamburger */}
        <button style={{ marginLeft: "auto", display: "flex", flexDirection: "column", gap: 5, padding: 8, background: "none", border: "none", cursor: "pointer" }}
          className="md:hidden" onClick={() => setOpen(!open)}>
          <span style={{ display: "block", width: 20, height: 2, background: "#374151", borderRadius: 2, transition: "all 0.2s", transform: open ? "rotate(45deg) translateY(7px)" : "none" }} />
          <span style={{ display: "block", width: 20, height: 2, background: "#374151", borderRadius: 2, transition: "all 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: 20, height: 2, background: "#374151", borderRadius: 2, transition: "all 0.2s", transform: open ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 24px 20px" }}>
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 15, fontWeight: 500, color: "#374151", textDecoration: "none", borderBottom: "1px solid #f3f4f6" }}>
              {label}
            </a>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <a href={loggedIn ? "/konto/dashboard" : "/konto"}
              style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, fontWeight: 600, color: "#374151", textDecoration: "none" }}>
              {loggedIn ? "Min side" : "Logg inn"}
            </a>
            <a href="/bestill"
              style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 8, background: "#7c3aed", fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
              Bestill nå
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
