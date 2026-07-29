import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import { Icon, AVAILABLE_ICON_NAMES } from "@/components/Icon";
import { SocialIcon, SOCIAL_LABELS } from "@/components/Social";
import {
  type PricingTier,
  type PricingFeature,
  type TierAccent,
} from "@/store/pricing";
import { useAuthStore } from "@/store/auth";
import { TERMS_TEMPLATE_BODY, type SampleSiteCard, type SiteContent, type SocialLink } from "@/store/siteContent";
import { createClient } from "@/utils/supabase/client";
import {
  ArrowLeft,
  Eye,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  DollarSign,
  UserCircle,
  MessageSquare,
  Mail,
  Phone,
  LayoutGrid,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  Activity,
  Undo2,
  AlertTriangle,
  CheckCircle2,
  Circle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrdersStore, formatOrderCode } from "@/store/orders";
import { usePricingStore } from "@/store/pricing";
import { useSiteContentStore } from "@/store/siteContent";

const ACCENTS: TierAccent[] = ["cyan", "highlight", "purple"];

type AdminTab = "pricing" | "about" | "contact" | "samples" | "orders" | "terms";
const TABS: { id: AdminTab; label: string; icon: React.ReactNode; href?: string }[] = [
  { id: "pricing", label: "Pricing", icon: <DollarSign className="h-4 w-4" />, href: "/pricing" },
  { id: "about", label: "About", icon: <UserCircle className="h-4 w-4" />, href: "/about" },
  { id: "samples", label: "Sample Projects", icon: <LayoutGrid className="h-4 w-4" />, href: "/sample-projects" },
  { id: "orders", label: "Orders", icon: <Phone className="h-4 w-4" /> },
  { id: "contact", label: "Contact", icon: <MessageSquare className="h-4 w-4" />, href: "/contact" },
  { id: "terms", label: "Terms", icon: <FileText className="h-4 w-4" />, href: "/terms" },
];

const uid = () =>
  (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36));

const cloneTiers = (tiers: PricingTier[]): PricingTier[] =>
  tiers.map((t) => ({ ...t, features: t.features.map((f) => ({ ...f })) }));

const cloneContent = (c: SiteContent): SiteContent => ({
  about: { ...c.about, bullets: [...c.about.bullets] },
  contact: {
    ...c.contact,
    socials: c.contact.socials.map((s) => ({ ...s })),
    projectOptions: [...c.contact.projectOptions],
  },
  sampleProjects: {
    ...c.sampleProjects,
    cards: c.sampleProjects.cards.map((card) => ({ ...card })),
  },
  terms: { ...c.terms },
});

const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => isEqual(v, (b as unknown[])[i]));
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return false;
    const ak = Object.keys(a as Record<string, unknown>);
    const bk = Object.keys(b as Record<string, unknown>);
    if (ak.length !== bk.length) return false;
    return ak.every((k) =>
      isEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k]
      )
    );
  }
  return false;
};

const DEFAULT_FEATURE_TEXT = "Describe what is included in this tier.";
const DEFAULT_FEATURE_ICON = "Check";
const DEFAULT_FEATURE_ALT = "Click + to add more features here.";
const DEFAULT_FEATURE_ALT_ICON = "Sparkles";

