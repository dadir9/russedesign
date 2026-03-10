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

const statuses = ["ny", "betalt", "under arbeid", "levert", "avbrutt"];

const statusColors: Record<string, string> = {
  ny: "#f59e0b",
  betalt: "#10b981",
  "under arbeid": "#3b82f6",
  levert: "#7c3aed",
  avbrutt: "#ef4444",
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
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await fetchOrders(password);
    setAuthed(true);
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
  }, [authed, fetchOrders, password]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0f13" }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <h1 className="text-2xl font-black text-white mb-6 text-center">Admin 🔐</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passord"
            required
            className="w-full px-4 py-3 rounded-xl mb-3 text-white"
            style={{ background: "#1a1a2e", border: "1.5px solid #2d2d4e", outline: "none" }}
          />
          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{ background: "#7c3aed" }}
          >
            Logg inn
          </button>
        </form>
      </div>
    );
  }

  const counts = statuses.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen" style={{ background: "#0f0f13" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-white">Admin — Bestillinger</h1>
          <button onClick={() => fetchOrders(password)} className="text-xs text-purple-400 hover:text-purple-300">
            Oppdater
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {statuses.map((s) => (
            <div key={s} className="rounded-xl p-4 text-center" style={{ background: "#1a1a2e" }}>
              <p className="text-2xl font-black" style={{ color: statusColors[s] }}>{counts[s] ?? 0}</p>
              <p className="text-xs mt-1 capitalize" style={{ color: "#64748b" }}>{s}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-12">Laster...</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelected(selected?.id === order.id ? null : order)}
                className="rounded-2xl p-4 sm:p-5 cursor-pointer transition-all"
                style={{ background: "#1a1a2e", border: `1.5px solid ${selected?.id === order.id ? "#7c3aed" : "#2d2d4e"}` }}
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
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#0f0f13", color: "#a78bfa" }}>
                      {packageNames[order.pakke] ?? order.pakke}
                    </span>
                    <span className="text-xs" style={{ color: "#475569" }}>
                      {new Date(order.created_at).toLocaleDateString("no")}
                    </span>
                  </div>
                </div>

                {selected?.id === order.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: "#2d2d4e" }}>
                    <p className="text-sm mb-3" style={{ color: "#94a3b8" }}>{order.beskrivelse}</p>
                    {order.bilder?.length > 0 && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {order.bilder.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noreferrer">
                            <img src={url} alt="Bilde" className="w-16 h-16 object-cover rounded-xl" />
                          </a>
                        ))}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "#64748b" }}>Oppdater status:</p>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            onClick={(e) => { e.stopPropagation(); updateStatus(order.id, s); }}
                            className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                            style={{
                              background: order.status === s ? statusColors[s] : "#0f0f13",
                              color: order.status === s ? "#fff" : "#64748b",
                              border: `1px solid ${order.status === s ? statusColors[s] : "#2d2d4e"}`,
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
            {orders.length === 0 && (
              <p className="text-center py-12" style={{ color: "#475569" }}>Ingen bestillinger ennå.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
