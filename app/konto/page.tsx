"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function KontoPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [password, setPassword] = useState("");
  const [navn, setNavn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputStyle: React.CSSProperties = {
    background: "#13131f",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    color: "#f1f5f9",
    width: "100%",
    padding: "13px 16px",
    fontSize: "15px",
    outline: "none",
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { navn, telefon } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        navn,
        email,
        telefon,
      });
    }

    setSuccess("Konto opprettet! Sjekk e-posten din for bekreftelse.");
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError("Feil e-post eller passord.");
      setLoading(false);
      return;
    }

    router.push("/konto/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a0f" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="font-black text-xl" style={{ color: "#f5f0e8" }}>RusseDesign</span>
          </a>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl mb-8" style={{ background: "rgba(255,255,255,0.04)" }}>
            {(["register", "login"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: mode === m ? "#7c3aed" : "transparent",
                  color: mode === m ? "#fff" : "#475569",
                }}>
                {m === "register" ? "Opprett konto" : "Logg inn"}
              </button>
            ))}
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.15)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-bold text-white mb-2">Konto opprettet!</p>
              <p className="text-sm" style={{ color: "#64748b" }}>Sjekk e-posten din for å bekrefte kontoen.</p>
              <button onClick={() => { setMode("login"); setSuccess(""); }}
                className="mt-4 text-sm font-bold" style={{ color: "#a78bfa" }}>
                Gå til innlogging →
              </button>
            </div>
          ) : mode === "register" ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#475569" }}>Navn</label>
                <input type="text" required placeholder="Ditt fulle navn" value={navn}
                  onChange={(e) => setNavn(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#475569" }}>E-post</label>
                <input type="email" required placeholder="din@epost.no" value={email}
                  onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#475569" }}>Telefonnummer</label>
                <input type="tel" required placeholder="+47 XXX XX XXX" value={telefon}
                  onChange={(e) => setTelefon(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#475569" }}>Passord</label>
                <input type="password" required placeholder="Minst 6 tegn" minLength={6} value={password}
                  onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              </div>
              {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: "#7c3aed", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
                {loading ? "Oppretter konto..." : "Opprett konto →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#475569" }}>E-post</label>
                <input type="email" required placeholder="din@epost.no" value={email}
                  onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest block mb-2" style={{ color: "#475569" }}>Passord</label>
                <input type="password" required placeholder="Ditt passord" value={password}
                  onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              </div>
              {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: "#7c3aed", boxShadow: "0 8px 24px rgba(124,58,237,0.3)" }}>
                {loading ? "Logger inn..." : "Logg inn →"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#334155" }}>
          <a href="/" className="hover:text-white transition-colors">← Tilbake til forsiden</a>
        </p>
      </div>
    </div>
  );
}
