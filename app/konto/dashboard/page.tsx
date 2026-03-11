"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  created_at: string;
  pakke: string;
  russekull: string;
  status: string;
  beskrivelse: string;
};

const statusColors: Record<string, string> = {
  ny: "#f59e0b",
  "under arbeid": "#3b82f6",
  levert: "#10b981",
  avbrutt: "#ef4444",
};
const packageNames: Record<string, string> = { standard: "Standard", gull: "Gull", vip: "VIP" };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; navn?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/konto"); return; }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      setUser({ email: data.user.email, navn: profile?.navn });

      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("epost", data.user.email)
        .order("created_at", { ascending: false });

      setOrders(orderData || []);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/konto");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
        <p style={{ color: "#475569" }}>Laster...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#0a0a0f" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <a href="/" className="text-xs font-medium mb-3 block" style={{ color: "#475569" }}>← Forsiden</a>
            <h1 className="text-2xl font-black text-white">Hei, {user?.navn?.split(" ")[0] || "der"} 👋</h1>
            <p className="text-sm mt-1" style={{ color: "#475569" }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="text-xs font-bold px-4 py-2 rounded-full transition-all hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", color: "#64748b" }}>
            Logg ut
          </button>
        </div>

        {/* Orders */}
        <div className="rounded-2xl p-6" style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#475569" }}>Mine bestillinger</p>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm mb-4" style={{ color: "#334155" }}>Du har ingen bestillinger ennå.</p>
              <a href="/#pakker"
                className="inline-block text-sm font-bold px-6 py-3 rounded-full text-white"
                style={{ background: "#7c3aed" }}>
                Se pakker →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: statusColors[order.status] ?? "#64748b" }} />
                      <span className="text-sm font-bold text-white capitalize">{order.status}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                      {packageNames[order.pakke] ?? order.pakke}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "#64748b" }}>{order.russekull}</p>
                  <p className="text-xs mt-1" style={{ color: "#334155" }}>
                    {new Date(order.created_at).toLocaleDateString("no", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
