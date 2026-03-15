export default function Footer() {
  return (
    <footer style={{ background: "#111827", padding: "64px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 56 }} className="footer-grid">

          {/* Brand */}
          <div>
            <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 12 }}>RD</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>RusseDesign</span>
            </a>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, maxWidth: 280, margin: "0 0 20px" }}>
              Profesjonelt russelogodesign til russekofter, biler og busser. Norges raskeste levering.
            </p>
            <a href="/bestill" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#fff", background: "#7c3aed", padding: "9px 20px", borderRadius: 8, textDecoration: "none" }}>
              Bestill nå →
            </a>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Navigasjon</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Pakker", "/#pakker"], ["Galleri", "/#galleri"], ["Bestill", "/bestill"]].map(([l, h]) => (
                <a key={l} href={h} style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>Kontakt</p>
            <a href="mailto:abdikadir568@gmail.com" style={{ fontSize: 14, color: "#6b7280", textDecoration: "none", display: "block", marginBottom: 8 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}>
              abdikadir568@gmail.com
            </a>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Levering innen 48t</p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #1f2937", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "#4b5563", margin: 0 }}>© 2026 RusseDesign. Alle rettigheter forbeholdt.</p>
          <p style={{ fontSize: 13, color: "#4b5563", margin: 0 }}>Laget i Norge 🇳🇴</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
