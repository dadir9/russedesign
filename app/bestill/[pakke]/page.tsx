import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BestillClient from "./BestillClient";

const packageData: Record<string, {
  name: string;
  price: number;
  deposit: number;
  badge: string | null;
  color: string;
  description: string;
  features: string[];
  delivery: string;
}> = {
  standard: {
    name: "Standard",
    price: 2990,
    deposit: 1495,
    badge: null,
    color: "#a78bfa",
    description: "Enkelt og stilrent design for deg som vil ha noe pent uten alt det ekstra. Perfekt for deg som vet hva du vil ha.",
    features: [
      "1 logo-konsept",
      "2 revisjoner inkludert",
      "Levering innen 5 dager",
      "PNG & PDF filer",
      "Høy oppløsning",
    ],
    delivery: "5 dager",
  },
  gull: {
    name: "Gull",
    price: 4490,
    deposit: 2245,
    badge: "Mest populær",
    color: "#f59e0b",
    description: "Mest valgte pakken. Full kreativ frihet, flere konsepter og rask levering. Det beste valget for de fleste.",
    features: [
      "3 logo-konsepter",
      "5 revisjoner inkludert",
      "Levering innen 3 dager",
      "Alle filformater",
      "Sosiale medier-versjon",
      "Prioritert support",
    ],
    delivery: "3 dager",
  },
  vip: {
    name: "VIP",
    price: 6990,
    deposit: 3495,
    badge: "Premium",
    color: "#7c3aed",
    description: "Det aller beste tilbudet. Ubegrenset alt, raskest levering og koftemal inkludert. For deg som vil ha det perfekte.",
    features: [
      "Ubegrenset logo-konsepter",
      "Ubegrenset revisjoner",
      "Levering innen 48 timer",
      "Alle filformater",
      "Koftemal inkludert",
      "Dedikert designer",
      "Direkte kontakt på WhatsApp",
    ],
    delivery: "48 timer",
  },
};

export function generateStaticParams() {
  return [{ pakke: "standard" }, { pakke: "gull" }, { pakke: "vip" }];
}

export default async function BestillPakkePage({ params }: { params: Promise<{ pakke: string }> }) {
  const { pakke } = await params;
  const data = packageData[pakke];
  if (!data) notFound();

  return (
    <main style={{ background: "#0a0a0f", minHeight: "100vh" }}>
      <Navbar />
      <BestillClient pakke={pakke} data={data} />
      <Footer />
    </main>
  );
}
