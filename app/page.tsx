import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Packages from "@/components/Packages";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#ffffff" }}>
      <Navbar />
      <Hero />
      <Packages />
      <Gallery />
      <Footer />
    </main>
  );
}
