"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-md"
      style={{ background: "rgba(10,10,15,0.88)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            R
          </div>
          <span className="font-black text-base" style={{ color: "#f5f0e8" }}>RusseDesign</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[["Pakker", "#pakker"], ["Galleri", "#galleri"], ["Bestill", "#bestill"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium transition-all hover:text-white relative group"
              style={{ color: "#64748b" }}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                style={{ background: "#7c3aed" }}
              />
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="#bestill"
            className="hidden md:block text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: "#7c3aed", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
          >
            Bestill nå
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setOpen(!open)}
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div className="w-5 space-y-1.5">
              <span className="block h-0.5 w-5 bg-white rounded transition-all" style={{ transform: open ? "rotate(45deg) translateY(8px)" : "none" }} />
              <span className="block h-0.5 w-5 bg-white rounded transition-all" style={{ opacity: open ? 0 : 1 }} />
              <span className="block h-0.5 w-5 bg-white rounded transition-all" style={{ transform: open ? "rotate(-45deg) translateY(-8px)" : "none" }} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-1"
          style={{ background: "rgba(10,10,15,0.97)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {[["Pakker", "#pakker"], ["Galleri", "#galleri"], ["Bestill", "#bestill"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium py-3 px-4 rounded-xl"
              style={{ color: "#94a3b8" }}
            >
              {label}
            </a>
          ))}
          <a
            href="#bestill"
            onClick={() => setOpen(false)}
            className="mt-2 text-center text-white text-sm font-bold py-3 rounded-full"
            style={{ background: "#7c3aed" }}
          >
            Bestill nå
          </a>
        </div>
      )}
    </nav>
  );
}
