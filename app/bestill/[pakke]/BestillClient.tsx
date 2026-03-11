"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type PackageData = {
  name: string;
  price: number;
  deposit: number;
  badge: string | null;
  color: string;
  description: string;
  features: string[];
  delivery: string;
};

const inputStyle: React.CSSProperties = {
  background: "#13131f",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "#f1f5f9",
  width: "100%",
  padding: "11px 14px",
  fontSize: "14px",
  outline: "none",
};

const sectionCard: React.CSSProperties = {
  background: "#0d0d14",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "20px",
  padding: "24px",
  marginBottom: "16px",
};

export default function BestillClient({ pakke, data }: { pakke: string; data: PackageData }) {
  const router = useRouter();
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [telefon, setTelefon] = useState("");
  const [russekull, setRussekull] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const orderId = `RD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: auth }) => {
      if (!auth.user) return;
      setEpost(auth.user.email || "");
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
      if (profile) { setNavn(profile.navn || ""); setTelefon(profile.telefon || ""); }
    });
  }, [pakke, router]);

  const handleFiles = (f: FileList | null) => {
    if (!f) return;
    setFiles((prev) => [...prev, ...Array.from(f).filter((x) => x.type.startsWith("image/"))].slice(0, 5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.append("navn", navn); fd.append("epost", epost); fd.append("pakke", pakke);
    fd.append("russekull", russekull); fd.append("beskrivelse", beskrivelse);
    files.forEach((f) => fd.append("bilder", f));
    const res = await fetch("/api/orders", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Noe gikk galt."); setLoading(false); return; }
    router.push("/bestilling-bekreftet");
  };

  const labelStyle: React.CSSProperties = { color: "#475569", fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" };

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6" style={{ minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#334155" }}>
          <a href="/" className="hover:text-white transition-colors">Hjem</a>
          <span>/</span>
          <a href="/#pakker" className="hover:text-white transition-colors">Pakker</a>
          <span>/</span>
          <span style={{ color: "#94a3b8" }}>{data.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── LEFT ── */}
          <form onSubmit={handleSubmit}>

            <h1 className="text-3xl font-black text-white mb-6">Betalingsmetode</h1>

            {/* Customer info */}
            <div style={sectionCard}>
              <p className="text-sm font-black text-white mb-4">Kundeinformasjon</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label style={labelStyle}>Navn</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <input type="text" required value={navn} onChange={(e) => setNavn(e.target.value)}
                      placeholder="Ditt navn" style={{ ...inputStyle, paddingLeft: "34px" }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>E-post</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                      </svg>
                    </div>
                    <input type="email" required value={epost} onChange={(e) => setEpost(e.target.value)}
                      placeholder="din@epost.no" style={{ ...inputStyle, paddingLeft: "34px" }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Telefon</label>
                  <div className="relative flex">
                    <div className="flex items-center gap-1 px-3 rounded-l-xl flex-shrink-0"
                      style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)", borderRight: "none" }}>
                      <span className="text-sm">🇳🇴</span>
                      <span className="text-xs" style={{ color: "#64748b" }}>+47</span>
                    </div>
                    <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)}
                      placeholder="XXX XX XXX"
                      style={{ ...inputStyle, borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
                    {telefon && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Design info */}
            <div style={sectionCard}>
              <p className="text-sm font-black text-white mb-4">Designinformasjon</p>
              <div className="space-y-3">
                <div>
                  <label style={labelStyle}>Russekull / År</label>
                  <input type="text" required placeholder="f.eks. Russ 2026" value={russekull}
                    onChange={(e) => setRussekull(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Beskriv ønsket design</label>
                  <textarea required rows={4} placeholder="Farger, stil, navn, inspirasjon..."
                    value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)}
                    style={{ ...inputStyle, resize: "none" }} />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div style={sectionCard}>
              <p className="text-sm font-black text-white mb-4">
                Bilder / inspirasjon <span className="font-normal text-xs" style={{ color: "#334155" }}>(valgfritt, maks 5)</span>
              </p>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                className="rounded-xl cursor-pointer flex flex-col items-center justify-center py-7 px-4 text-center transition-all"
                style={{ border: `2px dashed ${dragging ? "#7c3aed" : "rgba(255,255,255,0.07)"}`, background: dragging ? "rgba(124,58,237,0.06)" : "transparent" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(124,58,237,0.12)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">Dra og slipp bilder her</p>
                <p className="text-xs mt-1" style={{ color: "#475569" }}>eller <span style={{ color: "#7c3aed" }}>klikk for å velge</span></p>
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((file, i) => (
                    <div key={i} className="relative">
                      <img src={URL.createObjectURL(file)} alt="" className="w-14 h-14 object-cover rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                      <button type="button" onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black"
                        style={{ background: "#ef4444" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-sm text-center mb-4" style={{ color: "#ef4444" }}>{error}</p>}
          </form>

          {/* ── RIGHT — Order summary ── */}
          <div className="lg:sticky lg:top-24">
            <div style={{ ...sectionCard, marginBottom: 0 }}>

              {/* Order ID */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#475569" }}>Order ID</p>
                <p className="text-sm font-mono font-bold" style={{ color: "#94a3b8" }}>{orderId}</p>
              </div>

              {/* Package visual */}
              <div className="rounded-2xl p-5 mb-5 flex items-center gap-4"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${data.color}33, rgba(236,72,153,0.2))`, border: `1px solid ${data.color}44` }}>
                  <span className="text-2xl font-black" style={{ color: data.color }}>R</span>
                </div>
                <div>
                  <p className="font-black text-white">{data.name} pakke</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Profesjonelt russelogodesign</p>
                  {data.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: `${data.color}22`, color: data.color }}>{data.badge}</span>
                  )}
                </div>
                <p className="ml-auto font-black text-white whitespace-nowrap">{data.price.toLocaleString("no")} kr</p>
              </div>

              {/* Payment summary */}
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#475569" }}>Betalingsoversikt</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#64748b" }}>{data.name} pakke</span>
                    <span className="font-bold text-white">{data.price.toLocaleString("no")} kr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span style={{ color: "#64748b" }}>Depositum nå</span>
                      <p className="text-xs" style={{ color: "#334155" }}>50% ved bestilling</p>
                    </div>
                    <span className="font-bold" style={{ color: "#10b981" }}>-{data.deposit.toLocaleString("no")} kr</span>
                  </div>
                  <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="flex justify-between">
                    <span className="text-sm font-black text-white">Betales nå</span>
                    <span className="text-lg font-black" style={{ color: data.color }}>{data.deposit.toLocaleString("no")} kr</span>
                  </div>
                  <p className="text-xs" style={{ color: "#334155" }}>Resterende {data.deposit.toLocaleString("no")} kr betales ved levering</p>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-xs font-bold" style={{ color: "#10b981" }}>Levering innen {data.delivery}</span>
              </div>

              {/* Submit */}
              <button type="submit" form="bestill-form" onClick={handleSubmit} disabled={loading}
                className="w-full py-4 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "#7c3aed", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
                {loading ? "Sender..." : `Send bestilling →`}
              </button>

              {/* Security */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <p className="text-xs" style={{ color: "#334155" }}>Betalinger er sikre og krypterte</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <p className="text-xs" style={{ color: "#1e293b" }}>Powered by <span className="font-bold" style={{ color: "#475569" }}>RusseDesign</span></p>
                <span style={{ color: "#1e293b" }}>·</span>
                <a href="#" className="text-xs hover:text-white transition-colors" style={{ color: "#334155" }}>Vilkår</a>
                <span style={{ color: "#1e293b" }}>·</span>
                <a href="#" className="text-xs hover:text-white transition-colors" style={{ color: "#334155" }}>Personvern</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
