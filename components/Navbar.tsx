"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  const navBg = dark ? "rgba(15,15,25,0.9)" : "rgba(255,255,255,0.9)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const linkColor = dark ? "#94a3b8" : "#6b7280";
  const pillBg = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const pillBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-300" style={{ background: navBg, borderBottom: `1px solid ${border}` }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "#7c3aed" }}>
            RD
          </div>
          <span className="font-black text-base hidden sm:block" style={{ color: dark ? "#f1f5f9" : "#111827" }}>
            RusseDesign
          </span>
        </a>

        {/* Center pill nav */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full" style={{ background: pillBg, border: `1px solid ${pillBorder}` }}>
          {["Pakker", "Galleri", "Bestill"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:text-purple-500" style={{ color: linkColor }}>
              {item}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer flex-shrink-0" style={{ background: dark ? "#7c3aed" : "#e5e7eb" }}>
            <span className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-300" style={{ left: dark ? "22px" : "2px", background: "#fff" }}>
              {dark ? "🌙" : "☀️"}
            </span>
          </button>

          <a href="#bestill" className="hidden md:block text-white text-sm font-bold px-5 py-2 rounded-full transition-all hover:opacity-80 border border-purple-500" style={{ background: "#7c3aed" }}>
            Bestill nå
          </a>

          <button className="md:hidden p-2 rounded-lg" onClick={() => setOpen(!open)} style={{ background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)" }}>
            <div className="w-5 h-0.5 mb-1.5 rounded" style={{ background: dark ? "#e2e8f0" : "#374151", transform: open ? "rotate(45deg) translateY(8px)" : "none", transition: "all 0.2s" }} />
            <div className="w-5 h-0.5 mb-1.5 rounded" style={{ background: dark ? "#e2e8f0" : "#374151", opacity: open ? 0 : 1, transition: "all 0.2s" }} />
            <div className="w-5 h-0.5 rounded" style={{ background: dark ? "#e2e8f0" : "#374151", transform: open ? "rotate(-45deg) translateY(-8px)" : "none", transition: "all 0.2s" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 backdrop-blur-md" style={{ background: navBg, borderTop: `1px solid ${border}` }}>
          {["Pakker", "Galleri", "Bestill"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)} className="text-sm font-medium py-3 px-4 rounded-xl" style={{ color: linkColor }}>
              {item}
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
