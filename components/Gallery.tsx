"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type GalleryImage = { name: string; url: string };

const fallback = [
  { label: "Klassisk", category: "RUSSEKOFTE", accent: "#7c3aed", bg: "linear-gradient(135deg, #1a0a2e, #2d1a4e)" },
  { label: "Pink Vibes", category: "BUSS", accent: "#ec4899", bg: "linear-gradient(135deg, #1a0a1e, #3d1a2e)" },
  { label: "Minimalist", category: "BIL", accent: "#3b82f6", bg: "linear-gradient(135deg, #0a1a2e, #1a2a3e)" },
  { label: "Bold", category: "RUSSEKOFTE", accent: "#f59e0b", bg: "linear-gradient(135deg, #1a150a, #2e2a1a)" },
  { label: "Vintage", category: "BUSS", accent: "#10b981", bg: "linear-gradient(135deg, #0a1a10, #1a2e1a)" },
  { label: "Arctic", category: "BIL", accent: "#0ea5e9", bg: "linear-gradient(135deg, #0a1a2a, #1a2a3a)" },
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    supabase.storage.from("gallery").list("", { sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const imgs = data.map((f) => ({
          name: f.name,
          url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
        }));
        setImages(imgs);
      });
  }, []);

  return (
    <section id="galleri" className="py-24 px-4 sm:px-6" style={{ background: "#0a0a0f" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7c3aed" }}>Galleri</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">Tidligere design</h2>
            {images.length === 0 && (
              <p className="text-sm" style={{ color: "#475569" }}>Eksempel-design</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.length > 0
            ? images.map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ aspectRatio: "4/3" }}>
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                </div>
              ))
            : fallback.map((item, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: item.bg, aspectRatio: "4/3" }}>
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-xs font-black tracking-widest px-2 py-1 rounded"
                      style={{ background: "rgba(0,0,0,0.5)", color: "#94a3b8" }}>{item.category}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-white text-lg sm:text-2xl transition-all group-hover:scale-110"
                      style={{ background: item.accent }}>RD</div>
                  </div>
                  <div className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-end p-4"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
                    <p className="text-white font-black text-sm">{item.label}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
