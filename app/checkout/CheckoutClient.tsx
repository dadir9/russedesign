"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const prices: Record<string, number> = { standard: 2990, gull: 4490, vip: 6990 };
const packageNames: Record<string, string> = { standard: "Standard", gull: "Gull", vip: "VIP" };

function CheckoutContent() {
  const params = useSearchParams();
  const pkg = params.get("pakke") || "standard";
  const navn = params.get("navn") || "";
  const orderId = params.get("orderId") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const price = prices[pkg] ?? 2990;
  const deposit = Math.round(price / 2);
  const depositMva = Math.round(deposit * 1.25);
  const packageName = packageNames[pkg] ?? "Standard";

  const handlePay = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/payment/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, pakke: pkg, navn }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      setError(data.error || "Noe gikk galt. Prøv igjen.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen" style={{ background: "#f9fafb" }}>
      <nav className="px-4 sm:px-6 h-14 flex items-center justify-between" style={{ background: "#111827" }}>
        <a href="/" className="font-black text-lg" style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          RusseDesign ✦
        </a>
        <span className="text-xs font-bold text-gray-500">🔒 Sikker betaling</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:grid lg:grid-cols-5 gap-6">

        {/* Ordresammendrag */}
        <div className="lg:order-2 lg:col-span-2">
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: "#111827" }}>
            <p className="text-xs font-black uppercase tracking-widest mb-5 text-gray-500">Ordresammendrag</p>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-white font-black">{packageName}-pakke</p>
                <p className="text-xs text-gray-500">RusseDesign logo</p>
              </div>
              <p className="text-white font-black">{price.toLocaleString("no")} kr</p>
            </div>
            <div className="border-t my-4 border-gray-800" />
            <div className="flex justify-between mb-1">
              <p className="text-xs text-gray-500">Depositum nå (50%)</p>
              <p className="text-xs text-purple-400 font-black">{deposit.toLocaleString("no")} kr</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-gray-500">Rest ved levering</p>
              <p className="text-xs text-gray-400">{deposit.toLocaleString("no")} kr</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-xs text-gray-500">MVA (25%)</p>
              <p className="text-xs text-gray-400">{Math.round(deposit * 0.25).toLocaleString("no")} kr</p>
            </div>
            <div className="border-t my-4 border-gray-800" />
            <div className="flex justify-between items-center">
              <p className="font-black text-white text-sm uppercase tracking-widest">Betales nå</p>
              <p className="font-black text-white text-xl">{depositMva.toLocaleString("no")} kr</p>
            </div>
            <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: "#1e2d3d" }}>
              <span className="text-green-400 text-sm">🔒</span>
              <p className="text-xs text-gray-500">SSL-kryptert betaling via Stripe</p>
            </div>
          </div>
        </div>

        {/* Betaling */}
        <div className="lg:order-1 lg:col-span-3 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: "#111827" }}>Betaling 💳</h1>
          <div className="rounded-2xl p-6 bg-white border-2 border-gray-100">
            <p className="font-black text-lg mb-2" style={{ color: "#111827" }}>Hei {navn}! 👋</p>
            <p className="text-gray-500 text-sm mb-6">
              Klikk nedenfor for å betale depositum på <strong>{depositMva.toLocaleString("no")} kr</strong> inkl. MVA. Du sendes til Stripes sikre betalingsside.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 text-sm font-black rounded-full transition-all hover:opacity-80 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", color: "#fff" }}
            >
              {loading ? "Åpner betalingsside..." : `Betal ${depositMva.toLocaleString("no")} kr med Stripe 🚀`}
            </button>
            <p className="text-xs text-center text-gray-400 mt-3">Visa, Mastercard, og mer — powered by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutClient() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
