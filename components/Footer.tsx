"use client";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { dark } = useTheme();
  return (
    <footer className="py-10 px-6 transition-all duration-300" style={{ background: dark ? "#0a0a0f" : "#111827" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-black text-lg" style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          RusseDesign ✦
        </span>
        <div className="flex gap-8 text-sm font-bold text-gray-500">
          <a href="#pakker" className="hover:text-white transition-colors">Pakker</a>
          <a href="#galleri" className="hover:text-white transition-colors">Galleri</a>
          <a href="#bestill" className="hover:text-white transition-colors">Bestill</a>
        </div>
        <p className="text-xs text-gray-600">© 2026 RusseDesign 💜</p>
      </div>
    </footer>
  );
}
