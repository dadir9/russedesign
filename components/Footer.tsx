export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t" style={{ background: "#0a0a0f", borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: "#7c3aed" }}>RD</div>
            <span className="font-black text-white text-lg">RusseDesign</span>
          </a>

          <div className="flex gap-8 text-sm font-medium" style={{ color: "#475569" }}>
            <a href="#pakker" className="hover:text-white transition-colors">Pakker</a>
            <a href="#galleri" className="hover:text-white transition-colors">Galleri</a>
            <a href="#bestill" className="hover:text-white transition-colors">Bestill</a>
          </div>

          <a href="#bestill" className="text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all hover:opacity-80" style={{ background: "#7c3aed" }}>
            Bestill nå →
          </a>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <p className="text-xs" style={{ color: "#334155" }}>© 2026 RusseDesign — Profesjonelt russelogodesign</p>
          <p className="text-xs" style={{ color: "#334155" }}>abdikadir568@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
