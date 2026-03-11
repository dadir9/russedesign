"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const steps = [
  { id: 1, label: "Pakke" },
  { id: 2, label: "Din info" },
  { id: 3, label: "Design" },
];

const packages = [
  {
    id: "standard",
    name: "Standard",
    price: "2.990 kr",
    features: ["1 logo-konsept", "2 revisjoner", "PNG + PDF", "5 dagers levering"],
  },
  {
    id: "gull",
    name: "Gull",
    price: "4.490 kr",
    features: ["3 logo-konsepter", "Ubegrenset revisjoner", "Alle filformater", "3 dagers levering"],
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: "6.990 kr",
    features: ["5 logo-konsepter", "Prioritert support", "Alle filformater", "48t levering"],
  },
];

const inputStyle = {
  background: "#13131f",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#f1f5f9",
  width: "100%",
  padding: "14px 16px",
  fontSize: "15px",
  outline: "none",
} as React.CSSProperties;

const labelStyle: React.CSSProperties = {
  color: "#475569",
  fontSize: "12px",
  fontWeight: 600,
  display: "block",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

export default function OrderForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pakke, setPakke] = useState("");
  const [navn, setNavn] = useState("");
  const [epost, setEpost] = useState("");
  const [russekull, setRussekull] = useState("");
  const [beskrivelse, setBeskrivelse] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => f.type.startsWith("image/")).slice(0, 5);
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("navn", navn);
    formData.append("epost", epost);
    formData.append("pakke", pakke);
    formData.append("russekull", russekull);
    formData.append("beskrivelse", beskrivelse);
    files.forEach((fil) => formData.append("bilder", fil));

    const res = await fetch("/api/orders", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Noe gikk galt, prøv igjen.");
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/bestilling-bekreftet");
  };

  const canNext1 = !!pakke;
  const canNext2 = navn.trim() && epost.trim() && russekull.trim();

  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 flex flex-col items-center" style={{ background: "#0a0a0f" }}>
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-extrabold tracking-widest uppercase mb-3" style={{ color: "#7c3aed" }}>Bestilling</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Bestill din logo</h1>
          <p className="text-sm mt-3" style={{ color: "#475569" }}>Fyll ut stegene under — vi tar kontakt innen 24 timer</p>
        </div>

        {/* Step tabs */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => {
                  if (s.id < step) setStep(s.id);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: step === s.id ? "rgba(124,58,237,0.15)" : "transparent",
                  color: step === s.id ? "#a78bfa" : step > s.id ? "#7c3aed" : "#334155",
                  cursor: s.id < step ? "pointer" : "default",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    background: step > s.id ? "#7c3aed" : step === s.id ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)",
                    color: step >= s.id ? "#fff" : "#334155",
                  }}
                >
                  {step > s.id ? "✓" : s.id}
                </span>
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className="w-12 h-px mx-1" style={{ background: step > s.id ? "#7c3aed" : "rgba(255,255,255,0.08)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Velg pakke */}
        {step === 1 && (
          <div className="fade-up">
            <div className="grid gap-4">
              {packages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPakke(p.id)}
                  className="relative w-full text-left rounded-2xl p-5 transition-all"
                  style={{
                    background: pakke === p.id ? "rgba(124,58,237,0.12)" : "#13131f",
                    border: `1.5px solid ${pakke === p.id ? "#7c3aed" : "rgba(255,255,255,0.07)"}`,
                    boxShadow: pakke === p.id ? "0 0 0 1px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  {p.popular && (
                    <span className="absolute -top-3 left-5 text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: "#7c3aed" }}>
                      Mest populær
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: pakke === p.id ? "#7c3aed" : "rgba(255,255,255,0.2)" }}
                      >
                        {pakke === p.id && <div className="w-2 h-2 rounded-full" style={{ background: "#7c3aed" }} />}
                      </div>
                      <span className="font-black text-lg text-white">{p.name}</span>
                    </div>
                    <span className="font-black text-white">{p.price}</span>
                  </div>
                  <ul className="grid grid-cols-2 gap-1.5 pl-7">
                    {p.features.map((f) => (
                      <li key={f} className="text-xs flex items-center gap-1.5" style={{ color: "#64748b" }}>
                        <span style={{ color: "#7c3aed" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canNext1}
              className="w-full mt-6 py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "#7c3aed" }}
            >
              Neste steg →
            </button>
          </div>
        )}

        {/* Step 2 — Din info */}
        {step === 2 && (
          <div className="fade-up space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Navn</label>
                <input
                  type="text"
                  required
                  placeholder="Ditt navn"
                  value={navn}
                  onChange={(e) => setNavn(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>E-post</label>
                <input
                  type="email"
                  required
                  placeholder="din@epost.no"
                  value={epost}
                  onChange={(e) => setEpost(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Russekull / År</label>
              <input
                type="text"
                required
                placeholder="f.eks. Russ 2026"
                value={russekull}
                onChange={(e) => setRussekull(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                ← Tilbake
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canNext2}
                className="flex-[2] py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "#7c3aed" }}
              >
                Neste steg →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Design */}
        {step === 3 && (
          <div className="fade-up space-y-4">
            <div>
              <label style={labelStyle}>Beskriv ønsket design</label>
              <textarea
                required
                rows={4}
                placeholder="Farger, stil, inspirasjon, navn som skal være med..."
                value={beskrivelse}
                onChange={(e) => setBeskrivelse(e.target.value)}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Bilder / inspirasjon{" "}
                <span style={{ color: "#334155", fontWeight: 400, textTransform: "none" }}>(valgfritt, maks 5)</span>
              </label>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                className="rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center py-8 px-4 text-center"
                style={{
                  border: `2px dashed ${dragging ? "#7c3aed" : "rgba(255,255,255,0.08)"}`,
                  background: dragging ? "rgba(124,58,237,0.08)" : "#13131f",
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(124,58,237,0.15)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">Dra og slipp bilder her</p>
                <p className="text-xs mt-1" style={{ color: "#475569" }}>
                  eller <span style={{ color: "#7c3aed" }}>klikk for å velge</span> — PNG, JPG, WEBP
                </p>
                <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>

              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((file, i) => (
                    <div key={i} className="relative">
                      <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                      <button type="button" onClick={() => removeFile(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "#ef4444" }}>×</button>
                    </div>
                  ))}
                  {files.length < 5 && (
                    <button type="button" onClick={() => inputRef.current?.click()} className="w-16 h-16 rounded-xl flex items-center justify-center text-lg transition-all" style={{ border: "2px dashed rgba(255,255,255,0.08)", color: "#475569" }}>+</button>
                  )}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="rounded-2xl p-4" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#475569" }}>Oppsummering</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#64748b" }}>Pakke</span>
                  <span className="font-bold" style={{ color: "#a78bfa" }}>
                    {packages.find((p) => p.id === pakke)?.name} — {packages.find((p) => p.id === pakke)?.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#64748b" }}>Navn</span>
                  <span className="text-white font-medium">{navn}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#64748b" }}>E-post</span>
                  <span className="text-white font-medium">{epost}</span>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                ← Tilbake
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !beskrivelse.trim()}
                className="flex-[2] py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "#7c3aed" }}
              >
                {loading ? "Sender..." : "Send bestilling →"}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
