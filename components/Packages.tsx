"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const packages = [
  {
    name: "Standard", value: "standard", price: 2990,
    description: "Enkelt og stilrent design for deg som vil ha noe pent uten alt det ekstra.",
    features: ["1 logoforslag", "2 revisjoner", "Levering innen 48t", "PNG & PDF"],
    highlight: false, badge: null,
  },
  {
    name: "Gull", value: "gull", price: 4490,
    description: "Mest valgte pakken. Full kreativ frihet og rask levering.",
    features: ["3 logoforslag", "5 revisjoner", "Levering innen 24t", "Alle filformater", "Sosiale medier-versjon"],
    highlight: true, badge: "Mest populær",
  },
  {
    name: "VIP", value: "vip", price: 6990,
    description: "Det aller beste — ubegrenset alt og raskest levering.",
    features: ["Ubegrenset forslag", "Ubegrenset revisjoner", "Levering innen 12t", "Alle filformater", "Koftemal inkludert"],
    highlight: false, badge: "Premium",
  },
];

export default function Packages() {
  const router = useRouter();
  const handleVelg = async (value: string) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.push(`/bestill/${value}`);
    } else {
      router.push(`/konto?next=/bestill/${value}`);
    }
  };

  return (
    <section id="pakker" style={{ background: "#f9fafb", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Priser</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>
              Velg din pakke
            </h2>
            <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>50% depositum ved bestilling · Resten ved levering</p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.name} style={{
              position: "relative",
              background: pkg.highlight ? "#7c3aed" : "#ffffff",
              border: pkg.highlight ? "none" : "1px solid #e5e7eb",
              borderRadius: 16,
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              boxShadow: pkg.highlight ? "0 24px 64px rgba(124,58,237,0.3)" : "0 2px 8px rgba(0,0,0,0.04)",
              transform: pkg.highlight ? "scale(1.03)" : "none",
            }}>
              {pkg.badge && (
                <div style={{ position: "absolute", top: -12, left: 28, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
                  background: pkg.highlight ? "#fff" : "#7c3aed", color: pkg.highlight ? "#7c3aed" : "#fff",
                  padding: "4px 12px", borderRadius: 99 }}>
                  {pkg.badge}
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: pkg.highlight ? "rgba(255,255,255,0.7)" : "#9ca3af", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {pkg.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: pkg.highlight ? "#fff" : "#111827", lineHeight: 1 }}>
                    {pkg.price.toLocaleString("no")}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: pkg.highlight ? "rgba(255,255,255,0.6)" : "#9ca3af" }}>kr</span>
                </div>
                <p style={{ fontSize: 12, color: pkg.highlight ? "rgba(255,255,255,0.5)" : "#9ca3af", margin: "4px 0 0" }}>
                  Depositum {(pkg.price / 2).toLocaleString("no")} kr
                </p>
              </div>

              <p style={{ fontSize: 14, color: pkg.highlight ? "rgba(255,255,255,0.75)" : "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>
                {pkg.description}
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {pkg.features.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: pkg.highlight ? "rgba(255,255,255,0.85)" : "#374151" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={pkg.highlight ? "#c4b5fd" : "#7c3aed"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => handleVelg(pkg.value)}
                style={{
                  width: "100%", padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", transition: "opacity 0.2s",
                  background: pkg.highlight ? "#fff" : "#111827",
                  color: pkg.highlight ? "#7c3aed" : "#fff",
                }}>
                Velg {pkg.name} →
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .packages-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
