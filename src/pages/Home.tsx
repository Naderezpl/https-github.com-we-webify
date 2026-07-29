import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import AdminAccessLink from "@/components/AdminAccessLink";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Icon } from "@/components/Icon";
import { usePricingStore, type TierAccent } from "@/store/pricing";
import { useSiteContentStore } from "@/store/siteContent";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import { Link } from "react-router-dom";

function accentClasses(accent: TierAccent) {
  if (accent === "cyan") {
    return {
      ring: "ring-neon-cyan/40 hover:ring-neon-cyan/70",
      glow: "shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_20px_70px_-20px_rgba(0,240,255,0.55)]",
      badgeBg: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
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
      accentText: "text-neon-purple",
      iconWrap:
        "bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/40",
    };
  }
  return {
    ring: "ring-neon-cyan/60 hover:ring-neon-cyan",
    glow: "shadow-[0_0_0_1px_rgba(0,240,255,0.55),0_30px_100px_-20px_rgba(0,240,255,0.55),0_0_120px_-10px_rgba(168,85,247,0.35)]",
    badgeBg: "text-ink-950 border-transparent",
    accentText: "text-gradient-cyber",
    iconWrap:
      "bg-gradient-to-br from-neon-cyan to-neon-purple text-ink-950 shadow-neon",
  };
}

export default function Home() {
  const tiers = usePricingStore((s) => s.tiers);
  const sample = useSiteContentStore((s) => s.content.sampleProjects);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />

          <section className="container py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-neon-cyan sm:px-4 sm:text-xs sm:tracking-[0.32em]">
                Pricing
                <span className="h-1 w-1 rounded-full bg-neon-cyan/70" />
                Live Preview
              </p>
              <h2 className="mt-6 text-balance font-display text-[clamp(1.85rem,7.5vw,3.4rem)] font-black leading-[1.02] tracking-tight text-white">
                Pricing bundles right on the{" "}
                <span className="text-gradient-cyber">home page</span>
              </h2>
              <p className="mt-6 text-base text-slate-300/90 sm:text-lg">
                Visitors can preview your packages immediately, then jump into
                the full pricing page for all details.
              </p>
            </div>

            <div className="mt-14 flex flex-wrap items-start justify-center gap-6 md:gap-7">
              {tiers.map((tier, i) => {
                const c = accentClasses(tier.accent);
                return (
                  <article
                    key={tier.id}
                    className={`group relative flex w-full max-w-sm flex-col rounded-3xl bg-white/[0.04] p-7 ring-1 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 md:max-w-[400px] md:flex-1 md:min-w-[320px] ${c.ring} ${tier.popular ? c.glow : "shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"}`}
                    style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-950 shadow-neon">
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

                    <ul className="mt-7 space-y-3 text-sm text-slate-300">
                      {tier.features.slice(0, 4).map((feature) => (
                        <li key={feature.id} className="flex gap-3">
                          <span
                            className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full border ${c.badgeBg}`}
                          >
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
                  </article>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-neon-cyan hover:shadow-neon"
              >
                View Full Pricing
                <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
              </Link>
            </div>
          </section>

          <section className="container pb-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-neon-cyan sm:px-4 sm:text-xs sm:tracking-[0.32em]">
                Sample Projects
                <span className="h-1 w-1 rounded-full bg-neon-cyan/70" />
                Portfolio Preview
              </p>
              <h2 className="mt-6 text-balance font-display text-[clamp(1.85rem,7.5vw,3.4rem)] font-black leading-[1.02] tracking-tight text-white">
                Showcase{" "}
                <span className="text-gradient-cyber">Sample Projects</span>
              </h2>
            </div>

            <div className="mt-14 flex flex-wrap items-start justify-center gap-6 md:gap-7">
              {sample.cards.length === 0 ? (
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-xl">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-400">
                    <Layers className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Portfolio is live — add your first project
                  </h3>
                  <p className="max-w-xl text-sm leading-6 text-slate-400">
                    Nothing is hardcoded. Every card you see here is uploaded by you from the
                    admin panel with a real photo, a description, and a link to the finished site.
                  </p>
                </div>
              ) : (
                sample.cards.slice(0, 3).map((card, i) => (
                  <article
                    key={card.id}
                    className="group relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] ring-1 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 md:max-w-[420px] md:flex-1 md:min-w-[320px]"
                    style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.02]">
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-ink-800 to-ink-900" />
                      )}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent" />

                      {card.showViewButton && card.siteUrl && (
                        <a
                          href={card.siteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-ink-950/85 px-3.5 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/15 backdrop-blur-md transition-all hover:bg-neon-cyan hover:text-ink-950 hover:ring-neon-cyan/60 hover:shadow-neon sm:text-xs"
                        >
                          {card.viewButtonLabel || "Click to view site"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {card.siteUrl && (
                        <a
                          href={card.siteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute inset-0 z-0"
                          aria-label={`Open ${card.title}`}
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                      <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-white">
                        {card.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-300/90">
                        {card.description}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-12 text-center">
              {sample.cards.length > 0 ? (
                <Link
                  to="/sample-projects"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink-950 transition-all hover:bg-neon-cyan hover:shadow-neon"
                >
                  View Sample Projects
                  <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
                </Link>
              ) : (
                <Link
                  to="/webify"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-cyan to-violet-500 px-6 py-3 text-sm font-bold text-ink-950 transition-all hover:shadow-neon"
                >
                  Open Admin & Add Your First Project
                  <ArrowRight className="h-4 w-4" strokeWidth={2.8} />
                </Link>
              )}
            </div>
          </section>
        </main>
        <footer className="border-t border-white/5 py-8">
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
    </div>
  );
}
