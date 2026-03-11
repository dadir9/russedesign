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
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16"
        style={{ background: "#0a0a0f" }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "10%",
            right: "5%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-8 flex flex-col lg:flex-row items-center gap-16 py-20 pb-32">

          {/* ── Left side ── */}
          <div className="flex-1 lg:max-w-[52%]">
            {/* Tag */}
            <p className="text-xs font-extrabold tracking-[0.18em] uppercase mb-6" style={{ color: "#7c3aed" }}>
              ✦ Norges beste russedesign
            </p>

            {/* Heading */}
            <h1 className="font-black leading-[1.05] tracking-tight mb-6" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}>
              <span className="text-white">Vi lager din,</span>
              <span className="block relative w-fit mt-1">
                <span style={{ background: "linear-gradient(90deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  unike
                </span>
                {/* Underline SVG like Jadoo */}
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                  <path d="M0 4 Q50 0 100 4 Q150 8 200 3" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <span className="block text-white mt-1">russelogo.</span>
            </h1>

            <p className="text-base sm:text-lg mb-10 max-w-md leading-relaxed" style={{ color: "#64748b" }}>
              Profesjonelt logodesign til russekofter, biler og busser. Rask levering, ubegrenset revisjoner.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#bestill"
                className="text-white font-bold px-8 py-4 rounded-full text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
                style={{ background: "#7c3aed", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}
              >
                Bestill logo nå
              </a>

              <a href="#galleri" className="flex items-center gap-3 font-semibold text-sm transition-all hover:opacity-80" style={{ color: "#94a3b8" }}>
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                  style={{ border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}
                >
                  <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
                    <path d="M1 1.5L12 7.5L1 13.5V1.5Z" fill="#a78bfa" />
                  </svg>
                </span>
                Se eksempler
              </a>
            </div>
          </div>

          {/* ── Right side — decorative visual ── */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative" style={{ width: "420px", height: "420px" }}>

              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle at 40% 35%, rgba(124,58,237,0.22), rgba(236,72,153,0.08) 60%, transparent 80%)",
                }}
              />

              {/* Main blob circle */}
              <div
                className="absolute"
                style={{
                  top: "8%", left: "8%", right: "8%", bottom: "8%",
                  borderRadius: "50%",
                  background: "rgba(124,58,237,0.07)",
                  border: "1px solid rgba(124,58,237,0.18)",
                }}
              />

              {/* Center logo card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div
                    className="w-44 h-44 rounded-[2.5rem] flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.15))",
                      border: "1px solid rgba(124,58,237,0.35)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 20px 60px rgba(124,58,237,0.25)",
                    }}
                  >
                    <span
                      className="text-8xl font-black"
                      style={{ background: "linear-gradient(135deg, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      R
                    </span>
                  </div>

                  {/* Floating badge — VIP */}
                  <div
                    className="absolute -top-7 -right-14 px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                    style={{ background: "#7c3aed", boxShadow: "0 4px 16px rgba(124,58,237,0.5)" }}
                  >
                    ✦ VIP Design
                  </div>

                  {/* Floating badge — levering */}
                  <div
                    className="absolute -bottom-7 -left-14 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
                  >
                    ⚡ 48t levering
                  </div>

                  {/* Floating badge — count */}
                  <div
                    className="absolute top-1/2 -right-20 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    500+ logoer
                  </div>
                </div>
              </div>

              {/* Decorative dots */}
              <div className="absolute top-10 left-10 w-3 h-3 rounded-full" style={{ background: "#7c3aed", opacity: 0.7 }} />
              <div className="absolute bottom-14 right-10 w-2.5 h-2.5 rounded-full" style={{ background: "#ec4899", opacity: 0.7 }} />
              <div className="absolute top-1/3 left-5 w-2 h-2 rounded-full" style={{ background: "#a78bfa", opacity: 0.5 }} />
              <div className="absolute bottom-1/3 right-5 w-2 h-2 rounded-full" style={{ background: "#7c3aed", opacity: 0.4 }} />

              {/* Star decorations */}
              <span className="absolute top-12 right-20 text-2xl" style={{ color: "#a78bfa", opacity: 0.5 }}>✦</span>
              <span className="absolute bottom-16 left-20 text-xl" style={{ color: "#ec4899", opacity: 0.4 }}>✦</span>
            </div>
          </div>
        </div>

        {/* Stats bar pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center py-6 px-4"
                  style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                >
                  <p className="text-2xl sm:text-3xl font-black text-white">{s.num}</p>
                  <p className="text-xs mt-1" style={{ color: "#475569" }}>{s.label}</p>
                </div>
              ))}
            </div>
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
