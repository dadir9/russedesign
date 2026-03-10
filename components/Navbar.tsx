"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md" style={{ background: "rgba(10,10,15,0.85)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "#7c3aed" }}>RD</div>
          <span className="font-black text-base text-white hidden sm:block">RusseDesign</span>
        </a>

        <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[["Pakker", "#pakker"], ["Galleri", "#galleri"], ["Bestill", "#bestill"]].map(([label, href]) => (
            <a key={label} href={href} className="px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:text-white" style={{ color: "#64748b" }}>
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#bestill" className="hidden md:block text-white text-sm font-bold px-5 py-2 rounded-full transition-all hover:opacity-80" style={{ background: "#7c3aed" }}>
            Bestill nå
          </a>
          <button className="md:hidden p-2 rounded-lg" onClick={() => setOpen(!open)} style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="w-5 space-y-1.5">
              <span className="block h-0.5 w-5 bg-white rounded transition-all" style={{ transform: open ? "rotate(45deg) translateY(8px)" : "none" }} />
              <span className="block h-0.5 w-5 bg-white rounded transition-all" style={{ opacity: open ? 0 : 1 }} />
              <span className="block h-0.5 w-5 bg-white rounded transition-all" style={{ transform: open ? "rotate(-45deg) translateY(-8px)" : "none" }} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1" style={{ background: "rgba(10,10,15,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[["Pakker", "#pakker"], ["Galleri", "#galleri"], ["Bestill", "#bestill"]].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="text-sm font-medium py-3 px-4 rounded-xl" style={{ color: "#94a3b8" }}>
              {label}
            </a>
          ))}
          <a href="#bestill" onClick={() => setOpen(false)} className="mt-2 text-center text-white text-sm font-bold py-3 rounded-full" style={{ background: "#7c3aed" }}>
            Bestill nå
          </a>
        </div>
      )}
    </nav>
  );
}
