"use client";
import { useRouter } from "next/navigation";

export default function BestillingBekreftet() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #faf5ff, #fdf2f8)" }}>
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
          <span className="text-3xl text-white font-black">✓</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: "#111827" }}>
          Betaling bekreftet!
        </h1>
        <p className="text-gray-500 mb-2">Tusen takk for bestillingen din!</p>
        <p className="text-gray-400 text-sm mb-8">
          Du har mottatt en bekreftelse på e-post. Vi starter på logoen din og leverer innen avtalt tid.
        </p>
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
