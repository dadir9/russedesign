"use client";
import SparkleButton from "./SparkleButton";

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
      <section style={{ background: "#ffffff", paddingTop: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">

            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 99, padding: "5px 14px", marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.05em" }}>Norges beste russedesign</span>
              </div>

              {/* Heading */}
              <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, lineHeight: 1.1, color: "#111827", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
                Vi lager din{" "}
                <span style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  unike
                </span>
                <br />russelogo.
              </h1>

              {/* Description */}
              <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 480 }}>
                Profesjonelt logodesign til russekofter, biler og busser.
                Rask levering og ubegrenset revisjoner til du er fornøyd.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <SparkleButton href="/bestill">Bestill logo nå</SparkleButton>
                <a href="#galleri" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "#374151", textDecoration: "none", padding: "10px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
                  Se eksempler
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>

              {/* Trust row */}
              <div style={{ display: "flex", gap: 24, marginTop: 48, paddingTop: 40, borderTop: "1px solid #f3f4f6" }}>
                {stats.map((s, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: 0 }}>{s.num}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual card */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
                {/* Main card */}
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>RD</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", margin: 0 }}>Russelogo 2026</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Gull-pakken</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "3px 10px", borderRadius: 99 }}>Levert ✓</span>
                  </div>

                  {/* Logo preview area */}
                  <div style={{ background: "linear-gradient(135deg, #f5f3ff, #fce7f3)", borderRadius: 14, height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <span style={{ fontSize: 72, fontWeight: 900, background: "linear-gradient(135deg, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>R</span>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "3 logoforslag", icon: "✦" },
                      { label: "5 revisjoner inkludert", icon: "✦" },
                      { label: "Levering innen 24t", icon: "✦" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#7c3aed", fontSize: 10 }}>{item.icon}</span>
                        <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div style={{ position: "absolute", top: -16, right: -16, background: "#7c3aed", color: "#fff", fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 12, boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
                  ⚡ 48t levering
                </div>
                <div style={{ position: "absolute", bottom: -16, left: -16, background: "#fff", border: "1px solid #e5e7eb", fontSize: 12, fontWeight: 700, color: "#374151", padding: "8px 16px", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                  🇳🇴 500+ fornøyde kunder
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div style={{ borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6", background: "#fafafa", overflow: "hidden", padding: "14px 0" }}>
          <div className="flex gap-10 marquee-track whitespace-nowrap">
            {marqueeItems.map((item, i) => (
              <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </>
  );
}
