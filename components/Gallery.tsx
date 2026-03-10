"use client";
import { useTheme } from "@/context/ThemeContext";

const items = [
  { label: "Klassisk", sub: "Russ 2025", lightBg: "#f3e8ff", darkBg: "#2d1a4e", accent: "#7c3aed" },
  { label: "Pink Vibes", sub: "Russ 2025", lightBg: "#fce7f3", darkBg: "#3d1a2e", accent: "#ec4899" },
  { label: "Minimalist", sub: "Russ 2025", lightBg: "#eff6ff", darkBg: "#1a2a3e", accent: "#3b82f6" },
  { label: "Bold", sub: "Russ 2025", lightBg: "#fef3c7", darkBg: "#2e2a1a", accent: "#f59e0b" },
  { label: "Vintage", sub: "Russ 2025", lightBg: "#dcfce7", darkBg: "#1a2e1a", accent: "#16a34a" },
  { label: "Arctic", sub: "Russ 2025", lightBg: "#f0f9ff", darkBg: "#1a2a3e", accent: "#0ea5e9" },
];

export default function Gallery() {
  const { dark } = useTheme();

  return (
    <section id="galleri" className="py-16 sm:py-24 px-4 sm:px-6 transition-all duration-300" style={{ background: dark ? "#1a1a2e" : "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-3" style={{ background: dark ? "#2d1a4e" : "#f3e8ff", color: "#a78bfa" }}>
            ✨ Galleri
          </div>
          <h2 className="text-3xl sm:text-5xl font-black transition-colors" style={{ color: dark ? "#f1f5f9" : "#111827" }}>
            Tidligere design
          </h2>
          <p className="text-sm mt-2 transition-colors" style={{ color: dark ? "#64748b" : "#9ca3af" }}>Sjekk ut hva vi har laget! 🎨</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: dark ? item.darkBg : item.lightBg }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3" style={{ background: item.accent }}>
                <span className="text-lg sm:text-2xl font-black text-white">RD</span>
              </div>
              <p className="font-black text-xs sm:text-sm transition-colors" style={{ color: dark ? "#f1f5f9" : "#111827" }}>{item.label}</p>
              <p className="text-xs mt-0.5 transition-colors" style={{ color: dark ? "#64748b" : "#9ca3af" }}>{item.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs sm:text-sm mt-6 transition-colors" style={{ color: dark ? "#64748b" : "#9ca3af" }}>
          🖼️ Dine egne logoer vises her
        </p>
      </div>
    </section>
  );
}
