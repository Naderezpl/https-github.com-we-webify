import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import AdminAccessLink from "@/components/AdminAccessLink";
import Navbar from "@/components/Navbar";
import { useSiteContentStore } from "@/store/siteContent";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function SampleProjects() {
  const sample = useSiteContentStore((s) => s.content.sampleProjects);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <section className="container py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-neon-cyan" style={{ animationDelay: "0.05s" }}>
                {sample.eyebrow}
              </p>
              <h1 className="animate-fadeUp mt-6 font-display font-black leading-[1.02] tracking-tight text-white" style={{ animationDelay: "0.15s", fontSize: "clamp(2.2rem, 5.4vw, 4.2rem)" }}>
                {sample.title}{" "}
                <span className="text-gradient-cyber">{sample.titleHighlight}</span>
              </h1>
              <p className="animate-fadeUp mt-6 text-base sm:text-lg text-slate-300/90" style={{ animationDelay: "0.25s" }}>
                {sample.subtitle}
              </p>
            </div>

            <div className="mt-14 flex flex-wrap items-start justify-center gap-6 md:gap-7">
              {sample.cards.length === 0 && (
                <div className="glass-pill w-full max-w-md rounded-3xl p-8 text-center text-sm text-slate-400">
                  No sample projects yet. Head to the admin panel to add your first project card.
                </div>
              )}

              {sample.cards.map((card, i) => (
                <article
                  key={card.id}
                  className="animate-fadeUp group relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] ring-1 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 md:max-w-[420px] md:flex-1 md:min-w-[320px]"
                  style={{ animationDelay: `${0.35 + i * 0.1}s` }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/[0.02]">
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

                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent pointer-events-none" />

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
                        className="absolute inset-0 z-0 focus:outline-none"
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
              ))}
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-8">
          <div className="container flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>© {new Date().getFullYear()} webify — Where You Trust Professionals.</p>
            <div className="flex items-center gap-5">
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
