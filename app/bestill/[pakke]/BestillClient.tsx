"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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
  padding: "13px 16px",
  fontSize: "15px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  color: "#475569",
  fontSize: "11px",
  fontWeight: 700,
  display: "block",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export default function BestillClient({ pakke, data }: { pakke: string; data: PackageData }) {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Noe gikk galt, prøv igjen.");
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push("/bestilling-bekreftet");
  };

  return (
    <div className="pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs mb-8" style={{ color: "#334155" }}>
          <a href="/" className="hover:text-white transition-colors">Hjem</a>
          <span>/</span>
          <a href="/#pakker" className="hover:text-white transition-colors">Pakker</a>
          <span>/</span>
          <span style={{ color: "#94a3b8" }}>{data.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── Left: Package details ── */}
          <div className="lg:sticky lg:top-24">
            {data.badge && (
              <span
                className="inline-block text-xs font-black px-3 py-1 rounded-full mb-4"
                style={{ background: `${data.color}22`, color: data.color, border: `1px solid ${data.color}44` }}
              >
                {data.badge}
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
              {data.name} <span style={{ color: data.color }}>pakke</span>
            </h1>

            <p className="text-base leading-relaxed mb-8" style={{ color: "#64748b" }}>
              {data.description}
            </p>

            {/* Price box */}
            <div
              className="rounded-2xl p-6 mb-8"
              style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl font-black text-white">{data.price.toLocaleString("no")} kr</span>
              </div>
              <p className="text-sm mb-5" style={{ color: "#475569" }}>
                Depositum ved bestilling: <strong style={{ color: "#94a3b8" }}>{data.deposit.toLocaleString("no")} kr</strong> — resten ved levering
              </p>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#10b981" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Levering innen {data.delivery}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#475569" }}>Inkludert i pakken</p>
              <ul className="space-y-3">
                {data.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "#94a3b8" }}>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                      style={{ background: `${data.color}22`, color: data.color }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-8">
              {["Trygg betaling", "Fornøyd-garanti", "Rask support"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs" style={{ color: "#334155" }}>
                  <span style={{ color: "#7c3aed" }}>✦</span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Order form ── */}
          <div
            className="rounded-3xl p-6 sm:p-8"
            style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h2 className="text-xl font-black text-white mb-6">Fyll ut bestillingen</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Navn</label>
                  <input
                    type="text" required placeholder="Ditt navn"
                    value={navn} onChange={(e) => setNavn(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>E-post</label>
                  <input
                    type="email" required placeholder="din@epost.no"
                    value={epost} onChange={(e) => setEpost(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Russekull / År</label>
                <input
                  type="text" required placeholder="f.eks. Russ 2026"
                  value={russekull} onChange={(e) => setRussekull(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Beskriv ønsket design</label>
                <textarea
                  required rows={4}
                  placeholder="Farger, stil, navn som skal være med, inspirasjon..."
                  value={beskrivelse} onChange={(e) => setBeskrivelse(e.target.value)}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              {/* Image upload */}
              <div>
                <label style={labelStyle}>
                  Bilder / inspirasjon{" "}
                  <span style={{ color: "#334155", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                    (valgfritt, maks 5)
                  </span>
                </label>
                <div
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                  className="rounded-xl cursor-pointer flex flex-col items-center justify-center py-7 px-4 text-center transition-all"
                  style={{
                    border: `2px dashed ${dragging ? "#7c3aed" : "rgba(255,255,255,0.07)"}`,
                    background: dragging ? "rgba(124,58,237,0.06)" : "#13131f",
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(124,58,237,0.12)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white">Dra og slipp bilder her</p>
                  <p className="text-xs mt-1" style={{ color: "#475569" }}>
                    eller <span style={{ color: "#7c3aed" }}>klikk for å velge</span>
                  </p>
                  <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                </div>

                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {files.map((file, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-14 h-14 object-cover rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                        <button type="button" onClick={() => removeFile(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ background: "#ef4444" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                style={{ background: "#7c3aed", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}
              >
                {loading ? "Sender bestilling..." : `Bestill ${data.name} — ${data.price.toLocaleString("no")} kr →`}
              </button>

              <p className="text-xs text-center" style={{ color: "#334155" }}>
                Du betaler kun {data.deposit.toLocaleString("no")} kr nå — resten når logoen er klar
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
