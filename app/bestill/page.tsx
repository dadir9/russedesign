import Navbar from "@/components/Navbar";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function BestillPage() {
  return (
    <main style={{ background: "#0a0a0f" }}>
      <Navbar />
      <div className="pt-16">
        <OrderForm />
      </div>
      <Footer />
    </main>
  );
}
