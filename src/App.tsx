import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
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
import {
  getPersistedSiteStateSignature,
  hasPersistedSiteState,
  readPersistedSiteState,
  type PersistedSiteStateData,
  writePersistedSiteState,
} from "@/utils/persistedSiteState";
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

function getCurrentPublishedState(): PersistedSiteStateData {
  const ordersState = useOrdersStore.getState();

  return {
    pricingTiers: usePricingStore.getState().tiers,
    content: useSiteContentStore.getState().content,
    orders: ordersState.orders,
    nextSequenceNumber: ordersState.nextSequenceNumber,
  };
}

export default function App() {
  const initialSnapshot = useMemo(() => readPersistedSiteState(), []);
  const hasCachedSnapshot = initialSnapshot !== null;
  const [status, setStatus] = useState<BootSyncStatus>("booting");
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const lastPersistedSignatureRef = useRef(
    initialSnapshot
      ? getPersistedSiteStateSignature({
          pricingTiers: initialSnapshot.pricingTiers,
          content: initialSnapshot.content,
          orders: initialSnapshot.orders,
          nextSequenceNumber: initialSnapshot.nextSequenceNumber,
        })
      : "",
  );
  const dirtyPersistRef = useRef(false);
  const persistTimerRef = useRef<number | undefined>(undefined);

  const persistCurrentState = useMemo(
    () => () => {
      const currentState = getCurrentPublishedState();
      const signature = getPersistedSiteStateSignature(currentState);

      if (signature === lastPersistedSignatureRef.current) {
        dirtyPersistRef.current = false;
        return false;
      }

      const saved = writePersistedSiteState(currentState);
      if (!saved) return false;

      lastPersistedSignatureRef.current = signature;
      dirtyPersistRef.current = false;
      return true;
    },
    [],
  );

  const schedulePersist = useMemo(
    () => () => {
      dirtyPersistRef.current = true;

      if (persistTimerRef.current !== undefined) {
        window.clearTimeout(persistTimerRef.current);
      }

      persistTimerRef.current = window.setTimeout(() => {
        persistTimerRef.current = undefined;
        persistCurrentState();
      }, 400);
    },
    [persistCurrentState],
  );

  const resync = useMemo(
    () => async () => {
      const ok = await runBootSyncOnce();
      setStatus(ok ? "ready" : "offline");
      setSyncedAt(Date.now());
      persistCurrentState();
    },
    [persistCurrentState],
  );

  useEffect(() => {
    let cancelled = false;
    let pollHandle: number | undefined;

    (async () => {
      const ok = await runBootSyncOnce();
      if (cancelled) return;
      setStatus(ok ? "ready" : "offline");
      setSyncedAt(Date.now());
      persistCurrentState();
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
            persistCurrentState();
          }
        } catch {
          /* silent on poll errors; keep whatever status we have */
        }
      }, 30_000);
    }

    return () => {
      cancelled = true;
      if (pollHandle !== undefined) window.clearInterval(pollHandle);
    };
  }, [persistCurrentState]);

  useEffect(() => {
    persistCurrentState();

    const unsubscribePricing = usePricingStore.subscribe(() => {
      schedulePersist();
    });
    const unsubscribeContent = useSiteContentStore.subscribe(() => {
      schedulePersist();
    });
    const unsubscribeOrders = useOrdersStore.subscribe(() => {
      schedulePersist();
    });

    const intervalHandle = window.setInterval(() => {
      if (dirtyPersistRef.current) {
        persistCurrentState();
      }
    }, 120_000);

    return () => {
      unsubscribePricing();
      unsubscribeContent();
      unsubscribeOrders();
      window.clearInterval(intervalHandle);
      if (persistTimerRef.current !== undefined) {
        window.clearTimeout(persistTimerRef.current);
      }
    };
  }, [persistCurrentState, schedulePersist]);

  const bootContext = useMemo<BootContextValue>(
    () => ({ status, syncedAt, resync }),
    [status, syncedAt, resync],
  );

  if (status === "booting" && !hasCachedSnapshot && !hasPersistedSiteState()) {
    // Only block paint when there is truly no saved snapshot to show yet.
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
            Syncing bundles, sample projects, orders and content from the live
            database.
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
            <Route
              path="/other"
              element={
                <div className="text-center text-xl">
                  Other Page - Coming Soon
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </BootContext.Provider>
  );
}
