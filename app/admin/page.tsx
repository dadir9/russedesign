"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type Order = {
  id: string;
  created_at: string;
  navn: string;
  epost: string;
  pakke: string;
  russekull: string;
  beskrivelse: string;
  bilder: string[];
  status: string;
};

type GalleryImage = { name: string; url: string };
type SiteContent = Record<string, string>;

const statuses = ["ny", "under arbeid", "levert", "avbrutt"];
const statusColors: Record<string, string> = {
  ny: "#f59e0b",
  "under arbeid": "#3b82f6",
  levert: "#10b981",
  avbrutt: "#ef4444",
};
const packagePrices: Record<string, number> = { standard: 2990, gull: 4490, vip: 6990 };
const packageNames: Record<string, string> = { standard: "Standard", gull: "Gull", vip: "VIP" };

const defaultContent: SiteContent = {
  hero_tag: "Norges beste russedesign",
  hero_title_1: "Vi lager din,",
  hero_title_2: "unike",
  hero_title_3: "russelogo.",
  hero_description: "Profesjonelt logodesign til russekofter, biler og busser. Rask levering, ubegrenset revisjoner.",
  hero_cta: "Bestill logo nå",
  standard_desc: "Enkelt og stilrent design for deg som vil ha noe pent uten alt det ekstra.",
  gull_desc: "Mest valgte pakken. Full kreativ frihet og rask levering.",
  vip_desc: "Det aller beste — ubegrenset alt og raskest levering.",
};

