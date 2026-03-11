"use client";
import { useState, useEffect, useCallback } from "react";

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

const statuses = ["ny", "under arbeid", "levert", "avbrutt"];

const statusColors: Record<string, string> = {
  ny: "#f59e0b",
  "under arbeid": "#3b82f6",
  levert: "#10b981",
  avbrutt: "#ef4444",
};

const packagePrices: Record<string, number> = {
  standard: 2990,
  gull: 4490,
  vip: 6990,
};

const packageNames: Record<string, string> = {
  standard: "Standard",
  gull: "Gull",
  vip: "VIP",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<"alle" | "ny" | "under arbeid" | "levert" | "avbrutt">("alle");

  const fetchOrders = useCallback(async (pw: string) => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-password": pw },
    });
    if (!res.ok) {
      setError("Feil passord");
      setAuthed(false);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setOrders(data);
    setAuthed(true);
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await fetchOrders(password);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  useEffect(() => {
    if (authed) fetchOrders(password);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stats
  const totalOmsetning = orders
    .filter((o) => o.status !== "avbrutt")
    .reduce((sum, o) => sum + (packagePrices[o.pakke] ?? 0), 0);

  const thisWeek = orders.filter((o) => {
    const d = new Date(o.created_at);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });

  const filteredOrders = activeTab === "alle" ? orders : orders.filter((o) => o.status === activeTab);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(124,58,237,0.2)" }}>
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-black text-white">Admin</h1>
            <p className="text-sm mt-1" style={{ color: "#475569" }}>RusseDesign kontrollpanel</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            required
            className="w-full px-4 py-3 rounded-xl mb-3 text-white"
            style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.08)", outline: "none" }}
          />
          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-80" style={{ background: "#7c3aed" }}>
            Logg inn
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Kontrollpanel</h1>
            <p className="text-sm mt-0.5" style={{ color: "#475569" }}>RusseDesign admin</p>
          </div>
          <button onClick={() => fetchOrders(password)} className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:opacity-80" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
            Oppdater
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl p-5" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-3xl font-black text-white">{orders.length}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>Totalt bestillinger</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-3xl font-black" style={{ color: "#a78bfa" }}>{thisWeek.length}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>Denne uken</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-3xl font-black" style={{ color: "#10b981" }}>{orders.filter(o => o.status === "levert").length}</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>Levert</p>
          </div>
          <div className="rounded-2xl p-5" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-2xl font-black text-white">{totalOmsetning.toLocaleString("no")} kr</p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>Total verdi</p>
          </div>
        </div>

        {/* Pakke fordeling */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {["standard", "gull", "vip"].map((p) => {
            const count = orders.filter((o) => o.pakke === p && o.status !== "avbrutt").length;
            return (
              <div key={p} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <p className="text-sm font-bold text-white capitalize">{packageNames[p]}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{packagePrices[p].toLocaleString("no")} kr</p>
                </div>
                <p className="text-2xl font-black" style={{ color: "#7c3aed" }}>{count}</p>
              </div>
            );
          })}
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["alle", ...statuses] as const).map((tab) => {
            const count = tab === "alle" ? orders.length : orders.filter(o => o.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className="text-xs font-bold px-4 py-2 rounded-full transition-all capitalize"
                style={{
                  background: activeTab === tab ? (tab === "alle" ? "#7c3aed" : statusColors[tab]) : "rgba(255,255,255,0.05)",
                  color: activeTab === tab ? "#fff" : "#64748b",
                }}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {loading ? (
          <p className="text-center text-gray-500 py-12">Laster...</p>
        ) : (
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelected(selected?.id === order.id ? null : order)}
                className="rounded-2xl p-4 cursor-pointer transition-all"
                style={{ background: "#13131f", border: `1px solid ${selected?.id === order.id ? "#7c3aed" : "rgba(255,255,255,0.06)"}` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: statusColors[order.status] ?? "#64748b" }} />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{order.navn}</p>
                      <p className="text-xs truncate" style={{ color: "#64748b" }}>{order.epost} · {order.russekull}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                      {packageNames[order.pakke] ?? order.pakke}
                    </span>
                    <span className="text-xs" style={{ color: "#334155" }}>
                      {new Date(order.created_at).toLocaleDateString("no")}
                    </span>
                  </div>
                </div>

                {selected?.id === order.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>{order.beskrivelse}</p>
                    {order.bilder?.length > 0 && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {order.bilder.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer">
                            <img src={url} alt="Bilde" className="w-16 h-16 object-cover rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
                          </a>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: "#475569" }}>Status</p>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); updateStatus(order.id, s); }}
                            className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all capitalize"
                            style={{
                              background: order.status === s ? statusColors[s] : "rgba(255,255,255,0.05)",
                              color: order.status === s ? "#fff" : "#64748b",
                              border: `1px solid ${order.status === s ? statusColors[s] : "rgba(255,255,255,0.08)"}`,
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <p className="text-center py-12 text-sm" style={{ color: "#334155" }}>Ingen bestillinger her.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