function makeNewTier(existingIndex: number): PricingTier {
  const accents: TierAccent[] = ["cyan", "highlight", "purple"];
  const accent = accents[existingIndex % accents.length];
  const base =
    accent === "cyan"
      ? { name: "Starter", iconName: "Rocket", price: "from $490", period: "per project", cta: "Choose plan" }
      : accent === "highlight"
      ? { name: "Premium", iconName: "Layers", price: "from $2,490", period: "per project", cta: "Choose plan" }
      : { name: "Enterprise", iconName: "Building2", price: "Custom", period: "custom quote", cta: "Talk to sales" };
  return {
    id: uid(),
    name: `${base.name} ${existingIndex + 1}`.replace(/ 1$/, ""),
    tagline: "Add a short tagline explaining who this bundle is for.",
    price: base.price,
    period: base.period,
    accent,
    iconName: base.iconName,
    popular: existingIndex === 1 ? true : false,
    cta: base.cta,
    features: [
      { id: uid(), text: DEFAULT_FEATURE_TEXT, iconName: DEFAULT_FEATURE_ICON },
      { id: uid(), text: DEFAULT_FEATURE_ALT, iconName: DEFAULT_FEATURE_ALT_ICON },
    ],
  };
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (n: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AVAILABLE_ICON_NAMES;
    return AVAILABLE_ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left outline-none transition-all hover:border-neon-cyan/50 focus:border-neon-cyan/60 focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 ring-1 ring-white/10">
          <Icon name={value} className="h-4 w-4 text-neon-cyan" />
        </span>
        <span className="flex-1 text-sm text-white">{value}</span>
        <Sparkles className="h-4 w-4 text-slate-500" />
      </button>

      {open && (
        <div className="animate-fadeUp absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-white/10 bg-ink-900/95 p-3 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icon..."
            className="mb-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-neon-cyan/50"
          />
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
            {filtered.map((n) => {
              const selected = n === value;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    onChange(n);
                    setOpen(false);
                  }}
                  className={cn(
                    "group flex aspect-square items-center justify-center rounded-xl border transition-all",
                    selected
                      ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan shadow-[0_0_0_3px_rgba(0,240,255,0.18)]"
                      : "border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white"
                  )}
                  title={n}
                >
                  <Icon name={n} className="h-4 w-4" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-full px-2 py-3 text-center text-xs text-slate-500">
                No icons match "{query}".
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full rounded-xl border border-white/10 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </span>
      {children}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]";

function TierEditor({
  tier,
  canRemove,
  onChange,
  onRemove,
}: {
  tier: PricingTier;
  canRemove: boolean;
  onChange: (next: PricingTier) => void;
  onRemove?: () => void;
}) {
  const accentLabel: Record<TierAccent, string> = {
    cyan: "Cyan · Entry",
    highlight: "Gradient · Featured",
    purple: "Purple · Premium",
  };

  const patch = (p: Partial<PricingTier>) => onChange({ ...tier, ...p });
  const setFeature = (featureId: string, fp: Partial<PricingFeature>) =>
    patch({
      features: tier.features.map((f) => (f.id === featureId ? { ...f, ...fp } : f)),
    });
  const addFeature = () =>
    patch({
      features: [
        ...tier.features,
        { id: uid(), text: "New feature description…", iconName: "Check" },
      ],
    });
  const removeFeature = (featureId: string) =>
    patch({ features: tier.features.filter((f) => f.id !== featureId) });

  return (
    <div className="glass-pill rounded-3xl p-6 sm:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
              tier.accent === "cyan" &&
                "bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40",
              tier.accent === "purple" &&
                "bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/40",
              tier.accent === "highlight" &&
                "bg-gradient-to-br from-neon-cyan to-neon-purple text-ink-950 shadow-neon"
            )}
          >
            <Icon name={tier.iconName} className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold tracking-tight text-white">
              {tier.name || "Untitled tier"}
            </p>
            <p className="text-xs text-slate-400">{tier.tagline || "—"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-400">
            <input
              type="checkbox"
              checked={!!tier.popular}
              onChange={(e) => patch({ popular: e.target.checked })}
              className="h-4 w-4 accent-neon-cyan"
            />
            Mark as <span className="font-semibold text-white">Most Popular</span>
          </label>
          <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            title={
              canRemove ? "Remove this bundle" : "At least one bundle is required"
            }
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all",
              canRemove
                ? "border-rose-500/25 bg-rose-500/10 text-rose-300 hover:border-rose-500/50 hover:text-rose-200"
                : "cursor-not-allowed border-white/5 bg-white/[0.03] text-slate-600"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove bundle
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tier title">
          <input
            type="text"
            className={inputCls}
            value={tier.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Basic"
          />
        </Field>
        <Field label="Tier icon">
          <IconPicker value={tier.iconName} onChange={(n) => patch({ iconName: n })} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Tagline">
            <input
              type="text"
              className={inputCls}
              value={tier.tagline}
              onChange={(e) => patch({ tagline: e.target.value })}
              placeholder="Short pitch for this tier"
            />
          </Field>
        </div>

        <Field label="Price">
          <input
            type="text"
            className={inputCls}
            value={tier.price}
            onChange={(e) => patch({ price: e.target.value })}
            placeholder="from $690"
          />
        </Field>
        <Field label="Period">
          <input
            type="text"
            className={inputCls}
            value={tier.period}
            onChange={(e) => patch({ period: e.target.value })}
            placeholder="per project"
          />
        </Field>

        <Field label="Accent color">
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => patch({ accent: a })}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
                  tier.accent === a
                    ? a === "cyan"
                      ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan shadow-[0_0_0_3px_rgba(0,240,255,0.18)]"
                      : a === "purple"
                      ? "border-neon-purple bg-neon-purple/15 text-neon-purple shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
                      : "border-transparent bg-gradient-to-r from-neon-cyan to-neon-purple text-ink-950 shadow-neon"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
                )}
              >
                {accentLabel[a]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="CTA button text">
          <input
            type="text"
            className={inputCls}
            value={tier.cta}
            onChange={(e) => patch({ cta: e.target.value })}
            placeholder="Start Basic"
          />
        </Field>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-[0.22em] text-slate-300">
              Feature checklist
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Edit each row's description and the icon shown next to it. Changes are unsaved until you click Save.
            </p>
          </div>
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
          >
            <Plus className="h-3.5 w-3.5" /> Add feature
          </button>
        </div>

        <ul className="space-y-3">
          {tier.features.map((f) => (
            <li
              key={f.id}
              className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row sm:items-center"
            >
              <div className="sm:w-56">
                <IconPicker
                  value={f.iconName}
                  onChange={(n) => setFeature(f.id, { iconName: n })}
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  className={inputCls}
                  value={f.text}
                  onChange={(e) => setFeature(f.id, { text: e.target.value })}
                  placeholder="Feature description…"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFeature(f.id)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                title="Remove feature"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {tier.features.length === 0 && (
            <li className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
              No features yet — add your first one above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const authenticated = useAuthStore((s) => s.authenticated);
  const logout = useAuthStore((s) => s.logout);

  const storeTiers = usePricingStore((s) => s.tiers);
  const resetPricingDefaults = usePricingStore((s) => s.resetDefaults);
  const pricingSetTiers = usePricingStore((s) => s.setTiers);

  const storeContent = useSiteContentStore((s) => s.content);
  const resetContentDefaults = useSiteContentStore((s) => s.resetDefaults);

  const orders = useOrdersStore((s) => s.orders);
  const nextSequenceNumber = useOrdersStore((s) => s.nextSequenceNumber);
  const setOrderCompleted = useOrdersStore((s) => s.setCompleted);
  const deleteOrder = useOrdersStore((s) => s.deleteOrder);

  const [tab, setTab] = useState<AdminTab>("pricing");
  const [saved, setSaved] = useState<null | "ok" | "warn" | "saving">(null);
  const [dbSyncFailed, setDbSyncFailed] = useState(false);
  const [diagnoseState, setDiagnoseState] = useState<null | "running" | { ok: true; table: string } | { ok: false; error: string }>(null);

  const initialTiersRef = useRef<PricingTier[]>(cloneTiers(storeTiers));
  const initialContentRef = useRef<SiteContent>(cloneContent(storeContent));

  const [draftTiers, setDraftTiers] = useState<PricingTier[]>(() => cloneTiers(initialTiersRef.current));
  const [draftContent, setDraftContent] = useState<SiteContent>(() => cloneContent(initialContentRef.current));

  const isDirty = useMemo(
    () =>
      !isEqual(draftTiers, initialTiersRef.current) ||
      !isEqual(draftContent, initialContentRef.current),
    [draftTiers, draftContent]
  );

  const { about, contact, sample: sampleProjects, terms } = useMemo(
    () => ({
      about: draftContent.about,
      contact: draftContent.contact,
      sample: draftContent.sampleProjects,
      terms: draftContent.terms,
    }),
    [draftContent]
  );

  const patchAbout = (p: Partial<SiteContent["about"]>) =>
    setDraftContent((c) => ({ ...c, about: { ...c.about, ...p } }));
  const patchContact = (p: Partial<SiteContent["contact"]>) =>
    setDraftContent((c) => ({ ...c, contact: { ...c.contact, ...p } }));
  const patchSampleProjects = (p: Partial<SiteContent["sampleProjects"]>) =>
    setDraftContent((c) => ({
      ...c,
      sampleProjects: { ...c.sampleProjects, ...p },
    }));
  const patchTerms = (p: Partial<SiteContent["terms"]>) =>
    setDraftContent((c) => ({ ...c, terms: { ...c.terms, ...p } }));

  useEffect(() => {
    if (!authenticated) navigate("/webify", { replace: true });
  }, [authenticated, navigate]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ??
    import.meta.env.PUBLIC_SUPABASE_URL ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
    import.meta.env.REACT_APP_SUPABASE_URL;
  const supabaseKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.REACT_APP_SUPABASE_ANON_KEY;
  const envReady = Boolean(supabaseUrl && supabaseKey);

  async function runDbSync() {
    const syncPricing = usePricingStore.getState().syncToDatabase();
    const syncContent = useSiteContentStore.getState().syncToDatabase();
    const syncOrders = useOrdersStore.getState().syncToDatabase();
    const results = await Promise.allSettled([syncPricing, syncContent, syncOrders]);
    const [pricingRes, contentRes, ordersRes] = results;
    const ok = (r: PromiseSettledResult<boolean>) =>
      r.status === "fulfilled" && r.value === true;
    const pricingOk = ok(pricingRes);
    const contentOk = ok(contentRes);
    const ordersOk = ok(ordersRes);
    const errorList: string[] = [];
    if (!pricingOk) errorList.push("Pricing tiers (site_settings.pricing JSONB)");
    if (!contentOk) errorList.push("Content — about / sample projects / contact / terms (site_settings.content JSONB)");
    if (!ordersOk) errorList.push("Orders / completed status / deletes");
    return {
      success: pricingOk && contentOk && ordersOk,
      errorMessage: errorList.length === 0 ? null : errorList.join("  ·  "),
    };
  }

  async function runDiagnostics() {
    setDiagnoseState("running");
    try {
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in env (restart Vite after editing .env.local)");
      }
      const supabase = createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("id, updated_at, pricing, content")
        .eq("id", "main")
        .maybeSingle();
      if (error) throw new Error(`[${error.code}] ${error.message}`);
      if (!data) throw new Error("site_settings row 'main' not found — re-run migration SQL");
      setDiagnoseState({ ok: true, table: "site_settings" });
      setDbSyncFailed(false);
      setTimeout(() => setDiagnoseState(null), 4000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDiagnoseState({ ok: false, error: msg });
      console.error("DB diagnostics failed:", err);
    }
  }

  async function handleSave() {
    if (!isDirty) {
      setSaved("ok");
      setTimeout(() => setSaved(null), 1800);
      return;
    }
    pricingSetTiers(cloneTiers(draftTiers));
    useSiteContentStore.setState({ content: cloneContent(draftContent) });
    initialTiersRef.current = cloneTiers(draftTiers);
    initialContentRef.current = cloneContent(draftContent);

    setSaved("saving");
    const result = await runDbSync();
    if (result.success) {
      setDbSyncFailed(false);
      setSaved("ok");
    } else {
      setDbSyncFailed(true);
      setSaved("warn");
      if (result.errorMessage) {
        setDiagnoseState({ ok: false, error: `Failed to save: ${result.errorMessage}. Check Supabase network or SQL migration.` });
        setTimeout(() => setDiagnoseState(null), 5000);
      }
    }
    setTimeout(() => setSaved(null), 2800);
  }

  function handleDiscard() {
    if (!isDirty) return;
    const ok = window.confirm("Discard unsaved changes? This reverts pricing + content to last saved state.");
    if (!ok) return;
    setDraftTiers(cloneTiers(initialTiersRef.current));
    setDraftContent(cloneContent(initialContentRef.current));
  }

  async function handleResetAll() {
    const ok = window.confirm("Reset all pricing and content to defaults? This cannot be undone (unless you've saved a backup).");
    if (!ok) return;
    resetPricingDefaults();
    resetContentDefaults();
    const freshTiers = usePricingStore.getState().tiers;
    const freshContent = useSiteContentStore.getState().content;
    initialTiersRef.current = cloneTiers(freshTiers);
    initialContentRef.current = cloneContent(freshContent);
    setDraftTiers(cloneTiers(freshTiers));
    setDraftContent(cloneContent(freshContent));
    setSaved("saving");
    const [pricingOk, contentOk] = await Promise.all([
      usePricingStore.getState().syncToDatabase(),
      useSiteContentStore.getState().syncToDatabase(),
    ]);
    const dbOk = pricingOk && contentOk;
    if (dbOk) {
      setDbSyncFailed(false);
      setSaved("ok");
    } else {
      setDbSyncFailed(true);
      setSaved("warn");
    }
    setTimeout(() => setSaved(null), 2800);
  }

  const setAboutBullet = (i: number, value: string) => {
    patchAbout({ bullets: about.bullets.map((b, idx) => (idx === i ? value : b)) });
  };
  const addAboutBullet = () => patchAbout({ bullets: [...about.bullets, "New point"] });
  const removeAboutBullet = (i: number) =>
    patchAbout({ bullets: about.bullets.filter((_, idx) => idx !== i) });

  const setSocial = (id: string, patch: Partial<SocialLink>) =>
    patchContact({
      socials: contact.socials.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  const addSocial = () =>
    patchContact({
      socials: [
        ...contact.socials,
        { id: uid(), platform: "instagram" as const, href: "#" },
      ],
    });
  const removeSocial = (id: string) =>
    patchContact({ socials: contact.socials.filter((s) => s.id !== id) });

  const setProjectOption = (i: number, value: string) =>
    patchContact({
      projectOptions: contact.projectOptions.map((o, idx) => (idx === i ? value : o)),
    });
  const addProjectOption = () =>
    patchContact({ projectOptions: [...contact.projectOptions, "New option"] });
  const removeProjectOption = (i: number) =>
    patchContact({ projectOptions: contact.projectOptions.filter((_, idx) => idx !== i) });

  const setSampleCard = (id: string, patch: Partial<SampleSiteCard>) =>
    setDraftContent((c) => ({
      ...c,
      sampleProjects: {
        ...c.sampleProjects,
        cards: c.sampleProjects.cards.map((card) =>
          card.id === id ? { ...card, ...patch } : card
        ),
      },
    }));
  const addSampleCard = () =>
    setDraftContent((c) => ({
      ...c,
      sampleProjects: {
        ...c.sampleProjects,
        cards: [
          ...c.sampleProjects.cards,
          {
            id: uid(),
            title: "New project",
            description: "Describe this project briefly.",
            imageUrl: "",
            siteUrl: "https://example.com/",
            showViewButton: true,
            viewButtonLabel: "Click to view site",
          },
        ],
      },
    }));

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
          <div className="container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-neon-cyan"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                View site
              </Link>
              <span className="h-5 w-px bg-white/10" />
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-neon-cyan">
                webify Admin
              </p>
              <h1 className="font-display text-xl font-black tracking-tight text-white">
                Content Manager
              </h1>
              {isDirty && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  <AlertTriangle className="h-3 w-3" /> Unsaved
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isDirty && (
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-amber-400/40 hover:text-amber-200"
                >
                  <Undo2 className="h-3.5 w-3.5" /> Discard changes
                </button>
              )}
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-white/20 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset all defaults
              </button>
              {activeTab.href && (
                <Link
                  to={activeTab.href}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-neon-cyan/40 hover:text-neon-cyan"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview {activeTab.label}
                </Link>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saved === "saving"}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all",
                  saved === "saving" && "opacity-80 cursor-wait",
                  saved === "ok"
                    ? "bg-emerald-400 text-ink-950 shadow-[0_0_40px_-10px_rgba(52,211,153,0.8)]"
                    : saved === "warn"
                    ? "bg-amber-400 text-ink-950 shadow-[0_0_40px_-10px_rgba(251,191,36,0.8)]"
                    : isDirty
                    ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-ink-950 shadow-neon hover:shadow-neonLg"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                {saved === "saving" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : saved === "warn" ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : saved === "ok" ? (
                  <Save className="h-3.5 w-3.5" />
                ) : (
                  <Save className={cn("h-3.5 w-3.5", isDirty && "text-ink-950")} />
                )}
                {saved === "saving"
                  ? "Saving…"
                  : saved === "ok"
                  ? "Saved ✓"
                  : saved === "warn"
                  ? "Saved locally (sync DB)"
                  : isDirty
                  ? "Save changes*"
                  : "No changes to save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isDirty) {
                    const ok = window.confirm("Sign out without saving? Unsaved edits will be discarded.");
                    if (!ok) return;
                  }
                  logout();
                  navigate("/webify", { replace: true });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-rose-500/40 hover:text-rose-300"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>

          {isDirty && (
            <div className="container pb-4">
              <div className="flex items-center gap-3 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                You have unsaved edits. Leaving this page or signing out without clicking Save will revert everything.
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-100 hover:bg-amber-400/20"
                >
                  <Undo2 className="h-3 w-3" /> Discard
                </button>
              </div>
            </div>
          )}

          <div className="container pb-4">
            <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 shadow-inner">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all",
                    tab === t.id
                      ? "bg-gradient-to-r from-neon-cyan to-neon-purple text-ink-950 shadow-neon"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {dbSyncFailed && (
          <div className="border-b border-amber-400/20 bg-amber-400/5">
            <div className="container flex flex-col gap-3 py-3 sm:gap-4 sm:py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Changes are saved on this device, but Supabase sync is failing (other users won't see updates yet).
                  </p>
                  <p className="text-xs text-amber-200/80">
                    Tip: apply <span className="font-mono">supabase/migrations/0001_site_content_and_orders.sql</span> in the SQL Editor, or set <span className="font-mono">VITE_SUPABASE_URL</span> + <span className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</span> (or <span className="font-mono">VITE_SUPABASE_ANON_KEY</span>) in <span className="font-mono">.env.local</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={runDiagnostics}
                  disabled={diagnoseState === "running"}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-200 transition-all hover:border-amber-400/50 hover:bg-amber-400/20 disabled:opacity-70"
                >
                  {diagnoseState === "running" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Activity className="h-3.5 w-3.5" />
                  )}
                  {diagnoseState === "running" ? "Running diagnostics…" : "Diagnose DB sync"}
                </button>
              </div>

              <div className="grid gap-2 text-[11px] sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="mb-1 font-bold uppercase tracking-wider text-slate-400">VITE_SUPABASE_URL</p>
                  {supabaseUrl ? (
                    <p className="break-all font-mono text-emerald-300">✅ {supabaseUrl}</p>
                  ) : (
                    <p className="font-mono text-rose-300">❌ missing (edit .env.local)</p>
                  )}
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="mb-1 font-bold uppercase tracking-wider text-slate-400">Publishable / Anon key</p>
                  {supabaseKey ? (
                    <p className="break-all font-mono text-emerald-300">
                      ✅ {supabaseKey.slice(0, 8)}…{supabaseKey.slice(-4)}
                    </p>
                  ) : (
                    <p className="font-mono text-rose-300">❌ missing (edit .env.local)</p>
                  )}
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="mb-1 font-bold uppercase tracking-wider text-slate-400">Most common fix</p>
                  <p className="text-amber-200/90">
                    {envReady
                      ? "Stop Vite dev server (Ctrl+C) then re-run:  npm run dev   (new .env.local only picked up on restart)"
                      : "Paste your keys into .env.local (see .env.example) then restart Vite with:  npm run dev"}
                  </p>
                </div>
              </div>

              {diagnoseState && diagnoseState !== "running" && (
                <div
                  className={cn(
                    "rounded-xl border p-3 text-xs font-semibold",
                    diagnoseState.ok
                      ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-200"
                      : "border-rose-400/30 bg-rose-400/5 text-rose-200",
                  )}
                >
                  {diagnoseState.ok ? (
                    <>✅ Diagnostics OK — connected to table <span className="font-mono">{(diagnoseState as { ok: true; table: string }).table}</span>. Click Save changes now.</>
                  ) : (
                    <>❌ DB error: <span className="break-all font-mono">{(diagnoseState as { ok: false; error: string }).error}</span></>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <main className="container flex-1 py-10">
          {tab === "pricing" && (
            <>
              <div className="glass-pill mb-8 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    Pricing editor
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                    Update tier titles, icons, features & feature icons
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    The tiers below render exactly as visitors see them. Edits stay as draft — click Save above to publish.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 sm:justify-end">
                  <span className={cn("inline-flex h-2 w-2 rounded-full", isDirty ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]" : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]")} />
                  {isDirty ? "Draft only" : "In sync"} with{" "}
                  <Link to="/pricing" className="text-neon-cyan hover:underline">
                    /pricing
                  </Link>
                  <span className="mx-2 hidden h-4 w-px bg-white/10 sm:inline-block" />
                  <button
                    type="button"
                    onClick={() =>
                      setDraftTiers((prev) => {
                        const next = [...prev, makeNewTier(prev.length)];
                        if (next.filter((t) => t.popular).length === 0) {
                          const i = next.findIndex((t) => t.accent === "highlight");
                          if (i >= 0) next[i] = { ...next[i], popular: true };
                        }
                        return next;
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 text-[11px] font-bold text-ink-950 shadow-neon transition-all hover:shadow-neonLg"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add bundle
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {draftTiers.map((t) => (
                  <TierEditor
                    key={t.id}
                    tier={t}
                    canRemove={draftTiers.length > 1}
                    onChange={(next) =>
                      setDraftTiers((prev) => prev.map((x) => (x.id === t.id ? next : x)))
                    }
                    onRemove={() =>
                      setDraftTiers((prev) => prev.filter((x) => x.id !== t.id))
                    }
                  />
                ))}
              </div>
            </>
          )}

          {tab === "about" && (
            <div className="grid gap-6 lg:grid-cols-5">
              <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                  About page editor
                </p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                  Set headlines, description & selling points
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  The description below preserves line breaks exactly as you type them. Unsaved drafts stay only in this tab.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Eyebrow
                    </span>
                    <input
                      type="text"
                      value={about.eyebrow}
                      onChange={(e) => patchAbout({ eyebrow: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Gradient headline word
                    </span>
                    <input
                      type="text"
                      value={about.titleHighlight}
                      onChange={(e) => patchAbout({ titleHighlight: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Description
                    </span>
                    <textarea
                      rows={5}
                      value={about.description}
                      onChange={(e) => patchAbout({ description: e.target.value })}
                      className={inputCls + " font-sans leading-relaxed"}
                    />
                  </label>
                </div>
              </section>

              <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                      Selling points
                    </p>
                    <h3 className="mt-1 font-display text-xl font-black tracking-tight">
                      Why webify bullets
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={addAboutBullet}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add bullet
                  </button>
                </div>

                <ul className="mt-6 space-y-3">
                  {about.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => setAboutBullet(i, e.target.value)}
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => removeAboutBullet(i)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {tab === "contact" && (
            <div className="grid gap-6 lg:grid-cols-5">
              <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                  Contact Information
                </p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                  Copy, links & socials
                </h2>

                <div className="mt-8 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Eyebrow
                    </span>
                    <input
                      type="text"
                      value={contact.eyebrow}
                      onChange={(e) => patchContact({ eyebrow: e.target.value })}
                      className={inputCls}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Left-card title
                    </span>
                    <input
                      type="text"
                      value={contact.introTitle}
                      onChange={(e) => patchContact({ introTitle: e.target.value })}
                      className={inputCls}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Intro paragraph
                    </span>
                    <textarea
                      rows={3}
                      value={contact.intro}
                      onChange={(e) => patchContact({ intro: e.target.value })}
                      className={inputCls}
                    />
                  </label>

                  <InfoField
                    label="Phone"
                    icon={<Phone className="h-4 w-4 text-neon-cyan" />}
                    labelValue={contact.phoneLabel}
                    value={contact.phone}
                    onChangeLabel={(v) => patchContact({ phoneLabel: v })}
                    onChangeValue={(v) => patchContact({ phone: v })}
                  />

                  <InfoField
                    label="Email"
                    icon={<Mail className="h-4 w-4 text-neon-purple" />}
                    labelValue={contact.emailLabel}
                    value={contact.email}
                    onChangeLabel={(v) => patchContact({ emailLabel: v })}
                    onChangeValue={(v) => patchContact({ email: v })}
                  />
                </div>

                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                        Social links
                      </p>
                      <h3 className="mt-1 font-display text-lg font-black tracking-tight">
                        {contact.followTitle}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={addSocial}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {contact.socials.map((s) => (
                      <SocialRow
                        key={s.id}
                        social={s}
                        onChangeLabel={(platform) => setSocial(s.id, { platform })}
                        onChangeHref={(href) => setSocial(s.id, { href })}
                        onRemove={() => removeSocial(s.id)}
                      />
                    ))}
                    {contact.socials.length === 0 && (
                      <li className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                        No socials yet — click Add to add one.
                      </li>
                    )}
                  </ul>
                </div>
              </section>

              <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                  Message form
                </p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                  Form title, project options & WhatsApp number
                </h2>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Right-card title
                    </span>
                    <input
                      type="text"
                      value={contact.formTitle}
                      onChange={(e) => patchContact({ formTitle: e.target.value })}
                      className={inputCls}
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      <span>WhatsApp number (international, no +)</span>
                      <span className="font-normal text-slate-500 tracking-normal">
                        used for the send button
                      </span>
                    </span>
                    <input
                      type="text"
                      value={contact.whatsappNumber}
                      onChange={(e) => patchContact({ whatsappNumber: e.target.value })}
                      placeholder="96181193419"
                      className={inputCls}
                    />
                  </label>
                </div>

                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                        Project type dropdown
                      </p>
                      <h3 className="mt-1 font-display text-lg font-black tracking-tight">
                        Options list
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={addProjectOption}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-neon-cyan/50 hover:text-neon-cyan"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add option
                    </button>
                  </div>

                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {contact.projectOptions.map((o, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5"
                      >
                        <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={o}
                          onChange={(e) => setProjectOption(i, e.target.value)}
                          className={inputCls + " py-2.5"}
                        />
                        <button
                          type="button"
                          onClick={() => removeProjectOption(i)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                    {contact.projectOptions.length === 0 && (
                      <li className="sm:col-span-2 rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
                        No options yet.
                      </li>
                    )}
                  </ul>
                </div>
              </section>
            </div>
          )}

          {tab === "samples" && (
            <>
              <div className="glass-pill mb-8 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    Sample Projects editor
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                    Showcase cards — photo, title, description & view button
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Upload project cards. Each card shows a photo with an optional "Click to view site" button overlay. Drafts unsaved until Save.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 sm:justify-end">
                  <span className={cn("inline-flex h-2 w-2 rounded-full", isDirty ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]" : "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]")} />
                  {isDirty ? "Draft only" : "In sync"} with{" "}
                  <Link to="/sample-projects" className="text-neon-cyan hover:underline">
                    /sample-projects
                  </Link>
                  <span className="mx-2 hidden h-4 w-px bg-white/10 sm:inline-block" />
                  <button
                    type="button"
                    onClick={addSampleCard}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-2 text-[11px] font-bold text-ink-950 shadow-neon transition-all hover:shadow-neonLg"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add card
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-5">
                <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    Page intro
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-white">
                    Headline copy
                  </h3>

                  <div className="mt-6 space-y-5">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Eyebrow
                      </span>
                      <input
                        type="text"
                        value={sampleProjects.eyebrow}
                        onChange={(e) => patchSampleProjects({ eyebrow: e.target.value } as never)}
                        className={inputCls}
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Headline prefix
                        </span>
                        <input
                          type="text"
                          value={sampleProjects.title}
                          onChange={(e) => patchSampleProjects({ title: e.target.value } as never)}
                          className={inputCls}
                          placeholder="Sites we've"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Gradient word
                        </span>
                        <input
                          type="text"
                          value={sampleProjects.titleHighlight}
                          onChange={(e) => patchSampleProjects({ titleHighlight: e.target.value } as never)}
                          className={inputCls}
                          placeholder="shipped for clients"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Subtitle
                      </span>
                      <textarea
                        rows={3}
                        value={sampleProjects.subtitle}
                        onChange={(e) => patchSampleProjects({ subtitle: e.target.value } as never)}
                        className={inputCls}
                      />
                    </label>
                  </div>
                </section>

                <section className="lg:col-span-3">
                  <div className="grid gap-5 md:grid-cols-2">
                    {sampleProjects.cards.length === 0 && (
                      <div className="glass-pill md:col-span-2 rounded-3xl p-8 text-center text-sm text-slate-400">
                        No cards yet — click <b className="text-white">"Add card"</b> above.
                      </div>
                    )}
                    {sampleProjects.cards.map((card) => (
                      <SampleCardEditor
                        key={card.id}
                        card={card}
                        onChange={(next) => setSampleCard(card.id, next)}
                        onRemove={() =>
                          setDraftContent((c) => ({
                            ...c,
                            sampleProjects: {
                              ...c.sampleProjects,
                              cards: c.sampleProjects.cards.filter((x) => x.id !== card.id),
                            },
                          }))
                        }
                      />
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {tab === "orders" && (
            <>
              <div className="glass-pill mb-8 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    Orders inbox
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                    Customer bundle orders
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Mark a project as <span className="font-semibold text-white">Completed</span> to collapse its card and hide details like notes & features.
                    Delete an order to remove it permanently — there's no recycle bin.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-slate-500">Total orders</p>
                    <p className="mt-1 font-display text-xl font-black text-white">
                      {orders.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-slate-500">Completed</p>
                    <p className="mt-1 font-display text-xl font-black text-emerald-300">
                      {orders.filter((o) => o.completed).length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <p className="text-slate-500">Next order code</p>
                    <p className="mt-1 font-display text-base font-black text-white">
                      {formatOrderCode(nextSequenceNumber, "Bundle Name")}
                    </p>
                  </div>
                </div>
              </div>

              {orders.length > 0 ? (
                <div className="grid gap-4">
                  {orders.map((order) =>
                    order.completed ? (
                      <article
                        key={order.id}
                        className="flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                                {order.orderCode}
                              </p>
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Completed
                              </span>
                            </div>
                            <h3 className="mt-1 truncate font-display text-sm font-bold text-white sm:text-base">
                              {order.siteName} · <span className="font-semibold text-slate-300">{order.bundleName}</span>
                            </h3>
                          </div>
                        </div>
                        <p className="pl-12 text-[11px] text-slate-500 sm:pl-0 sm:text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:pl-2">
                          <button
                            type="button"
                            onClick={() => setOrderCompleted(order.id, false)}
                            title="Mark as not completed — restore details"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-all hover:border-neon-cyan/40 hover:text-neon-cyan"
                          >
                            <Circle className="h-3.5 w-3.5" /> Re-open
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const ok = window.confirm(
                                `Delete order ${order.orderCode} (${order.siteName}) permanently?\n\nThis cannot be undone — there is no recycle bin.`
                              );
                              if (!ok) return;
                              deleteOrder(order.id);
                            }}
                            title="Permanently delete this order (no recycle bin)"
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-300 transition-all hover:border-rose-500/60 hover:text-rose-200"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </article>
                    ) : (
                      <article
                        key={order.id}
                        className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex flex-1 items-start gap-3">
                            <button
                              type="button"
                              onClick={() => setOrderCompleted(order.id, true)}
                              title="Mark project as completed (collapses card, hides details)"
                              className="group/complete inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"
                            >
                              <Circle className="h-4 w-4 transition-all group-hover/complete:hidden" />
                              <CheckCircle2 className="hidden h-4 w-4 transition-all group-hover/complete:block" />
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neon-cyan">
                                  {order.orderCode}
                                </p>
                                <span className="inline-flex items-center gap-1 rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-neon-cyan/90">
                                  Open
                                </span>
                              </div>
                              <h3 className="mt-2 font-display text-xl font-black tracking-tight text-white">
                                {order.siteName}
                              </h3>
                              <p className="mt-1 text-sm text-slate-400">
                                {order.bundleName} bundle
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-slate-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setOrderCompleted(order.id, true)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 transition-all hover:border-emerald-400/60 hover:text-emerald-200"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Mark completed
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const ok = window.confirm(
                                    `Delete order ${order.orderCode} (${order.siteName}) permanently?\n\nThis cannot be undone — there is no recycle bin.`
                                  );
                                  if (!ok) return;
                                  deleteOrder(order.id);
                                }}
                                title="Permanently delete this order (no recycle bin)"
                                className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-300 transition-all hover:border-rose-500/60 hover:text-rose-200"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Customer name
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {order.customerName}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Customer number
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {order.customerPhone}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Site name
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {order.siteName}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Bundle code
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">
                              {order.orderCode}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1.4fr,1fr]">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Notes
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {order.notes || "No notes added."}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Bundle features
                            </p>
                            <ul className="mt-2 space-y-2 text-sm text-slate-300">
                              {order.bundleFeatures.map((feature, index) => (
                                <li key={`${order.id}-${index}`} className="flex gap-2">
                                  <span className="text-neon-cyan">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div className="glass-pill rounded-3xl p-10 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    No orders yet
                  </p>
                  <p className="mt-3 text-sm text-slate-400">
                    When a customer submits a bundle from the pricing page,
                    their order will show up here with the generated PN code.
                  </p>
                </div>
              )}
            </>
          )}

          {tab === "terms" && (
            <div className="grid gap-6 lg:grid-cols-5">
              <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                  Terms of Service
                </p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                  Page headline
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Controls the eyebrow, gradient title and intro paragraph shown above the body on <Link to="/terms" className="text-neon-cyan hover:underline">/terms</Link>.
                </p>

                <div className="mt-6 space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Eyebrow
                    </span>
                    <input
                      type="text"
                      value={terms.eyebrow}
                      onChange={(e) => patchTerms({ eyebrow: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Title
                      </span>
                      <input
                        type="text"
                        value={terms.title}
                        onChange={(e) => patchTerms({ title: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        Gradient word
                      </span>
                      <input
                        type="text"
                        value={terms.titleHighlight}
                        onChange={(e) => patchTerms({ titleHighlight: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Intro
                    </span>
                    <textarea
                      rows={3}
                      value={terms.intro}
                      onChange={(e) => patchTerms({ intro: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                </div>
              </section>

              <section className="glass-pill rounded-3xl p-6 sm:p-8 lg:col-span-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                      Body
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-black tracking-tight">
                      Terms content
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Separate paragraphs with a blank line. Line breaks are preserved.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => patchTerms({ body: TERMS_TEMPLATE_BODY })}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-all hover:border-neon-cyan/40 hover:text-neon-cyan"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Restore template
                  </button>
                </div>

                <label className="mt-6 block">
                  <textarea
                    rows={28}
                    value={terms.body}
                    onChange={(e) => patchTerms({ body: e.target.value })}
                    className={inputCls + " font-mono text-[13px] leading-6"}
                  />
                </label>
              </section>
            </div>
          )}
        </main>

        <footer className="border-t border-white/5 py-6">
          <div className="container flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} webify · Admin dashboard</p>
            <p>
              {isDirty
                ? "Draft only — edits are LOCAL to this browser tab. Click Save above to publish."
                : "Live data loaded from last saved state."}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SampleCardEditor({
  card,
  onChange,
  onRemove,
}: {
  card: SampleSiteCard;
  onChange: (patch: Partial<SampleSiteCard>) => void;
  onRemove: () => void;
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function compressImage(
    file: File,
    maxSizeBytes = 600_000,
    maxEdgePx = 1600,
    qualityStart = 0.82
  ): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image file"));
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string") {
          reject(new Error("Image reader produced no data"));
          return;
        }
        const img = new Image();
        img.onerror = () => reject(new Error("Could not decode image"));
        img.onload = () => {
          let { naturalWidth: w, naturalHeight: h } = img;
          const maxSide = Math.max(w, h);
          if (maxSide > maxEdgePx) {
            const scale = maxEdgePx / maxSide;
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(result);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);

          const type = file.type === "image/png" ? "image/png" : "image/webp";
          const fallbackType = file.type === "image/png" ? "image/png" : "image/jpeg";

          const tryQuality = (q: number, useType: string): Promise<string> =>
            new Promise((resQ, rejQ) => {
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    rejQ(new Error("Could not encode image"));
                    return;
                  }
                  const r2 = new FileReader();
                  r2.onerror = () => rejQ(new Error("Could not re-read blob"));
                  r2.onload = () => {
                    const out = r2.result;
                    if (typeof out !== "string") {
                      rejQ(new Error("Blob reader produced no data"));
                      return;
                    }
                    if (blob.size <= maxSizeBytes || q <= 0.42) {
                      resQ(out);
                      return;
                    }
                    tryQuality(Math.max(0.42, q - 0.12), useType).then(resQ, rejQ);
                  };
                  r2.readAsDataURL(blob);
                },
                useType,
                q
              );
            });

          tryQuality(qualityStart, type)
            .then(resolve)
            .catch(() =>
              tryQuality(0.72, fallbackType).then(resolve, () => resolve(result))
            );
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setUploadError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 18 * 1024 * 1024) {
      setUploadError("File is too large (max 18 MB). Pick a smaller image.");
      return;
    }
    try {
      const compressed = await compressImage(file);
      onChange({ imageUrl: compressed });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(msg || "Failed to process image. Try a different file.");
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 text-neon-cyan ring-1 ring-white/10">
              <LayoutGrid className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={card.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Project title…"
                className={inputCls + " py-2 font-bold"}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
          title="Remove card"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          <ImageIcon className="h-3.5 w-3.5" /> Project Image
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative aspect-[4/3] w-full max-w-[180px] flex-none overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                No image
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition-all hover:border-neon-cyan/50 hover:text-neon-cyan">
              <ImageIcon className="h-4 w-4" />
              Upload JPG, PNG, WEBP...
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs leading-5 text-slate-500">
              Choose an image from your device. Compressed automatically (max 600 KB) before save.
            </p>
            {uploadError ? (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200">
                {uploadError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => onChange({ imageUrl: "" })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
            >
              Remove image
            </button>
          </div>
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Description
        </span>
        <textarea
          rows={3}
          value={card.description}
          onChange={(e) => onChange({ description: e.target.value })}
          className={inputCls}
          placeholder="What is this project, who was it for, and what did we ship?"
        />
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          <LinkIcon className="h-3.5 w-3.5" /> Live site URL
        </span>
        <input
          type="url"
          value={card.siteUrl}
          onChange={(e) => onChange({ siteUrl: e.target.value })}
          className={inputCls}
          placeholder="https://example.com/"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <label className="flex items-center gap-3 text-xs text-slate-300">
          <button
            type="button"
            onClick={() => onChange({ showViewButton: !card.showViewButton })}
            className={cn(
              "text-neon-cyan transition-all",
              card.showViewButton ? "text-neon-cyan" : "text-slate-600"
            )}
            title="Toggle view button"
          >
            {card.showViewButton ? (
              <ToggleRight className="h-6 w-6" />
            ) : (
              <ToggleLeft className="h-6 w-6" />
            )}
          </button>
          <span>
            Button overlay{" "}
            <b className={card.showViewButton ? "text-neon-cyan" : "text-slate-500"}>
              {card.showViewButton ? "ON" : "OFF"}
            </b>{" "}
            (top corner of photo)
          </span>
        </label>
        <input
          type="text"
          value={card.viewButtonLabel}
          onChange={(e) => onChange({ viewButtonLabel: e.target.value })}
          className={inputCls + " max-w-[240px] py-2 text-xs"}
          placeholder="Click to view site"
        />
      </div>
    </article>
  );
}

function InfoField({
  label,
  icon,
  labelValue,
  value,
  onChangeLabel,
  onChangeValue,
}: {
  label: string;
  icon: React.ReactNode;
  labelValue: string;
  value: string;
  onChangeLabel: (v: string) => void;
  onChangeValue: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          {icon}
        </span>
        <input
          type="text"
          value={labelValue}
          onChange={(e) => onChangeLabel(e.target.value)}
          className={inputCls + " py-2"}
          aria-label={`${label} label`}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        className={inputCls + " mt-3 py-2 font-bold"}
        aria-label={`${label} value`}
      />
    </div>
  );
}

function SocialRow({
  social,
  onChangeLabel,
  onChangeHref,
  onRemove,
}: {
  social: SocialLink;
  onChangeLabel: (p: SocialLink["platform"]) => void;
  onChangeHref: (v: string) => void;
  onRemove: () => void;
}) {
  const platforms = [
    "instagram",
    "facebook",
    "twitter",
    "tiktok",
    "linkedin",
    "youtube",
    "whatsapp",
  ] as const;
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 text-slate-200">
        <SocialIcon platform={social.platform} className="h-4 w-4" />
      </span>
      <select
        value={social.platform}
        onChange={(e) => onChangeLabel(e.target.value as SocialLink["platform"])}
        className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-neon-cyan/50"
        aria-label="Social platform"
      >
        {platforms.map((p) => (
          <option key={p} value={p} className="bg-ink-900">
            {SOCIAL_LABELS[p]}
          </option>
        ))}
      </select>
      <input
        type="url"
        value={social.href}
        onChange={(e) => onChangeHref(e.target.value)}
        placeholder="https://…"
        className={inputCls + " py-2.5"}
      />
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}