// ── Styles ──
const card = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px" };
const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const inputStyle = { background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"bestillinger" | "galleri" | "innhold">("bestillinger");

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("alle");

  // Gallery
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Content
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);

  const fetchOrders = useCallback(async (pw: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-password": pw } });
    if (!res.ok) { setError("Feil passord"); setAuthed(false); setLoading(false); return; }
    setOrders(await res.json());
    setAuthed(true);
    setLoading(false);
  }, []);

  const fetchGallery = useCallback(async (pw: string) => {
    setGalleryLoading(true);
    const res = await fetch("/api/admin/gallery", { headers: { "x-admin-password": pw } });
    if (res.ok) setGallery(await res.json());
    setGalleryLoading(false);
  }, []);

  const fetchContent = useCallback(async (pw: string) => {
    const res = await fetch("/api/admin/content", { headers: { "x-admin-password": pw } });
    if (res.ok) {
      const data = await res.json();
      setContent({ ...defaultContent, ...data });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await fetchOrders(password);
  };

  useEffect(() => {
    if (authed) {
      fetchGallery(password);
      fetchContent(password);
    }
  }, [authed, password, fetchGallery, fetchContent]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      if (res.ok) {
        const img = await res.json();
        setGallery((prev) => [img, ...prev]);
      }
    }
    setUploading(false);
  };

  const deleteImage = async (name: string) => {
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ name }),
    });
    setGallery((prev) => prev.filter((g) => g.name !== name));
  };

  const saveContent = async () => {
    setContentSaving(true);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(content),
    });
    setContentSaving(false);
    setContentSaved(true);
    setTimeout(() => setContentSaved(false), 2000);
  };

  // Stats
  const totalOmsetning = orders.filter((o) => o.status !== "avbrutt").reduce((s, o) => s + (packagePrices[o.pakke] ?? 0), 0);
  const thisWeek = orders.filter((o) => (Date.now() - new Date(o.created_at).getTime()) / 86400000 <= 7);
  const filtered = filterStatus === "alle" ? orders : orders.filter((o) => o.status === filterStatus);

  // ── Login ──
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f1f5f9" }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#7c3aed" }}>
              <span className="text-white text-xl font-black">R</span>
            </div>
            <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Admin</h1>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>RusseDesign kontrollpanel</p>
          </div>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord" required
            className={inputCls}
            style={{ ...inputStyle, marginBottom: "12px" }}
          />
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white" style={{ background: "#7c3aed" }}>
            Logg inn
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f1f5f9" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "#0f172a" }}>Kontrollpanel</h1>
            <p className="text-sm mt-0.5" style={{ color: "#94a3b8" }}>RusseDesign admin</p>
          </div>
          <button onClick={() => fetchOrders(password)} className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: "#ede9fe", color: "#7c3aed" }}>
            Oppdater
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { val: orders.length, label: "Bestillinger", color: "#0f172a" },
            { val: thisWeek.length, label: "Denne uken", color: "#7c3aed" },
            { val: orders.filter((o) => o.status === "levert").length, label: "Levert", color: "#10b981" },
            { val: `${totalOmsetning.toLocaleString("no")} kr`, label: "Total verdi", color: "#0f172a" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-5" style={card}>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.val}</p>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl w-fit" style={{ background: "#e2e8f0" }}>
          {(["bestillinger", "galleri", "innhold"] as const).map((t) => (
            <button
              key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all"
              style={{
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#7c3aed" : "#94a3b8",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t === "bestillinger" ? "Bestillinger" : t === "galleri" ? "Galleri" : "Innhold"}
            </button>
          ))}
        </div>

        {/* ── BESTILLINGER ── */}
        {tab === "bestillinger" && (
          <div>
            {/* Package stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {["standard", "gull", "vip"].map((p) => (
                <div key={p} className="rounded-2xl p-4 flex items-center justify-between" style={card}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#0f172a" }}>{packageNames[p]}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{packagePrices[p].toLocaleString("no")} kr</p>
                  </div>
                  <p className="text-2xl font-black" style={{ color: "#7c3aed" }}>
                    {orders.filter((o) => o.pakke === p && o.status !== "avbrutt").length}
                  </p>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {["alle", ...statuses].map((s) => {
                const count = s === "alle" ? orders.length : orders.filter((o) => o.status === s).length;
                return (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className="text-xs font-bold px-4 py-2 rounded-full capitalize transition-all"
                    style={{
                      background: filterStatus === s ? (s === "alle" ? "#7c3aed" : statusColors[s]) : "#e2e8f0",
                      color: filterStatus === s ? "#fff" : "#64748b",
                    }}>
                    {s} ({count})
                  </button>
                );
              })}
            </div>

            {loading ? <p className="text-center py-12" style={{ color: "#94a3b8" }}>Laster...</p> : (
              <div className="space-y-2">
                {filtered.map((order) => (
                  <div key={order.id} onClick={() => setSelected(selected?.id === order.id ? null : order)}
                    className="rounded-2xl p-4 cursor-pointer transition-all"
                    style={{ ...card, border: `1.5px solid ${selected?.id === order.id ? "#7c3aed" : "#e2e8f0"}` }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: statusColors[order.status] ?? "#94a3b8" }} />
                        <div className="min-w-0">
                          <p className="font-bold truncate" style={{ color: "#0f172a" }}>{order.navn}</p>
                          <p className="text-xs truncate" style={{ color: "#94a3b8" }}>{order.epost} · {order.russekull}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                          {packageNames[order.pakke] ?? order.pakke}
                        </span>
                        <span className="text-xs" style={{ color: "#94a3b8" }}>
                          {new Date(order.created_at).toLocaleDateString("no")}
                        </span>
                      </div>
                    </div>

                    {selected?.id === order.id && (
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: "#e2e8f0" }}>
                        <p className="text-sm mb-4" style={{ color: "#475569" }}>{order.beskrivelse}</p>
                        {order.bilder?.length > 0 && (
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {order.bilder.map((url, i) => (
                              <a key={i} href={url} target="_blank" rel="noreferrer">
                                <img src={url} alt="Bilde" className="w-16 h-16 object-cover rounded-xl" style={{ border: "1px solid #e2e8f0" }} />
                              </a>
                            ))}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: "#94a3b8" }}>Endre status</p>
                          <div className="flex flex-wrap gap-2">
                            {statuses.map((s) => (
                              <button key={s} onClick={(e) => { e.stopPropagation(); updateStatus(order.id, s); }}
                                className="text-xs px-3 py-1.5 rounded-full font-semibold capitalize transition-all"
                                style={{
                                  background: order.status === s ? statusColors[s] : "#f1f5f9",
                                  color: order.status === s ? "#fff" : "#64748b",
                                  border: `1px solid ${order.status === s ? statusColors[s] : "#e2e8f0"}`,
                                }}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && <p className="text-center py-12 text-sm" style={{ color: "#94a3b8" }}>Ingen bestillinger her.</p>}
              </div>
            )}
          </div>
        )}

        {/* ── GALLERI ── */}
        {tab === "galleri" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-black" style={{ color: "#0f172a" }}>Galleri</h2>
                <p className="text-sm" style={{ color: "#94a3b8" }}>Bildene vises på forsiden under «Tidligere design»</p>
              </div>
              <button onClick={() => galleryRef.current?.click()}
                className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: "#7c3aed" }}>
                + Last opp
              </button>
              <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => uploadImages(e.target.files)} />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadImages(e.dataTransfer.files); }}
              onClick={() => galleryRef.current?.click()}
              className="rounded-2xl p-8 text-center cursor-pointer transition-all mb-6"
              style={{
                border: `2px dashed ${dragOver ? "#7c3aed" : "#cbd5e1"}`,
                background: dragOver ? "#ede9fe" : "#f8fafc",
              }}
            >
              {uploading ? (
                <p className="text-sm font-semibold" style={{ color: "#7c3aed" }}>Laster opp...</p>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "#ede9fe" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#475569" }}>Dra bilder hit eller klikk for å velge</p>
                  <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>PNG, JPG, WEBP</p>
                </>
              )}
            </div>

            {galleryLoading ? (
              <p className="text-center py-8" style={{ color: "#94a3b8" }}>Laster galleri...</p>
            ) : gallery.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: "#94a3b8" }}>Ingen bilder ennå. Last opp dine første bilder!</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {gallery.map((img) => (
                  <div key={img.name} className="relative group rounded-2xl overflow-hidden" style={{ aspectRatio: "1" }}>
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: "rgba(0,0,0,0.5)" }}>
                      <button
                        onClick={() => deleteImage(img.name)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:scale-105"
                        style={{ background: "#ef4444" }}>
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INNHOLD ── */}
        {tab === "innhold" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black" style={{ color: "#0f172a" }}>Rediger innhold</h2>
                <p className="text-sm" style={{ color: "#94a3b8" }}>Endringer vises på nettsiden</p>
              </div>
              <button onClick={saveContent} disabled={contentSaving}
                className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: contentSaved ? "#10b981" : "#7c3aed" }}>
                {contentSaved ? "✓ Lagret!" : contentSaving ? "Lagrer..." : "Lagre endringer"}
              </button>
            </div>

            {/* Hero */}
            <div className="rounded-2xl p-6" style={card}>
              <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#7c3aed" }}>Hero-seksjon</p>
              <div className="space-y-3">
                {[
                  { key: "hero_tag", label: "Toppetikkett" },
                  { key: "hero_title_1", label: "Overskrift linje 1" },
                  { key: "hero_title_2", label: "Overskrift linje 2 (uthevet)" },
                  { key: "hero_title_3", label: "Overskrift linje 3" },
                  { key: "hero_description", label: "Beskrivelse" },
                  { key: "hero_cta", label: "Knapp-tekst" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>{label}</label>
                    <input
                      type="text" value={content[key] || ""} onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                      className={inputCls} style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Packages */}
            <div className="rounded-2xl p-6" style={card}>
              <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#7c3aed" }}>Pakke-beskrivelser</p>
              <div className="space-y-3">
                {[
                  { key: "standard_desc", label: "Standard — beskrivelse" },
                  { key: "gull_desc", label: "Gull — beskrivelse" },
                  { key: "vip_desc", label: "VIP — beskrivelse" },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#64748b" }}>{label}</label>
                    <textarea
                      value={content[key] || ""} onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                      rows={2} className={inputCls} style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
