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
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.92)", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">

        {/* Desktop nav links — left */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(([label, href]) => (
            <a key={label} href={href}
              className="text-sm font-medium transition-all hover:text-gray-900 relative group"
              style={{ color: "#64748b" }}>
              {label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                style={{ background: "#7c3aed" }} />
            </a>
          ))}
        </div>

        {/* Logo — center on mobile, centered on desktop */}
        <a href="/" className="flex items-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <span className="font-black text-base" style={{ color: "#0f172a" }}>RusseDesign</span>
        </a>

        {/* Right: Min konto / Dashboard */}
        <div className="hidden md:flex items-center gap-3">
          <a href={loggedIn ? "/konto/dashboard" : "/konto"}
            className="text-sm font-bold px-5 py-2 rounded-full transition-all hover:opacity-90"
            style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.2)" }}>
            {loggedIn ? "Min side" : "Logg inn"}
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg" onClick={() => setOpen(!open)}
          style={{ background: "rgba(0,0,0,0.06)" }}>
          <div className="w-5 space-y-1.5">
            <span className="block h-0.5 w-5 rounded transition-all" style={{ background: "#0f172a", transform: open ? "rotate(45deg) translateY(8px)" : "none" }} />
            <span className="block h-0.5 w-5 rounded transition-all" style={{ background: "#0f172a", opacity: open ? 0 : 1 }} />
            <span className="block h-0.5 w-5 rounded transition-all" style={{ background: "#0f172a", transform: open ? "rotate(-45deg) translateY(-8px)" : "none" }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-1"
          style={{ background: "rgba(255,255,255,0.97)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {navLinks.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}
              className="text-sm font-medium py-3 px-4 rounded-xl"
              style={{ color: "#475569" }}>
              {label}
            </a>
          ))}
          <a href={loggedIn ? "/konto/dashboard" : "/konto"} onClick={() => setOpen(false)}
            className="mt-2 text-center text-sm font-bold py-3 rounded-full"
            style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}>
            {loggedIn ? "Min side" : "Logg inn"}
          </a>
        </div>
      )}
    </nav>
  );
}
