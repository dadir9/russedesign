"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type PackageData = {
  name: string; price: number; deposit: number; badge: string | null;
  color: string; description: string; features: string[]; delivery: string;
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
    setFiles(prev => [...prev, ...Array.from(f).filter(x => x.type.startsWith("image/"))].slice(0, 5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const fd = new FormData();
    fd.append("navn", navn); fd.append("epost", epost); fd.append("pakke", pakke);
    fd.append("russekull", russekull); fd.append("beskrivelse", beskrivelse);
    files.forEach(f => fd.append("bilder", f));
    const res = await fetch("/api/orders", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Noe gikk galt."); setLoading(false); return; }
    router.push("/bestilling-bekreftet");
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1px solid #e5e7eb", background: "#fff",
    fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box",
  };
  const label: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6,
  };
  const card: React.CSSProperties = {
    background: "#fff", border: "1px solid #e5e7eb",
    borderRadius: 16, padding: 24, marginBottom: 16,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 64px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#9ca3af", marginBottom: 32 }}>
          <a href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Hjem</a>
          <span>/</span>
          <a href="/#pakker" style={{ color: "#6b7280", textDecoration: "none" }}>Pakker</a>
          <span>/</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>{data.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }} className="bestill-grid">

          {/* ── LEFT ── */}
          <form onSubmit={handleSubmit}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111827", margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              Bestillingsskjema
            </h1>

            {/* Customer info */}
            <div style={card}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Kundeinformasjon</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="info-grid">
                <div>
                  <label style={label}>Navn</label>
                  <div style={{ position: "relative" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input type="text" required value={navn} onChange={e => setNavn(e.target.value)}
                      placeholder="Ditt navn" style={{ ...inp, paddingLeft: 34 }} />
                  </div>
                </div>
                <div>
                  <label style={label}>E-post</label>
                  <div style={{ position: "relative" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
                    </svg>
                    <input type="email" required value={epost} onChange={e => setEpost(e.target.value)}
                      placeholder="din@epost.no" style={{ ...inp, paddingLeft: 34 }} />
                  </div>
                </div>
                <div>
                  <label style={label}>Telefonnummer</label>
                  <div style={{ display: "flex" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 10px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRight: "none", borderRadius: "10px 0 0 10px", flexShrink: 0 }}>
                      <span>🇳🇴</span>
                      <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>+47</span>
                    </div>
                    <input type="tel" value={telefon} onChange={e => setTelefon(e.target.value)}
                      placeholder="XXX XX XXX"
                      style={{ ...inp, borderRadius: "0 10px 10px 0", borderLeft: "none", flex: 1 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Total amount — like the screenshot */}
            <div style={{ ...card, textAlign: "center", background: "#fff" }}>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 8px" }}>Depositum å betale nå</p>
              <p style={{ fontSize: 40, fontWeight: 900, color: "#111827", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
                {data.deposit.toLocaleString("no")} kr
              </p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                Resterende {data.deposit.toLocaleString("no")} kr betales ved levering
              </p>
            </div>

            {/* Design info */}
            <div style={card}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Designinformasjon</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={label}>Russekull / År</label>
                  <input type="text" required placeholder="f.eks. Russ 2026" value={russekull}
                    onChange={e => setRussekull(e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={label}>Beskriv ønsket design</label>
                  <textarea required rows={4} placeholder="Farger, stil, navn, inspirasjon..."
                    value={beskrivelse} onChange={e => setBeskrivelse(e.target.value)}
                    style={{ ...inp, resize: "none" }} />
                </div>
              </div>
            </div>

            {/* File upload */}
            <div style={card}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                Inspirasjonbilder
                <span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af", marginLeft: 6 }}>(valgfritt, maks 5)</span>
              </p>
              <div onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                style={{ border: `2px dashed ${dragging ? "#7c3aed" : "#e5e7eb"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginTop: 12, background: dragging ? "#f5f3ff" : "#fafafa", transition: "all 0.2s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>Dra og slipp bilder her</p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>eller <span style={{ color: "#7c3aed", fontWeight: 600 }}>klikk for å velge</span></p>
                <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              </div>
              {files.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {files.map((file, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img src={URL.createObjectURL(file)} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb" }} />
                      <button type="button" onClick={() => setFiles(p => p.filter((_, idx) => idx !== i))}
                        style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p style={{ color: "#ef4444", fontSize: 14, textAlign: "center", marginBottom: 12 }}>{error}</p>}
          </form>

          {/* ── RIGHT — Order summary ── */}
          <div style={{ position: "sticky", top: 88 }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>

              {/* Order ID */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Ordre ID</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: 0, fontFamily: "monospace" }}>{orderId}</p>
              </div>

              {/* Package card */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 14, background: "linear-gradient(135deg, #f5f3ff, #fce7f3)", border: "1px solid #ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>R</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{data.name} pakke</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Profesjonelt russelogodesign</p>
                  {data.badge && <span style={{ fontSize: 11, fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "2px 8px", borderRadius: 99 }}>{data.badge}</span>}
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>{data.price.toLocaleString("no")} kr</p>
              </div>

              {/* Payment summary */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: "0 0 14px" }}>Betalingsoversikt</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "#6b7280" }}>{data.name} pakke</span>
                    <span style={{ fontWeight: 600, color: "#111827" }}>{data.price.toLocaleString("no")} kr</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <div>
                      <span style={{ color: "#6b7280" }}>Depositum (50%)</span>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>Betales nå</p>
                    </div>
                    <span style={{ fontWeight: 600, color: "#10b981" }}>-{data.deposit.toLocaleString("no")} kr</span>
                  </div>
                  <div style={{ height: 1, background: "#f3f4f6" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Total nå</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#7c3aed" }}>{data.deposit.toLocaleString("no")} kr</span>
                  </div>
                </div>
              </div>

              {/* Delivery badge */}
              <div style={{ padding: "14px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>Levering innen {data.delivery}</span>
              </div>

              {/* CTA */}
              <div style={{ padding: "20px 24px" }}>
                <button type="submit" form="bestill-form" onClick={handleSubmit} disabled={loading}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#7c3aed", color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginBottom: 12 }}>
                  {loading ? "Sender..." : "Send bestilling →"}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Betalinger er sikre og krypterte</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Powered by <strong style={{ color: "#6b7280" }}>RusseDesign</strong></span>
                  <span style={{ color: "#e5e7eb" }}>·</span>
                  <a href="#" style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>Vilkår</a>
                  <span style={{ color: "#e5e7eb" }}>·</span>
                  <a href="#" style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>Personvern</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bestill-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
