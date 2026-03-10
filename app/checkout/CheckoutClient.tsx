"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

const prices: Record<string, number> = { standard: 2990, gull: 4490, vip: 6990 };
const packageNames: Record<string, string> = { standard: "Standard", gull: "Gull", vip: "VIP" };

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pkg = params.get("pakke") || "standard";
  const name = params.get("navn") || "";

  const [method, setMethod] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [done, setDone] = useState(false);

  const price = prices[pkg] ?? 2990;
  const deposit = Math.round(price / 2);
  const packageName = packageNames[pkg] ?? "Standard";

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  const inputStyle = {
    background: "#f3f4f6",
    border: "none",
    borderRadius: "12px",
    color: "#111827",
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    outline: "none",
  } as React.CSSProperties;

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #faf5ff, #fdf2f8)" }}>
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <span className="text-3xl text-white">✓</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ color: "#111827" }}>Betaling mottatt!</h1>
          <p className="mb-1 text-gray-500">Takk, {name || "kunde"}!</p>
          <p className="mb-8 text-gray-500 text-sm">Vi starter på logoen og leverer innen avtalt tid 🎨</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-4 text-sm font-black rounded-full hover:opacity-80 transition-all"
            style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", color: "#fff" }}
          >
            Tilbake til forsiden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f9fafb" }}>
      {/* Navbar */}
      <nav className="px-4 sm:px-6 h-14 flex items-center justify-between" style={{ background: "#111827" }}>
        <a href="/" className="font-black text-lg" style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          RusseDesign ✦
        </a>
        <span className="text-xs font-bold text-gray-500">🔒 Sikker betaling</span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:grid lg:grid-cols-5 gap-6">

        {/* Order summary — top on mobile */}
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
              <p className="font-black text-white text-xl">{Math.round(deposit * 1.25).toLocaleString("no")} kr</p>
            </div>
            <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: "#1e2d3d" }}>
              <span className="text-green-400 text-sm">🔒</span>
              <p className="text-xs text-gray-500">SSL-kryptert og sikker betaling</p>
            </div>
          </div>
        </div>

        {/* Payment form */}
        <div className="lg:order-1 lg:col-span-3 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-black" style={{ color: "#111827" }}>Betaling 💳</h1>

          {/* Payment methods */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3 text-gray-500">Velg betalingsmetode</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: "vipps", label: "Vipps", icon: "📱" },
                { id: "kort", label: "Kort", icon: "💳" },
                { id: "faktura", label: "Faktura", icon: "📄" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className="p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  style={{
                    background: method === m.id ? "#111827" : "#fff",
                    border: `2px solid ${method === m.id ? "#7c3aed" : "#e5e7eb"}`,
                  }}
                >
                  <span className="text-xl sm:text-2xl">{m.icon}</span>
                  <span className="text-xs font-black" style={{ color: method === m.id ? "#a78bfa" : "#374151" }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vipps */}
          {method === "vipps" && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border-2 border-gray-100">
                <p className="font-black mb-1" style={{ color: "#111827" }}>Betal med Vipps 📱</p>
                <p className="text-xs text-gray-400 mb-4">Vi sender betalingsforespørsel til nummeret ditt.</p>
                <input type="tel" required placeholder="Mobilnummer" style={inputStyle} />
              </div>
              <PayButton deposit={deposit} />
            </form>
          )}

          {/* Kort */}
          {method === "kort" && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border-2 border-gray-100 space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Kortnummer</label>
                  <input
                    type="text" required maxLength={19} placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    style={{ ...inputStyle, letterSpacing: "0.1em" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Utløpsdato</label>
                    <input
                      type="text" required placeholder="MM/ÅÅ" maxLength={5}
                      value={expiry}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">CVC</label>
                    <input
                      type="text" required placeholder="000" maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
              <PayButton deposit={deposit} />
            </form>
          )}

          {/* Faktura */}
          {method === "faktura" && (
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border-2 border-gray-100">
                <p className="font-black mb-1" style={{ color: "#111827" }}>Faktura på e-post 📄</p>
                <p className="text-xs text-gray-400 mb-4">14 dagers betalingsfrist.</p>
                <input type="email" required placeholder="din@epost.no" style={inputStyle} />
              </div>
              <PayButton deposit={deposit} />
            </form>
          )}

          {!method && (
            <p className="text-center text-sm text-gray-400 py-4">👆 Velg en betalingsmetode</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PayButton({ deposit }: { deposit: number }) {
  return (
    <button
      type="submit"
      className="w-full py-4 text-sm font-black rounded-full transition-all hover:opacity-80 active:scale-[0.98] cursor-pointer"
      style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)", color: "#fff" }}
    >
      Betal depositum {Math.round(deposit * 1.25).toLocaleString("no")} kr 🚀
    </button>
  );
}

export default function CheckoutClient() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
