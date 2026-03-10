"use client";

const stats = [
  { num: "500+", label: "Logoer laget" },
  { num: "100%", label: "Fornøyde kunder" },
  { num: "48t", label: "Leveringstid" },
  { num: "2026", label: "Russekull" },
];

const marqueeItems = [
  "Russekofte", "Buss", "Bil", "Minimalist", "Bold", "Klassisk",
  "Pink Vibes", "Vintage", "Arctic", "Crew", "Graffiti", "Premium",
  "Russekofte", "Buss", "Bil", "Minimalist", "Bold", "Klassisk",
  "Pink Vibes", "Vintage", "Arctic", "Crew", "Graffiti", "Premium",
];

export default function Hero() {
  return (
    <>
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden grid-bg gradient-lines pt-16">
        {/* Radial fade */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(10,10,15,0.9) 0%, transparent 60%)" }} />

        <div className="relative z-10 fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 border" style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", borderColor: "rgba(124,58,237,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block animate-pulse" />
            Russekull 2026 — Åpne bestillinger
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-[96px] font-black leading-none mb-6 tracking-tighter">
            <span className="text-white">Vi lager din</span>
            <span className="block relative inline-block mt-1">
              <span style={{ background: "linear-gradient(90deg, #a78bfa, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                russelogo.
              </span>
              {/* Animated underline */}
              <svg className="absolute -bottom-3 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none">
                <path d="M0 6 Q100 0 200 5 Q300 10 400 4" stroke="#7c3aed" strokeWidth="2.5" fill="none" strokeLinecap="round"
                  style={{ strokeDasharray: 450, strokeDashoffset: 0, transition: "stroke-dashoffset 1s ease" }} />
              </svg>
            </span>
          </h1>

          <p className="text-base sm:text-lg max-w-sm sm:max-w-lg mx-auto mb-10 leading-relaxed" style={{ color: "#64748b" }}>
            Profesjonelt logodesign til russekofter, biler og busser. Rask levering, ubegrenset revisjoner.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#bestill" className="text-white font-bold px-8 py-4 rounded-full text-sm transition-all hover:opacity-90 hover:scale-[1.02]" style={{ background: "#7c3aed" }}>
              Bestill logo nå →
            </a>
            <a href="#galleri" className="font-semibold px-8 py-4 rounded-full text-sm border transition-all hover:border-purple-500 hover:text-white" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#64748b" }}>
              Se eksempler
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 w-full max-w-2xl mt-20 mb-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-6 px-4" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <p className="text-2xl sm:text-3xl font-black text-white">{s.num}</p>
                <p className="text-xs mt-1" style={{ color: "#475569" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="w-full overflow-hidden py-5 border-y" style={{ background: "#0d0d14", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex gap-10 marquee-track whitespace-nowrap">
          {marqueeItems.map((item, i) => (
            <span key={i} className="text-sm font-bold flex items-center gap-3 flex-shrink-0" style={{ color: "#334155" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-700 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
