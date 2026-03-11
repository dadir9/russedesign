"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function KontoInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/konto/dashboard";
  const [mode, setMode] = useState<"register" | "login">("register");
  const [fornavn, setFornavn] = useState("");
  const [etternavn, setEtternavn] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "#2a2a3a",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#f1f5f9",
    width: "100%",
    padding: "13px 16px",
    fontSize: "14px",
    outline: "none",
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const navn = `${fornavn} ${etternavn}`.trim();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, navn, telefon }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Noe gikk galt"); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError("Feil e-post eller passord."); setLoading(false); return; }
    router.push(next);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/konto/dashboard` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a0f 100%)" }}>

      <div className="w-full max-w-[420px] relative">

        {/* Close button */}
        <a href="/" className="absolute -top-4 -right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80 z-10"
          style={{ background: "#2a2a3a", color: "#94a3b8" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </a>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: "#16161f", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>

          {/* Tabs */}
          <div className="inline-flex gap-1 p-1 rounded-full mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
            {(["register", "login"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(false); }}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: mode === m ? "#fff" : "transparent",
                  color: mode === m ? "#0f172a" : "#64748b",
                }}>
                {m === "register" ? "Sign up" : "Sign in"}
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
              <p className="font-black text-white text-lg mb-2">Konto opprettet!</p>
              <p className="text-sm mb-5" style={{ color: "#64748b" }}>Du kan nå logge inn med e-post og passord.</p>
              <button onClick={() => { setMode("login"); setSuccess(false); }}
                className="text-sm font-bold px-6 py-3 rounded-full text-white"
                style={{ background: "#7c3aed" }}>
                Gå til innlogging →
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white mb-6">
                {mode === "register" ? "Create an account" : "Welcome back"}
              </h2>

              <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-3">

                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="First name" value={fornavn}
                      onChange={(e) => setFornavn(e.target.value)} style={inputStyle} />
                    <input type="text" required placeholder="Last name" value={etternavn}
                      onChange={(e) => setEtternavn(e.target.value)} style={inputStyle} />
                  </div>
                )}

                {/* Email with icon */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#475569" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                    </svg>
                  </div>
                  <input type="email" required placeholder="Enter your email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: "44px" }} />
                </div>

                {mode === "register" && (
                  /* Phone with flag */
                  <div className="relative flex gap-0">
                    <div className="flex items-center gap-2 px-3 rounded-l-xl flex-shrink-0"
                      style={{ background: "#2a2a3a", border: "1px solid rgba(255,255,255,0.08)", borderRight: "none" }}>
                      <span className="text-base">🇳🇴</span>
                      <span className="text-sm" style={{ color: "#94a3b8" }}>+47</span>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: "#475569" }}>
                        <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <input type="tel" placeholder="XXX XX XXX" value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                      style={{ ...inputStyle, borderRadius: "0 10px 10px 0", borderLeft: "none" }} />
                  </div>
                )}

                {/* Password */}
                <input type="password" required placeholder={mode === "register" ? "Create a password" : "Your password"}
                  minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle} />

                {error && <p className="text-sm text-center" style={{ color: "#ef4444" }}>{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-1"
                  style={{ background: "#fff", color: "#0f172a" }}>
                  {loading
                    ? "Venter..."
                    : mode === "register" ? "Create an account" : "Sign in"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-xs uppercase tracking-widest" style={{ color: "#334155" }}>or sign in with</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleGoogle}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                  style={{ background: "#2a2a3a", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80"
                  style={{ background: "#2a2a3a", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <svg width="16" height="18" viewBox="0 0 814 1000" fill="white">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.4 0 663.8 0 541.4c0-202 128.9-308.7 256.2-308.7 60.5 0 111 39.5 148.9 39.5 36.2 0 93.3-41.5 162.6-41.5 26.2 0 101.7 2.6 157.7 78.4zm-158-207.2c30.1-35.5 51.4-84.9 51.4-134.3 0-6.9-.6-13.8-1.9-19.4-48.7 1.9-106.5 32.5-140.9 73.3-26.2 30.1-51.4 79.5-51.4 130.5 0 7.5 1.3 15 1.9 17.5 3.2.6 8.4 1.3 13.6 1.3 43.4 0 98.1-29.5 127.3-68.9z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Terms */}
              <p className="text-center text-xs mt-5" style={{ color: "#334155" }}>
                By creating an account, you agree to our{" "}
                <span style={{ color: "#64748b", textDecoration: "underline", cursor: "pointer" }}>Terms & Service</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KontoPage() {
  return (
    <Suspense>
      <KontoInner />
    </Suspense>
  );
}
