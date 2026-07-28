import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import SampleProjects from "@/pages/SampleProjects";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import Todos from "@/pages/Todos";
import SecretAdminTrigger from "@/components/SecretAdminTrigger";
import { usePricingStore } from "@/store/pricing";
import { useSiteContentStore } from "@/store/siteContent";
import { useOrdersStore } from "@/store/orders";

export default function App() {
  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      const syncPricing = usePricingStore.getState().syncFromDatabase();
      const syncContent = useSiteContentStore.getState().syncFromDatabase();
      const syncOrders = useOrdersStore.getState().syncFromDatabase();
      await Promise.all([syncPricing, syncContent, syncOrders]);
    };
    bootstrap();

    let pollHandle: number | undefined;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      pollHandle = window.setInterval(async () => {
        if (cancelled) return;
        try {
          await Promise.all([
            usePricingStore.getState().syncFromDatabase(),
            useSiteContentStore.getState().syncFromDatabase(),
            useOrdersStore.getState().syncFromDatabase(),
          ]);
        } catch (_) {
          /* ignore poll errors silently */
        }
      }, 30_000);
    }

    return () => {
      cancelled = true;
      if (pollHandle !== undefined) window.clearInterval(pollHandle);
    };
  }, []);

  return (
    <Router>
      <SecretAdminTrigger />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sample-projects" element={<SampleProjects />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/webify" element={<AdminLogin />} />
        <Route path="/webify/dashboard" element={<AdminDashboard />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
