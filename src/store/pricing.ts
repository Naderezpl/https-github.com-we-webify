import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TierAccent = "cyan" | "purple" | "highlight";

export type PricingFeature = {
  id: string;
  text: string;
  iconName: string;
};

export type PricingTier = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  accent: TierAccent;
  iconName: string;
  popular?: boolean;
  features: PricingFeature[];
  cta: string;
};

export const DEFAULT_TIER_ICON_NAMES = [
  "Sparkles",
  "Zap",
  "Crown",
  "Rocket",
  "Layers",
  "Building2",
  "Globe",
  "Lightbulb",
  "Palmtree",
  "Music",
  "PartyPopper",
  "Sparkle",
  "Gem",
  "ShieldCheck",
  "Puzzle",
  "WandSparkles",
  "Flame",
  "Star",
  "Target",
  "Mountain",
  "Box",
  "ShoppingBag",
  "Users",
  "Radar",
  "Radio",
  "Check",
] as const;

export type TierIconName = (typeof DEFAULT_TIER_ICON_NAMES)[number];

const uid = () =>
  (crypto?.randomUUID?.() ??
    Math.random().toString(36).slice(2) + Date.now().toString(36));

const defaultTiers: PricingTier[] = [
  {
    id: uid(),
    name: "Basic",
    tagline: "Fast, high-converting single-page sites",
    price: "from $690",
    period: "per project",
    accent: "cyan",
    iconName: "Rocket",
    features: [
      { id: uid(), text: "1-page responsive design (hero + 4 sections)", iconName: "Layers" },
      { id: uid(), text: "Performance-optimized Vite build (95+ Lighthouse)", iconName: "Zap" },
      { id: uid(), text: "Contact form, analytics, and SEO basics", iconName: "ShieldCheck" },
      { id: uid(), text: "2 design revisions + 1 round of polish", iconName: "Sparkles" },
      { id: uid(), text: "Delivered in 5 business days", iconName: "Target" },
    ],
    cta: "Start Basic",
  },
  {
    id: uid(),
    name: "Professional",
    tagline: "E-commerce, dashboards & large builds",
    price: "from $4,490",
    period: "scoped project",
    accent: "purple",
    iconName: "Building2",
    popular: true,
    features: [
      { id: uid(), text: "Unlimited pages & custom integrations", iconName: "Globe" },
      { id: uid(), text: "E-commerce (Stripe), dashboards & auth flows", iconName: "ShoppingBag" },
      { id: uid(), text: "Payment + email + CRM webhooks", iconName: "Radio" },
      { id: uid(), text: "Full design system + Storybook components", iconName: "Puzzle" },
      { id: uid(), text: "Technical onboarding & handoff docs", iconName: "BookOpen" },
      { id: uid(), text: "Priority 90-day support SLA", iconName: "ShieldCheck" },
    ],
    cta: "Go Professional",
  },
  {
    id: uid(),
    name: "Mandatory Maintenance Fees",
    tagline: "Hosting, monitoring & upkeep — billed monthly",
    price: "from $50",
    period: "per month",
    accent: "highlight",
    iconName: "ShieldCheck",
    features: [
      { id: uid(), text: "Uptime monitoring & 24/7 alerts", iconName: "Radar" },
      { id: uid(), text: "Weekly backups + rollback", iconName: "ShieldCheck" },
      { id: uid(), text: "Core updates (framework, CMS, plugins, packages)", iconName: "Zap" },
      { id: uid(), text: "Security patches & SSL renewal", iconName: "Lock" },
      { id: uid(), text: "Up to 1 hour of small edits per month", iconName: "WandSparkles" },
      { id: uid(), text: "Email support SLA — reply within 48h", iconName: "Mail" },
    ],
    cta: "Add Maintenance",
  },
];

type PricingState = {
  tiers: PricingTier[];
  setTiers: (tiers: PricingTier[]) => void;
  addTier: () => void;
  removeTier: (id: string) => void;
  updateTier: (id: string, patch: Partial<PricingTier>) => void;
  updateFeature: (
    tierId: string,
    featureId: string,
    patch: Partial<PricingFeature>
  ) => void;
  addFeature: (tierId: string) => void;
  removeFeature: (tierId: string, featureId: string) => void;
  resetDefaults: () => void;
};

export const usePricingStore = create<PricingState>()(
  persist(
    (set) => ({
      tiers: defaultTiers,
      setTiers: (tiers) => set({ tiers }),
      addTier: () =>
        set((s) => {
          const existingIndex = s.tiers.length;
          const accents: TierAccent[] = ["cyan", "highlight", "purple"];
          const accent = accents[existingIndex % accents.length];
          const name =
            accent === "cyan"
              ? "Starter"
              : accent === "highlight"
              ? "Premium"
              : "Enterprise";
          const iconName =
            accent === "cyan"
              ? "Rocket"
              : accent === "highlight"
              ? "Layers"
              : "Building2";
          const price =
            accent === "cyan"
              ? "from $490"
              : accent === "highlight"
              ? "from $2,490"
              : "Custom";
          const period =
            accent === "cyan"
              ? "per project"
              : accent === "highlight"
              ? "per project"
              : "custom quote";

          const nextPopular = s.tiers.some((t) => t.popular)
            ? false
            : accent === "highlight";

          const newTier: PricingTier = {
            id: uid(),
            name: `${name} ${existingIndex + 1}`.replace(/ 1$/, ""),
            tagline:
              "Add a short tagline explaining who this bundle is for.",
            price,
            period,
            accent,
            iconName,
            popular: nextPopular,
            features: [
              { id: uid(), text: "Describe what is included in this tier.", iconName: "Check" },
              { id: uid(), text: "Click + to add more features here.", iconName: "Sparkles" },
            ],
            cta: accent === "purple" ? "Talk to sales" : "Choose plan",
          };
          return { tiers: [...s.tiers, newTier] };
        }),
      removeTier: (id) =>
        set((s) => {
          const next = s.tiers.filter((t) => t.id !== id);
          if (next.length === 0) return s; // keep at least one bundle
          // Ensure we still have at most one popular marked tier
          if (next.filter((t) => t.popular).length <= 1) return { tiers: next };
          const firstPopular = next.findIndex((t) => t.popular);
          return {
            tiers: next.map((t, i) =>
              i === firstPopular ? t : { ...t, popular: false }
            ),
          };
        }),
      updateTier: (id, patch) =>
        set((s) => ({
          tiers: s.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      updateFeature: (tierId, featureId, patch) =>
        set((s) => ({
          tiers: s.tiers.map((t) =>
            t.id !== tierId
              ? t
              : {
                  ...t,
                  features: t.features.map((f) =>
                    f.id === featureId ? { ...f, ...patch } : f
                  ),
                }
          ),
        })),
      addFeature: (tierId) =>
        set((s) => ({
          tiers: s.tiers.map((t) =>
            t.id !== tierId
              ? t
              : {
                  ...t,
                  features: [
                    ...t.features,
                    { id: uid(), text: "New feature", iconName: "Check" },
                  ],
                }
          ),
        })),
      removeFeature: (tierId, featureId) =>
        set((s) => ({
          tiers: s.tiers.map((t) =>
            t.id !== tierId
              ? t
              : {
                  ...t,
                  features: t.features.filter((f) => f.id !== featureId),
                }
          ),
        })),
      resetDefaults: () => set({ tiers: defaultTiers }),
    }),
    {
      name: "webify.pricing.v3",
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 3) {
          return { tiers: defaultTiers };
        }
        return persistedState as { tiers: PricingTier[] };
      },
    }
  )
);
