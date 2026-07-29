import { type FormEvent, useState } from "react";
import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import AdminAccessLink from "@/components/AdminAccessLink";
import Navbar from "@/components/Navbar";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { usePricingStore } from "@/store/pricing";
import type { PricingTier, TierAccent } from "@/store/pricing";
import { useSiteContentStore } from "@/store/siteContent";
import { buildWhatsAppLink } from "@/lib/utils";
import { formatOrderCode, useOrdersStore } from "@/store/orders";

type OrderFormState = {
  customerName: string;
  customerPhone: string;
  siteName: string;
  notes: string;
};

const EMPTY_ORDER_FORM: OrderFormState = {
  customerName: "",
  customerPhone: "",
  siteName: "",
  notes: "",
};

const createEmptyOrderForm = (): OrderFormState => ({ ...EMPTY_ORDER_FORM });

function accentClasses(accent: TierAccent) {
  if (accent === "cyan") {
    return {
      ring: "ring-neon-cyan/40 hover:ring-neon-cyan/70",
      glow: "shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_20px_70px_-20px_rgba(0,240,255,0.55)]",
      badgeBg: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
      button:
        "bg-white text-ink-950 hover:bg-neon-cyan hover:text-ink-950 shadow-[0_10px_30px_-10px_rgba(0,240,255,0.6)]",
      accentText: "text-neon-cyan",
      iconWrap:
        "bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40",
    };
  }
  if (accent === "purple") {
    return {
      ring: "ring-neon-purple/40 hover:ring-neon-purple/70",
      glow: "shadow-[0_0_0_1px_rgba(168,85,247,0.25),0_20px_70px_-20px_rgba(168,85,247,0.5)]",
      badgeBg: "bg-neon-purple/15 text-neon-purple border-neon-purple/30",
      button:
        "bg-white text-ink-950 hover:bg-neon-purple hover:text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.55)]",
      accentText: "text-neon-purple",
      iconWrap:
        "bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/40",
    };
  }
  return {
    ring: "ring-neon-cyan/60 hover:ring-neon-cyan",
    glow: "shadow-[0_0_0_1px_rgba(0,240,255,0.55),0_30px_100px_-20px_rgba(0,240,255,0.55),0_0_120px_-10px_rgba(168,85,247,0.35)]",
    badgeBg: "text-ink-950 border-transparent",
    button:
      "bg-neon-cyan text-ink-950 hover:brightness-110 shadow-neonLg",
    accentText: "text-gradient-cyber",
    iconWrap:
      "bg-gradient-to-br from-neon-cyan to-neon-purple text-ink-950 shadow-neon",
  };
}

