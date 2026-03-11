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
    <section id="pakker" className="py-24 px-4 sm:px-6" style={{ background: "#0d0d14" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>Priser</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">Velg din pakke</h2>
            <p className="text-sm" style={{ color: "#475569" }}>50% depositum ved bestilling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="relative rounded-2xl p-6 flex flex-col transition-all hover:translate-y-[-2px]"
              style={{
                background: pkg.highlight ? "#7c3aed" : "#13131f",
                border: pkg.highlight ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-6 text-xs font-black px-3 py-1 rounded-full"
                  style={{ background: pkg.highlight ? "#fff" : "#7c3aed", color: pkg.highlight ? "#7c3aed" : "#fff" }}>
                  {pkg.badge}
                </div>
              )}

              <p className="font-black text-xl mb-1" style={{ color: pkg.highlight ? "#fff" : "#f1f5f9" }}>{pkg.name}</p>
              <p className="text-3xl font-black mb-0.5" style={{ color: pkg.highlight ? "#fff" : "#f1f5f9" }}>
                {pkg.price.toLocaleString("no")} <span className="text-base font-semibold">kr</span>
              </p>
              <p className="text-xs mb-4" style={{ color: pkg.highlight ? "rgba(255,255,255,0.5)" : "#475569" }}>
                Depositum: {(pkg.price / 2).toLocaleString("no")} kr
              </p>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: pkg.highlight ? "rgba(255,255,255,0.65)" : "#64748b" }}>
                {pkg.description}
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2.5" style={{ color: pkg.highlight ? "rgba(255,255,255,0.85)" : "#94a3b8" }}>
                    <span className="text-xs" style={{ color: pkg.highlight ? "#c4b5fd" : "#7c3aed" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleVelg(pkg.value)}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 cursor-pointer"
                style={{
                  background: pkg.highlight ? "#fff" : "rgba(124,58,237,0.15)",
                  color: pkg.highlight ? "#7c3aed" : "#a78bfa",
                  border: pkg.highlight ? "none" : "1px solid rgba(124,58,237,0.3)",
                }}
              >
                Velg {pkg.name} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
