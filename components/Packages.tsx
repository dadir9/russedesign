"use client";
import { useTheme } from "@/context/ThemeContext";

const packages = [
  {
    name: "Standard", value: "standard", price: 2990,
    description: "Enkelt og stilrent design.",
    features: ["1 logoforslag", "2 revisjoner", "Levering innen 48t", "PNG & PDF"],
    highlight: false, badge: null,
  },
  {
    name: "Gull", value: "gull", price: 4490,
    description: "Mest populære — full kreativ frihet.",
    features: ["3 logoforslag", "5 revisjoner", "Levering innen 24t", "Alle filformater", "Sosiale medier-versjon"],
    highlight: true, badge: "Mest populær",
  },
  {
    name: "VIP", value: "vip", price: 6990,
    description: "Det aller beste — ubegrenset alt.",
    features: ["Ubegrenset forslag", "Ubegrenset revisjoner", "Levering innen 12t", "Alle filformater", "Koftemal inkludert"],
    highlight: false, badge: "Premium",
  },
];

export default function Packages() {
  const { dark } = useTheme();

  const handleVelg = (value: string) => {
    const select = document.getElementById("pakke-select") as HTMLSelectElement;
    if (select) select.value = value;
    document.getElementById("bestill")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pakker" className="py-16 sm:py-24 px-4 sm:px-6 transition-all duration-300" style={{ background: dark ? "#0f0f13" : "#fff" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>Priser</p>
          <h2 className="text-3xl sm:text-5xl font-black transition-colors" style={{ color: dark ? "#f1f5f9" : "#0f0f13" }}>
            Velg din pakke
          </h2>
          <p className="text-sm mt-3 transition-colors" style={{ color: dark ? "#64748b" : "#9ca3af" }}>50% depositum ved bestilling — resten ved levering</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="rounded-2xl p-6 transition-all relative flex flex-col"
              style={{
                background: pkg.highlight ? "#7c3aed" : dark ? "#1a1a2e" : "#fafafa",
                border: pkg.highlight ? "none" : `1.5px solid ${dark ? "#2d2d4e" : "#ebebeb"}`,
              }}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: pkg.highlight ? "#fff" : dark ? "#2d1a4e" : "#0f0f13", color: pkg.highlight ? "#7c3aed" : dark ? "#a78bfa" : "#fff" }}>
                  {pkg.badge}
                </div>
              )}
              <p className="font-black text-xl mb-1" style={{ color: pkg.highlight ? "#fff" : dark ? "#f1f5f9" : "#0f0f13" }}>{pkg.name}</p>
              <p className="text-3xl font-black mb-0.5" style={{ color: pkg.highlight ? "#fff" : dark ? "#f1f5f9" : "#0f0f13" }}>{pkg.price.toLocaleString("no")} kr</p>
              <p className="text-xs mb-4" style={{ color: pkg.highlight ? "rgba(255,255,255,0.55)" : "#a78bfa" }}>
                Depositum: {(pkg.price / 2).toLocaleString("no")} kr
              </p>
              <p className="text-sm mb-5" style={{ color: pkg.highlight ? "rgba(255,255,255,0.7)" : dark ? "#64748b" : "#6b7280" }}>{pkg.description}</p>
              <ul className="space-y-2 mb-7 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2" style={{ color: pkg.highlight ? "rgba(255,255,255,0.85)" : dark ? "#94a3b8" : "#374151" }}>
                    <span style={{ color: pkg.highlight ? "#c4b5fd" : "#7c3aed" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleVelg(pkg.value)}
                className="w-full py-3.5 rounded-full text-sm font-bold transition-all hover:opacity-80 cursor-pointer"
                style={{
                  background: pkg.highlight ? "#fff" : "#7c3aed",
                  color: pkg.highlight ? "#7c3aed" : "#fff",
                }}
              >
                Velg {pkg.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