export default function Pricing() {
  const tiers = usePricingStore((s) => s.tiers);
  const whatsappNumber = useSiteContentStore(
    (s) => s.content.contact.whatsappNumber
  );
  const createOrder = useOrdersStore((s) => s.createOrder);
  const nextSequenceNumber = useOrdersStore((s) => s.nextSequenceNumber);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [orderForm, setOrderForm] = useState<OrderFormState>(createEmptyOrderForm);

  const nextOrderCode = selectedTier
    ? formatOrderCode(nextSequenceNumber, selectedTier.name)
    : "";

  function openOrderModal(tier: PricingTier) {
    setSelectedTier(tier);
    setOrderForm(createEmptyOrderForm());
  }

  function closeOrderModal() {
    setSelectedTier(null);
    setOrderForm(createEmptyOrderForm());
  }

  function updateOrderForm<K extends keyof OrderFormState>(
    key: K,
    value: OrderFormState[K]
  ) {
    setOrderForm((current) => ({ ...current, [key]: value }));
  }

  function handleOrderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTier) return;

    const order = createOrder({
      bundleId: selectedTier.id,
      bundleName: selectedTier.name,
      customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone,
      siteName: orderForm.siteName,
      notes: orderForm.notes,
      bundleFeatures: selectedTier.features.map((feature) => feature.text),
    });

    const lines = [
      `*New webify bundle order*`,
      ``,
      `Order number: ${order.orderCode}`,
      `Bundle chosen: ${order.bundleName}`,
      `Customer name: ${order.customerName}`,
      `Customer phone: ${order.customerPhone}`,
      `Site name: ${order.siteName}`,
      `Requested notes: ${order.notes || "None provided"}`,
      ``,
      `Bundle features:`,
      ...order.bundleFeatures.map((feature) => `- ${feature}`),
    ];

    const whatsappLink = whatsappNumber.trim()
      ? buildWhatsAppLink(lines, whatsappNumber.trim())
      : buildWhatsAppLink(lines);

    window.open(whatsappLink, "_blank", "noreferrer");
    closeOrderModal();
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <section className="container py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p
                className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-neon-cyan sm:px-4 sm:text-xs sm:tracking-[0.32em]"
                style={{ animationDelay: "0.05s" }}
              >
                Transparent Packages
                <span className="h-1 w-1 rounded-full bg-neon-cyan/70" />
                No Hidden Fees
              </p>

              <h2
                className="animate-fadeUp mt-6 text-balance font-display font-black leading-[1.02] tracking-tight text-white"
                style={{
                  animationDelay: "0.15s",
                  fontSize: "clamp(1.95rem, 7.6vw, 4.2rem)",
                  textShadow: "0 0 60px rgba(0,240,255,0.1)",
                }}
              >
                Pricing crafted for{" "}
                <span className="text-gradient-cyber">every occasion</span>
              </h2>

              <p
                className="animate-fadeUp mt-6 text-base sm:text-lg text-slate-300/90"
                style={{ animationDelay: "0.25s" }}
              >
                Every package is tuned to your goals, scale, and brand. Start
                with a tier — we craft a website that feels distinctly yours.
              </p>
            </div>

            <div className="mt-14 flex flex-wrap items-start justify-center gap-6 md:gap-7">
              {(() => {
                const mainTiers = tiers.filter(
                  (t) => t.name !== "Mandatory Maintenance Fees"
                );
                const maintenanceTier = tiers.find(
                  (t) => t.name === "Mandatory Maintenance Fees"
                );
                return (
                  <>
                    {mainTiers.map((tier, i) => {
                      const c = accentClasses(tier.accent);
                      return (
                        <article
                          key={tier.id}
                          className={`animate-fadeUp group relative flex w-full max-w-sm flex-col rounded-3xl bg-white/[0.04] p-7 ring-1 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 md:max-w-[400px] md:flex-1 md:min-w-[320px] md:p-8 ${c.ring} ${tier.popular ? c.glow : "shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"}`}
                          style={{ animationDelay: `${0.35 + i * 0.1}s` }}
                        >
                          {tier.popular && (
                            <div
                              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] bg-gradient-to-r from-neon-cyan to-neon-purple text-ink-950 shadow-neon"
                            >
                              Most Popular
                            </div>
                          )}

                          <header>
                            <div
                              className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${c.iconWrap}`}
                            >
                              <Icon name={tier.iconName} className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 font-display text-xl font-extrabold tracking-tight text-white">
                              {tier.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-400">
                              {tier.tagline}
                            </p>
                          </header>

                          <div className="mt-6 flex items-end gap-2">
                            <span
                              className={`font-display text-3xl font-black ${c.accentText}`}
                            >
                              {tier.price}
                            </span>
                            <span className="mb-1 text-sm text-slate-400">
                              {tier.period}
                            </span>
                          </div>

                          <ul className="mt-7 space-y-3.5 text-sm text-slate-300">
                            {tier.features.map((f) => (
                              <li key={f.id} className="flex gap-3">
                                <span
                                  className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border ${c.badgeBg}`}
                                >
                                  <Icon
                                    name={f.iconName}
                                    fallback="Check"
                                    className="h-3 w-3"
                                    strokeWidth={2.6}
                                  />
                                </span>
                                <span>{f.text}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-8 pt-6 border-t border-white/10">
                            <button
                              type="button"
                              onClick={() => openOrderModal(tier)}
                              className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${c.button}`}
                            >
                              {tier.cta}
                              <ArrowRight
                                className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                                strokeWidth={2.8}
                              />
                            </button>
                            <p className="mt-3 text-center text-xs text-slate-500">
                              Add your site name, phone number, and notes before
                              sending your order on WhatsApp.{" "}
                              <Link
                                to="/"
                                className="text-neon-cyan/90 underline-offset-4 hover:underline"
                              >
                                return home
                              </Link>
                            </p>
                          </div>
                        </article>
                      );
                    })}

                    {maintenanceTier && (() => {
                      const tier = maintenanceTier;
                      const i = mainTiers.length;
                      const c = accentClasses(tier.accent);
                      return (
                        <div
                          className="mt-6 w-full md:mt-10"
                          key={tier.id}
                        >
                          <div className="mx-auto flex w-full max-w-3xl justify-center">
                            <article
                              className={`animate-fadeUp group relative flex w-full max-w-md flex-col rounded-3xl bg-white/[0.04] p-7 ring-1 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 md:max-w-[480px] md:p-9 ${c.ring} shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]`}
                              style={{ animationDelay: `${0.35 + i * 0.1}s` }}
                            >
                              <header>
                                <div
                                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${c.iconWrap}`}
                                >
                                  <Icon name={tier.iconName} className="h-5 w-5" />
                                </div>
                                <h3 className="mt-5 font-display text-xl font-extrabold tracking-tight text-white">
                                  {tier.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                  {tier.tagline}
                                </p>
                              </header>

                              <div className="mt-6 flex items-end gap-2">
                                <span
                                  className={`font-display text-3xl font-black ${c.accentText}`}
                                >
                                  {tier.price}
                                </span>
                                <span className="mb-1 text-sm text-slate-400">
                                  {tier.period}
                                </span>
                              </div>

                              <ul className="mt-7 space-y-3.5 text-sm text-slate-300">
                                {tier.features.map((f) => (
                                  <li key={f.id} className="flex gap-3">
                                    <span
                                      className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border ${c.badgeBg}`}
                                    >
                                      <Icon
                                        name={f.iconName}
                                        fallback="Check"
                                        className="h-3 w-3"
                                        strokeWidth={2.6}
                                      />
                                    </span>
                                    <span>{f.text}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="mt-8 pt-6 border-t border-white/10">
                                <button
                                  type="button"
                                  onClick={() => openOrderModal(tier)}
                                  className={`group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${c.button}`}
                                >
                                  {tier.cta}
                                  <ArrowRight
                                    className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                                    strokeWidth={2.8}
                                  />
                                </button>
                                <p className="mt-3 text-center text-xs text-slate-500">
                                  Add your site name, phone number, and notes before
                                  sending your order on WhatsApp.{" "}
                                  <Link
                                    to="/"
                                    className="text-neon-cyan/90 underline-offset-4 hover:underline"
                                  >
                                    return home
                                  </Link>
                                </p>
                              </div>
                            </article>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </div>

            <div
              className="animate-fadeUp mx-auto mt-16 max-w-3xl"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="glass-pill flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    Not sure which fits?
                  </p>
                  <p className="mt-1 font-display text-xl font-bold text-white">
                    Browse sample projects we've shipped for real clients.
                  </p>
                </div>
                <Link
                  to="/sample-projects"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-neon-cyan hover:shadow-neon"
                >
                  View Sample Projects
                  <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-8">
          <div className="container flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} webify — Where You Trust Professionals.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:justify-end sm:gap-5">
              <Link to="/about" className="hover:text-neon-cyan">About</Link>
              <Link to="/sample-projects" className="hover:text-neon-cyan">Sample Projects</Link>
              <Link to="/pricing" className="hover:text-neon-cyan">Pricing</Link>
              <Link to="/contact" className="hover:text-neon-cyan">Contact</Link>
              <Link to="/terms" className="hover:text-neon-cyan">Terms</Link>
              <AdminAccessLink className="font-semibold text-neon-cyan/90 hover:text-neon-cyan">
                admin
              </AdminAccessLink>
            </div>
          </div>
        </footer>
      </div>

      {selectedTier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-950/85 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center px-4 py-6 sm:py-8">
            <div className="my-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#070b14]/95 p-5 shadow-[0_25px_120px_rgba(0,0,0,0.65)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                  Bundle order
                </p>
                <h3 className="mt-2 font-display text-2xl font-black tracking-tight text-white">
                  {selectedTier.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Order number:{" "}
                  <span className="font-semibold text-white">{nextOrderCode}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeOrderModal}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-white/20 hover:text-white"
                aria-label="Close order form"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleOrderSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Customer name
                  </span>
                  <input
                    type="text"
                    required
                    value={orderForm.customerName}
                    onChange={(e) => updateOrderForm("customerName", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                    placeholder="Your full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Customer phone
                  </span>
                  <input
                    type="text"
                    required
                    value={orderForm.customerPhone}
                    onChange={(e) => updateOrderForm("customerPhone", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                    placeholder="+961..."
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Site name
                </span>
                <input
                  type="text"
                  required
                  value={orderForm.siteName}
                  onChange={(e) => updateOrderForm("siteName", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                  placeholder="Business or website name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Notes
                </span>
                <textarea
                  rows={5}
                  value={orderForm.notes}
                  onChange={(e) => updateOrderForm("notes", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                  placeholder="Tell us what you want, special requests, colors, pages, or features."
                />
              </label>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                  Included bundle features
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {selectedTier.features.map((feature) => (
                    <li key={feature.id} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
                        <Icon
                          name={feature.iconName}
                          fallback="Check"
                          className="h-3 w-3"
                          strokeWidth={2.6}
                        />
                      </span>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeOrderModal}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-white/20 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-6 py-3 text-sm font-bold text-ink-950 shadow-neon transition-all hover:shadow-neonLg"
                >
                  Send Order on WhatsApp
                  <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
