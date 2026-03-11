"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type Order = {
  id: string; created_at: string; navn: string; epost: string;
  pakke: string; russekull: string; beskrivelse: string; bilder: string[]; status: string;
};
type GalleryImage = { name: string; url: string };
type SiteContent = Record<string, string>;

const statuses = ["ny", "under arbeid", "levert", "avbrutt", "refundert"];
const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  ny:            { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
  "under arbeid":{ bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
  levert:        { bg: "#dcfce7", text: "#15803d", dot: "#10b981" },
  avbrutt:       { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
  refundert:     { bg: "#f3e8ff", text: "#7c3aed", dot: "#a855f7" },
};
const packagePrices: Record<string, number> = { standard: 2990, gull: 4490, vip: 6990 };
const packageNames: Record<string, string> = { standard: "Standard", gull: "Gull", vip: "VIP" };
const defaultContent: SiteContent = {
  hero_tag: "Norges beste russedesign", hero_title_1: "Vi lager din,",
  hero_title_2: "unike", hero_title_3: "russelogo.",
  hero_description: "Profesjonelt logodesign til russekofter, biler og busser. Rask levering, ubegrenset revisjoner.",
  hero_cta: "Bestill logo nå",
  standard_desc: "Enkelt og stilrent design for deg som vil ha noe pent uten alt det ekstra.",
  gull_desc: "Mest valgte pakken. Full kreativ frihet og rask levering.",
  vip_desc: "Det aller beste — ubegrenset alt og raskest levering.",
};

function Avatar({ name }: { name: string }) {
  const initials = name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const colors = ["#7c3aed","#0891b2","#059669","#dc2626","#d97706","#2563eb"];
  const bg = colors[name?.charCodeAt(0) % colors.length] || "#7c3aed";
  return (
    <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0 }}>
      <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{initials}</span>
    </div>
  );
}

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { key: "bestillinger", label: "Bestillinger", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { key: "galleri", label: "Galleri", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { key: "innhold", label: "Innhold", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionDropdown, setActionDropdown] = useState<string | null>(null);
  const [orderPage, setOrderPage] = useState(1);
  const PAGE_SIZE = 10;
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSaved, setContentSaved] = useState(false);

  const fetchOrders = useCallback(async (pw: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-password": pw } });
    if (!res.ok) { setError("Feil passord"); setAuthed(false); setLoading(false); return; }
    setOrders(await res.json());
    setAuthed(true); setLoading(false);
  }, []);

  const fetchGallery = useCallback(async (pw: string) => {
    setGalleryLoading(true);
    const res = await fetch("/api/admin/gallery", { headers: { "x-admin-password": pw } });
    if (res.ok) setGallery(await res.json());
    setGalleryLoading(false);
  }, []);

  const fetchContent = useCallback(async (pw: string) => {
    const res = await fetch("/api/admin/content", { headers: { "x-admin-password": pw } });
    if (res.ok) { const data = await res.json(); setContent({ ...defaultContent, ...data }); }
  }, []);

  const handleLogin = async (e: React.FormEvent) => { e.preventDefault(); setError(""); await fetchOrders(password); };

  useEffect(() => {
    if (authed) { fetchGallery(password); fetchContent(password); }
  }, [authed, password, fetchGallery, fetchContent]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const cancelOrder = async (id: string) => {
    if (!confirm("Er du sikker på at du vil avslutte denne bestillingen?")) return;
    await updateStatus(id, "avbrutt");
  };

  const refundOrder = async (order: Order) => {
    if (!confirm(`Refunder ${order.navn} (${packageNames[order.pakke] ?? order.pakke})?\n\nKunden vil motta en e-post med refusjonsbekreftelse.`)) return;
    const res = await fetch("/api/admin/orders/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ orderId: order.id }),
    });
    const json = await res.json();
    if (!res.ok) { alert(json.error || "Noe gikk galt"); return; }
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: "refundert" } : o));
    if (selected?.id === order.id) setSelected(prev => prev ? { ...prev, status: "refundert" } : null);
    alert("Refusjon fullført! Kunden er varslet på e-post.");
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files) return; setUploading(true);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/gallery", { method: "POST", headers: { "x-admin-password": password }, body: fd });
      if (res.ok) { const img = await res.json(); setGallery(prev => [img, ...prev]); }
    }
    setUploading(false);
  };

  const deleteImage = async (name: string) => {
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ name }) });
    setGallery(prev => prev.filter(g => g.name !== name));
  };

  const saveContent = async () => {
    setContentSaving(true);
    await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(content) });
    setContentSaving(false); setContentSaved(true); setTimeout(() => setContentSaved(false), 2000);
  };

  // Stats
  const totalRevenue = orders.filter(o => o.status !== "avbrutt").reduce((s, o) => s + (packagePrices[o.pakke] ?? 0), 0);
  const thisWeek = orders.filter(o => (Date.now() - new Date(o.created_at).getTime()) / 86400000 <= 7);
  const delivered = orders.filter(o => o.status === "levert");
  const inProgress = orders.filter(o => o.status === "under arbeid");
  const recentOrders =[...orders].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

  // Monthly data (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const label = d.toLocaleString("no", { month: "short" });
    const count = orders.filter(o => { const od = new Date(o.created_at); return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear(); }).length;
    return { label, count };
  });
  const maxCount = Math.max(...months.map(m => m.count), 1);

  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: 360, padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>R</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: 0 }}>Admin</h1>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>RusseDesign kontrollpanel</p>
        </div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passord" required
          style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
        {error && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginBottom: 10 }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#7c3aed", color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}>
          Logg inn
        </button>
      </form>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "inherit" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 240, flexShrink: 0, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>R</span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", margin: 0 }}>RusseDesign</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Admin panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: 1, padding: "8px 10px 4px" }}>Meny</p>
          {navItems.map(item => {
            const active = tab === item.key;
            return (
              <button key={item.key} onClick={() => setTab(item.key)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, transition: "all 0.15s",
                  background: active ? "#ede9fe" : "transparent", color: active ? "#7c3aed" : "#64748b", fontWeight: active ? 700 : 500, fontSize: 14 }}>
                <span style={{ color: active ? "#7c3aed" : "#94a3b8" }}>{item.icon}</span>
                {item.label}
                {item.key === "bestillinger" && orders.filter(o => o.status === "ny").length > 0 && (
                  <span style={{ marginLeft: "auto", background: "#7c3aed", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "1px 7px" }}>
                    {orders.filter(o => o.status === "ny").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => fetchOrders(password)}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: "#64748b", fontWeight: 500, fontSize: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Oppdater
          </button>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, color: "#64748b", fontWeight: 500, fontSize: 14, textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Forsiden
          </a>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>

          {/* ── DASHBOARD ── */}
          {tab === "dashboard" && (
            <>
              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: 0 }}>Velkommen tilbake 👋</h1>
                <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Her er en oversikt over virksomheten din i dag.</p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total inntekt", val: `${totalRevenue.toLocaleString("no")} kr`, sub: `${orders.length} bestillinger`, color: "#7c3aed", bg: "#ede9fe",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
                  { label: "Nye bestillinger", val: orders.filter(o => o.status === "ny").length, sub: "Venter på behandling", color: "#d97706", bg: "#fef3c7",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                  { label: "Under arbeid", val: inProgress.length, sub: "Aktive prosjekter", color: "#2563eb", bg: "#dbeafe",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg> },
                  { label: "Levert", val: delivered.length, sub: "Fullførte oppdrag", color: "#15803d", bg: "#dcfce7",
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#64748b", margin: 0 }}>{s.label}</p>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>{s.icon}</div>
                    </div>
                    <p style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: 0 }}>{s.val}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Chart + Packages */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 24 }}>
                {/* Bar chart */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px" }}>
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", margin: 0 }}>Bestillinger per måned</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Siste 6 måneder</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                    {months.map((m, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed" }}>{m.count > 0 ? m.count : ""}</span>
                        <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: m.count > 0 ? "#7c3aed" : "#e2e8f0", height: `${Math.max((m.count / maxCount) * 100, 8)}px`, transition: "height 0.3s" }} />
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package breakdown */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px" }}>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", margin: "0 0 4px" }}>Pakkefordeling</p>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 20px" }}>Aktive bestillinger</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { name: "VIP", key: "vip", color: "#7c3aed", price: 6990 },
                      { name: "Gull", key: "gull", color: "#d97706", price: 4490 },
                      { name: "Standard", key: "standard", color: "#2563eb", price: 2990 },
                    ].map(pkg => {
                      const count = orders.filter(o => o.pakke === pkg.key && o.status !== "avbrutt").length;
                      const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                      return (
                        <div key={pkg.key}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{pkg.name}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: pkg.color }}>{count} stk</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 99, background: "#f1f5f9" }}>
                            <div style={{ height: 6, borderRadius: 99, background: pkg.color, width: `${pct}%`, transition: "width 0.4s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", margin: 0 }}>Siste bestillinger</p>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Nyeste transaksjoner</p>
                  </div>
                  <button onClick={() => setTab("bestillinger")} style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", background: "none", border: "none", cursor: "pointer" }}>Se alle →</button>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Kunde", "Pakke", "Russekull", "Status", "Beløp", "Dato"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Laster...</td></tr>
                    ) : recentOrders.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Ingen bestillinger ennå.</td></tr>
                    ) : recentOrders.map((o, i) => {
                      const sc = statusColors[o.status] ?? { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" };
                      return (
                        <tr key={o.id} style={{ borderTop: "1px solid #f1f5f9", transition: "background 0.1s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <Avatar name={o.navn} />
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>{o.navn}</p>
                                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{o.epost}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ fontSize: 12, fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "3px 10px", borderRadius: 20 }}>{packageNames[o.pakke] ?? o.pakke}</span>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{o.russekull || "—"}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text, padding: "3px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{(packagePrices[o.pakke] ?? 0).toLocaleString("no")} kr</td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: "#94a3b8" }}>{new Date(o.created_at).toLocaleDateString("no", { day: "numeric", month: "short" })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── BESTILLINGER ── */}
          {tab === "bestillinger" && (() => {
            const searched = orders.filter(o =>
              o.navn.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.epost.toLowerCase().includes(searchQuery.toLowerCase()) ||
              o.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const filteredOrders = filterStatus === "alle" ? searched : searched.filter(o => o.status === filterStatus);
            const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
            const paginated = filteredOrders.slice((orderPage - 1) * PAGE_SIZE, orderPage * PAGE_SIZE);
            const shortId = (id: string) => "ORD-" + id.slice(0, 6).toUpperCase();
            return (
              <div onClick={() => setActionDropdown(null)}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 }}>Bestillinger</h1>
                    <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Administrer og følg opp alle kundebestillinger.</p>
                  </div>
                  <button onClick={() => fetchOrders(password)}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                    Oppdater
                  </button>
                </div>

                {/* Filter tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 0, gap: 0 }}>
                  {["alle", ...statuses].map(s => {
                    const count = s === "alle" ? orders.length : orders.filter(o => o.status === s).length;
                    const active = filterStatus === s;
                    return (
                      <button key={s} onClick={() => { setFilterStatus(s); setOrderPage(1); }}
                        style={{ padding: "10px 18px", border: "none", borderBottom: active ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer",
                          fontSize: 13, fontWeight: active ? 700 : 500, background: "transparent",
                          color: active ? "#7c3aed" : "#64748b", marginBottom: -1, transition: "all 0.15s" }}>
                        {s === "alle" ? "Alle" : s.charAt(0).toUpperCase() + s.slice(1)}
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, background: active ? "#ede9fe" : "#f1f5f9", color: active ? "#7c3aed" : "#94a3b8", borderRadius: 99, padding: "1px 7px" }}>{count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Table card */}
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "0 0 16px 16px", overflow: "visible" }}>
                  {/* Search bar */}
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setOrderPage(1); }}
                        placeholder="Søk på navn, e-post eller ordre-ID..."
                        style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", color: "#0f172a", background: "#f8fafc", boxSizing: "border-box" }} />
                    </div>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>Viser {filteredOrders.length} bestillinger</span>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          {["Ordre-ID", "Kunde", "Pakke", "Status", "Dato", "Beløp", ""].map(h => (
                            <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>Laster...</td></tr>
                        ) : paginated.length === 0 ? (
                          <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Ingen bestillinger funnet.</td></tr>
                        ) : paginated.map(o => {
                          const sc = statusColors[o.status] ?? { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" };
                          const isOpen = actionDropdown === o.id;
                          return (
                            <>
                              <tr key={o.id} style={{ borderTop: "1px solid #f1f5f9" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "#7c3aed", fontFamily: "monospace" }}>
                                  {shortId(o.id)}
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Avatar name={o.navn} />
                                    <div>
                                      <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{o.navn}</p>
                                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{o.epost}</p>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "3px 10px", borderRadius: 20 }}>{packageNames[o.pakke] ?? o.pakke}</span>
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text, padding: "3px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />{o.status}
                                  </span>
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b", whiteSpace: "nowrap" }}>
                                  {new Date(o.created_at).toLocaleDateString("no", { day: "numeric", month: "short", year: "numeric" })}
                                </td>
                                <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                                  {(packagePrices[o.pakke] ?? 0).toLocaleString("no")} kr
                                </td>
                                <td style={{ padding: "14px 16px", position: "relative" }}>
                                  <button onClick={e => { e.stopPropagation(); setActionDropdown(isOpen ? null : o.id); setSelected(isOpen ? null : o); }}
                                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                                    Handlinger
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                                  </button>
                                  {isOpen && (
                                    <div onClick={e => e.stopPropagation()}
                                      style={{ position: "absolute", right: 16, top: "100%", zIndex: 50, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 220, overflow: "hidden" }}>
                                      <div style={{ padding: "8px 0" }}>
                                        <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, padding: "4px 14px 6px" }}>Endre status</p>
                                        {statuses.map(s => {
                                          const sc2 = statusColors[s];
                                          const isActive = o.status === s;
                                          return (
                                            <button key={s} onClick={() => { updateStatus(o.id, s); setActionDropdown(null); }}
                                              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", border: "none", background: isActive ? "#f5f3ff" : "transparent", cursor: "pointer", fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#7c3aed" : "#374151", textAlign: "left" }}>
                                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: sc2.dot, flexShrink: 0 }} />
                                              {s.charAt(0).toUpperCase() + s.slice(1)}
                                              {isActive && <span style={{ marginLeft: "auto", fontSize: 11, color: "#7c3aed" }}>✓</span>}
                                            </button>
                                          );
                                        })}
                                        <div style={{ height: 1, background: "#f1f5f9", margin: "6px 0" }} />
                                        {o.beskrivelse && (
                                          <button onClick={() => { setSelected(selected?.id === o.id ? null : o); setActionDropdown(null); }}
                                            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#374151", textAlign: "left" }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            Se detaljer
                                          </button>
                                        )}
                                        {o.status !== "avbrutt" && o.status !== "refundert" && (
                                          <>
                                            <button onClick={() => { cancelOrder(o.id); setActionDropdown(null); }}
                                              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#dc2626", textAlign: "left", fontWeight: 600 }}>
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                              Avslutt bestilling
                                            </button>
                                            <button onClick={() => { refundOrder(o); setActionDropdown(null); }}
                                              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, color: "#7c3aed", textAlign: "left", fontWeight: 600 }}>
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                                              Refunder kunde
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                              {/* Detail expand row */}
                              {selected?.id === o.id && !isOpen && (
                                <tr key={`${o.id}-detail`} style={{ background: "#faf5ff", borderTop: "1px solid #ede9fe" }}>
                                  <td colSpan={7} style={{ padding: "20px 24px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                      <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Russekull</p>
                                        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 16px" }}>{o.russekull || "—"}</p>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Ønsket design</p>
                                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>{o.beskrivelse || "Ingen beskrivelse"}</p>
                                        {o.bilder?.length > 0 && (
                                          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                                            {o.bilder.map((url, i) => (
                                              <a key={i} href={url} target="_blank" rel="noreferrer">
                                                <img src={url} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }} />
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Kontaktinfo</p>
                                        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 4px" }}>{o.navn}</p>
                                        <a href={`mailto:${o.epost}`} style={{ fontSize: 14, color: "#7c3aed", textDecoration: "none" }}>{o.epost}</a>
                                        <button onClick={() => setSelected(null)}
                                          style={{ display: "block", marginTop: 20, fontSize: 12, fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                                          Lukk detaljer ↑
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ padding: "14px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>
                      Viser {filteredOrders.length === 0 ? 0 : (orderPage - 1) * PAGE_SIZE + 1}–{Math.min(orderPage * PAGE_SIZE, filteredOrders.length)} av {filteredOrders.length} resultater
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setOrderPage(p => Math.max(1, p - 1))} disabled={orderPage === 1}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: orderPage === 1 ? "#cbd5e1" : "#374151", cursor: orderPage === 1 ? "default" : "pointer" }}>
                        ← Forrige
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setOrderPage(p)}
                          style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            background: orderPage === p ? "#7c3aed" : "#fff", color: orderPage === p ? "#fff" : "#374151" }}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setOrderPage(p => Math.min(totalPages, p + 1))} disabled={orderPage === totalPages}
                        style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13, fontWeight: 600, color: orderPage === totalPages ? "#cbd5e1" : "#374151", cursor: orderPage === totalPages ? "default" : "pointer" }}>
                        Neste →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── GALLERI ── */}
          {tab === "galleri" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 }}>Galleri</h1>
                  <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Bildene vises på forsiden</p>
                </div>
                <button onClick={() => galleryRef.current?.click()}
                  style={{ padding: "10px 20px", borderRadius: 12, background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                  + Last opp bilder
                </button>
                <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => uploadImages(e.target.files)} />
              </div>

              <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); uploadImages(e.dataTransfer.files); }}
                onClick={() => galleryRef.current?.click()}
                style={{ border: `2px dashed ${dragOver ? "#7c3aed" : "#cbd5e1"}`, borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer", marginBottom: 24,
                  background: dragOver ? "#faf5ff" : "#fff", transition: "all 0.2s" }}>
                {uploading ? (
                  <p style={{ color: "#7c3aed", fontWeight: 600, fontSize: 14 }}>Laster opp...</p>
                ) : (
                  <>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <p style={{ fontWeight: 600, color: "#374151", fontSize: 14, margin: 0 }}>Dra bilder hit eller klikk for å velge</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>PNG, JPG, WEBP — maks 10MB</p>
                  </>
                )}
              </div>

              {galleryLoading ? <p style={{ textAlign: "center", color: "#94a3b8" }}>Laster...</p> : gallery.length === 0 ? (
                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 14, padding: 32 }}>Ingen bilder ennå.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                  {gallery.map(img => (
                    <div key={img.name} style={{ position: "relative", borderRadius: 14, overflow: "hidden", aspectRatio: "1", border: "1px solid #e2e8f0" }}
                      onMouseEnter={e => { (e.currentTarget.querySelector(".del-btn") as HTMLElement)!.style.opacity = "1"; }}
                      onMouseLeave={e => { (e.currentTarget.querySelector(".del-btn") as HTMLElement)!.style.opacity = "0"; }}>
                      <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div className="del-btn" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}>
                        <button onClick={() => deleteImage(img.name)} style={{ padding: "7px 16px", borderRadius: 99, background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer" }}>
                          Slett
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── INNHOLD ── */}
          {tab === "innhold" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: 0 }}>Rediger innhold</h1>
                  <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Endringer vises på nettsiden</p>
                </div>
                <button onClick={saveContent} disabled={contentSaving}
                  style={{ padding: "10px 22px", borderRadius: 12, background: contentSaved ? "#10b981" : "#7c3aed", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", opacity: contentSaving ? 0.6 : 1 }}>
                  {contentSaved ? "✓ Lagret!" : contentSaving ? "Lagrer..." : "Lagre endringer"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { title: "Hero-seksjon", fields: [
                    { key: "hero_tag", label: "Toppetikkett" }, { key: "hero_title_1", label: "Tittel linje 1" },
                    { key: "hero_title_2", label: "Tittel linje 2 (uthevet)" }, { key: "hero_title_3", label: "Tittel linje 3" },
                    { key: "hero_description", label: "Beskrivelse" }, { key: "hero_cta", label: "Knapp-tekst" },
                  ]},
                  { title: "Pakke-beskrivelser", fields: [
                    { key: "standard_desc", label: "Standard" }, { key: "gull_desc", label: "Gull" }, { key: "vip_desc", label: "VIP" },
                  ]},
                ].map(section => (
                  <div key={section.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 }}>{section.title}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {section.fields.map(({ key, label }) => (
                        <div key={key}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>{label}</label>
                          <input type="text" value={content[key] || ""} onChange={e => setContent({ ...content, [key]: e.target.value })}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#0f172a" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
