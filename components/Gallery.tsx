"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type GalleryImage = { name: string; url: string };

const fallback = [
  { label: "Klassisk", category: "Russekofte", accent: "#7c3aed", bg: "linear-gradient(135deg, #ede9fe, #ddd6fe)" },
  { label: "Pink Vibes", category: "Buss", accent: "#ec4899", bg: "linear-gradient(135deg, #fce7f3, #fbcfe8)" },
  { label: "Minimalist", category: "Bil", accent: "#3b82f6", bg: "linear-gradient(135deg, #dbeafe, #bfdbfe)" },
  { label: "Bold", category: "Russekofte", accent: "#f59e0b", bg: "linear-gradient(135deg, #fef3c7, #fde68a)" },
  { label: "Vintage", category: "Buss", accent: "#10b981", bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)" },
  { label: "Arctic", category: "Bil", accent: "#0ea5e9", bg: "linear-gradient(135deg, #e0f2fe, #bae6fd)" },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    supabase.storage.from("gallery").list("", { sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        setImages(data.map((f) => ({
          name: f.name,
          url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
        })));
      });
  }, []);

  return (
    <section id="galleri" style={{ background: "#ffffff", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Galleri</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>
              Tidligere design
            </h2>
          </div>
          <a href="/bestill" style={{ fontSize: 14, fontWeight: 700, color: "#7c3aed", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Bestill ditt design
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="gallery-grid">
          {(images.length > 0 ? images : fallback).map((item, i) => {
            if ("url" in item) {
              return (
                <div key={i} style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", border: "1px solid #e5e7eb", position: "relative" }}
                  className="gallery-item">
                  <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} />
                </div>
              );
            }
            const f = item as typeof fallback[0];
            return (
              <div key={i} style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", background: f.bg, border: "1px solid #e5e7eb", position: "relative", cursor: "pointer" }}
                className="gallery-item">
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.8)", color: "#6b7280", padding: "3px 10px", borderRadius: 99, letterSpacing: "0.05em" }}>
                    {f.category}
                  </span>
                </div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: f.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}>
                    <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>RD</span>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{f.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
