import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Packages from "@/components/Packages";
import Gallery from "@/components/Gallery";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "#fff" }}>
      <Navbar />
      <Hero />
      <Packages />
      <Gallery />
      <OrderForm />
      <Footer />
    </main>
  );
}
