"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef } from "react";

export default function OrderForm() {
  const router = useRouter();
  const { dark } = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append("navn", (form.elements.namedItem("navn") as HTMLInputElement).value);
    formData.append("epost", (form.elements.namedItem("epost") as HTMLInputElement).value);
    formData.append("pakke", (form.elements.namedItem("pakke") as HTMLSelectElement).value);
    formData.append("russekull", (form.elements.namedItem("russekull") as HTMLInputElement).value);
    formData.append("beskrivelse", (form.elements.namedItem("beskrivelse") as HTMLTextAreaElement).value);
    files.forEach((fil) => formData.append("bilder", fil));

    const res = await fetch("/api/orders", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Noe gikk galt, prøv igjen.");
      setLoading(false);
      return;
    }

    const navn = (form.elements.namedItem("navn") as HTMLInputElement).value;
    const pakke = (form.elements.namedItem("pakke") as HTMLSelectElement).value;
    setLoading(false);
    setSuccess(true);
    router.push(`/checkout?orderId=${data.orderId}&navn=${encodeURIComponent(navn)}&pakke=${encodeURIComponent(pakke)}`);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => f.type.startsWith("image/")).slice(0, 5);
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const inputStyle = {
    background: dark ? "#1a1a2e" : "#f9fafb",
    border: `1.5px solid ${dark ? "#2d2d4e" : "#ebebeb"}`,
    borderRadius: "12px",
    color: dark ? "#f1f5f9" : "#111827",
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  return (
    <section id="bestill" className="py-16 sm:py-24 px-4 sm:px-6 transition-all duration-300" style={{ background: dark ? "#0f0f13" : "#fff" }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>Bestilling</p>
          <h2 className="text-3xl sm:text-4xl font-black transition-colors" style={{ color: dark ? "#f1f5f9" : "#0f0f13" }}>
            Bestill din logo
          </h2>
          <p className="text-sm mt-3" style={{ color: dark ? "#64748b" : "#9ca3af" }}>
            50% depositum betales nå — resten ved levering
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: dark ? "#64748b" : "#6b7280" }}>Navn</label>
              <input name="navn" type="text" required placeholder="Ditt navn" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: dark ? "#64748b" : "#6b7280" }}>E-post</label>
              <input name="epost" type="email" required placeholder="din@epost.no" style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: dark ? "#64748b" : "#6b7280" }}>Pakke</label>
            <select name="pakke" id="pakke-select" required style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Velg pakke</option>
              <option value="standard">Standard — 2.990 kr</option>
              <option value="gull">Gull — 4.490 kr</option>
              <option value="vip">VIP — 6.990 kr</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: dark ? "#64748b" : "#6b7280" }}>Russekull / År</label>
            <input name="russekull" type="text" required placeholder="f.eks. Russ 2026" style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: dark ? "#64748b" : "#6b7280" }}>Beskriv ønsket design</label>
            <textarea name="beskrivelse" required rows={3} placeholder="Farger, stil, inspirasjon..." style={{ ...inputStyle, resize: "none" }} />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: dark ? "#64748b" : "#6b7280" }}>
              Bilder / inspirasjon <span style={{ color: dark ? "#4a5568" : "#9ca3af" }}>(valgfritt, maks 5)</span>
            </label>
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              className="rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center py-8 px-4 text-center"
              style={{
                border: `2px dashed ${dragging ? "#7c3aed" : dark ? "#2d2d4e" : "#d1d5db"}`,
                background: dragging
                  ? dark ? "#1e1040" : "#f5f3ff"
                  : dark ? "#1a1a2e" : "#f9fafb",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: dark ? "#2d2d4e" : "#ede9fe" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="text-sm font-semibold" style={{ color: dark ? "#e2e8f0" : "#374151" }}>
                Dra og slipp bilder her
              </p>
              <p className="text-xs mt-1" style={{ color: dark ? "#4a5568" : "#9ca3af" }}>
                eller <span style={{ color: "#7c3aed" }}>klikk for å velge</span> — PNG, JPG, WEBP
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Preview */}
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-xl"
                      style={{ border: `1.5px solid ${dark ? "#2d2d4e" : "#ebebeb"}` }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-black transition-all"
                      style={{ background: "#ef4444" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-lg transition-all"
                    style={{ border: `2px dashed ${dark ? "#2d2d4e" : "#d1d5db"}`, color: dark ? "#4a5568" : "#9ca3af" }}
                  >
                    +
                  </button>
                )}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-sm font-bold rounded-full transition-all hover:opacity-80 active:scale-[0.99] cursor-pointer disabled:opacity-60"
            style={{ background: "#7c3aed", color: "#fff" }}
          >
            {loading ? "Sender..." : "Gå til betaling →"}
          </button>
        </form>
      </div>
    </section>
  );
}
