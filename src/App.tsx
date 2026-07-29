import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import SampleProjects from "@/pages/SampleProjects";
import AdminLogin from "@/pages/AdminLogin";
import Todos from "@/pages/Todos";
import SecretAdminTrigger from "@/components/SecretAdminTrigger";
import { usePricingStore } from "@/store/pricing";
import { useSiteContentStore } from "@/store/siteContent";
import { useOrdersStore } from "@/store/orders";
import { createContext, useContext } from "react";

const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

export type BootSyncStatus = "booting" | "ready" | "offline";

export type BootContextValue = {
  status: BootSyncStatus;
  syncedAt: number | null;
  resync: () => Promise<void>;
};

const BootContext = createContext<BootContextValue>({
  status: "booting",
  syncedAt: null,
  resync: async () => {},
});

export function useBootSync(): BootContextValue {
  return useContext(BootContext);
}

async function runBootSyncOnce(): Promise<boolean> {
  const syncPricing = usePricingStore.getState().syncFromDatabase();
  const syncContent = useSiteContentStore.getState().syncFromDatabase();
  const syncOrders = useOrdersStore.getState().syncFromDatabase();
  const [pricingOk, contentOk, ordersOk] = await Promise.all([
    syncPricing,
    syncContent,
    syncOrders,
  ]);
  return pricingOk || contentOk || ordersOk;
}

export default function App() {
  const [status, setStatus] = useState<BootSyncStatus>("booting");
  const [syncedAt, setSyncedAt] = useState<number | null>(null);

  const resync = useMemo(
    () => async () => {
      const ok = await runBootSyncOnce();
      setStatus(ok ? "ready" : "offline");
      setSyncedAt(Date.now());
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    let pollHandle: number | undefined;

    (async () => {
      const ok = await runBootSyncOnce();
      if (cancelled) return;
      setStatus(ok ? "ready" : "offline");
      setSyncedAt(Date.now());
    })();

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      pollHandle = window.setInterval(async () => {
        if (cancelled) return;
        try {
          await runBootSyncOnce();
          if (!cancelled) {
            setStatus("ready");
            setSyncedAt(Date.now());
          }
        } catch (_) {
          /* silent on poll errors; keep whatever status we have */
        }
      }, 30_000);
    }

    return () => {
      cancelled = true;
      if (pollHandle !== undefined) window.clearInterval(pollHandle);
    };
  }, []);

  const bootContext = useMemo<BootContextValue>(
    () => ({ status, syncedAt, resync }),
    [status, syncedAt, resync]
  );

  if (status === "booting") {
    // Never paint the hardcoded defaults. Splash-screen while the first DB pull completes.
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-[#050815] text-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/70 border-t-transparent" />
          </div>
          <h1 className="bg-gradient-to-br from-white via-white to-cyan-100 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
            Loading your content…
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Syncing bundles, sample projects, orders and content from the live database.
            {!import.meta.env.VITE_SUPABASE_URL
              ? " (VITE_SUPABASE_URL not set — will fall back to offline cache)"
              : ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BootContext.Provider value={bootContext}>
      <Router>
        <SecretAdminTrigger />
        <Suspense
          fallback={
            <div className="min-h-screen w-full bg-[#050815] text-white">
              <div className="mx-auto flex max-w-3xl items-center justify-center px-6 py-20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/70 border-t-transparent" />
              </div>
            </div>
          }
        >
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
        </Suspense>
      </Router>
    </BootContext.Provider>
  );
}
