"use client";
import { useTheme } from "@/context/ThemeContext";

export default function Hero() {
  const { dark } = useTheme();
  const bg = dark ? "linear-gradient(135deg, #0f0f1a 0%, #1a0a2e 50%, #0a0f1a 100%)" : "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #eff6ff 100%)";

  return (
    <section className="pt-14 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 transition-all duration-300" style={{ background: bg }}>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border" style={{ background: dark ? "#1e1040" : "#f5f3ff", color: "#7c3aed", borderColor: dark ? "#4c1d95" : "#ddd6fe" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
        Russekull 2026 — Åpne bestillinger
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-none mb-5 transition-colors" style={{ color: dark ? "#f1f5f9" : "#0f0f13" }}>
        Din
        <span className="block" style={{ color: "#7c3aed" }}>russelogo.</span>
      </h1>

      <p className="text-base sm:text-lg max-w-sm sm:max-w-md mb-10 transition-colors leading-relaxed" style={{ color: dark ? "#94a3b8" : "#6b7280" }}>
        Vi lager logoer til russekofter, biler og busser. Profesjonelt design, rask levering.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-14 w-full sm:w-auto px-2 sm:px-0">
        <a href="#bestill" className="text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all hover:opacity-90 text-center" style={{ background: "#7c3aed" }}>
          Bestill logo
        </a>
        <a href="#galleri" className="font-semibold px-8 py-3.5 rounded-full text-sm border transition-all hover:border-purple-400 text-center" style={{ borderColor: dark ? "#2d2d4e" : "#e5e7eb", color: dark ? "#e2e8f0" : "#374151" }}>
          Se eksempler
        </a>
      </div>

      <div className="flex gap-8 sm:gap-16">
        {[
          { num: "500+", label: "Logoer laget" },
          { num: "100%", label: "Fornøyde kunder" },
          { num: "48t", label: "Leveringstid" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl sm:text-3xl font-black transition-colors" style={{ color: dark ? "#f1f5f9" : "#0f0f13" }}>{s.num}</p>
            <p className="text-xs font-medium mt-1 transition-colors" style={{ color: dark ? "#64748b" : "#9ca3af" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
