import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Navbar />
      <main className="flex-1 pt-16 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
