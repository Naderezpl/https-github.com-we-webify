import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import AdminAccessLink from "@/components/AdminAccessLink";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useSiteContentStore } from "@/store/siteContent";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Infinity as InfinityIcon,
  Sparkles,
} from "lucide-react";

const BULLET_ICONS = [Sparkles, BadgeCheck, InfinityIcon, HeartHandshake, Sparkles, Sparkles];

export default function About() {
  const about = useSiteContentStore((s) => s.content.about);

  const paragraphs = about.description
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <section className="container py-16 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p
                  className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-neon-cyan sm:px-4 sm:text-xs sm:tracking-[0.32em]"
                  style={{ animationDelay: "0.05s" }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
                  </span>
                  {about.eyebrow}
                </p>

                <h1
                  className="animate-fadeUp mt-6 text-balance font-display font-black leading-[1.02] tracking-tight text-white"
                  style={{
                    animationDelay: "0.15s",
                    fontSize: "clamp(2rem, 8vw, 4.6rem)",
                    textShadow: "0 0 60px rgba(0,240,255,0.1)",
                  }}
                >
                  Where <span className="text-gradient-cyber">{about.titleHighlight}</span>
                </h1>

                <div
                  className="animate-fadeUp mt-8 space-y-4 max-w-2xl text-base sm:text-lg text-slate-300/90"
                  style={{ animationDelay: "0.3s" }}
                >
                  {paragraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                <div
                  className="animate-fadeUp mt-10 flex flex-col items-start gap-4 sm:flex-row"
                  style={{ animationDelay: "0.45s" }}
                >
                  <Link
                    to="/pricing"
                    className="group inline-flex items-center gap-2 rounded-full bg-neon-cyan px-6 py-3.5 text-sm font-bold text-ink-950 shadow-neon transition-all hover:-translate-y-0.5 hover:shadow-neonLg"
                  >
                    See Pricing
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={2.8}
                    />
                  </Link>
                  <Link
                    to="/contact"
                    className="glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:text-neon-cyan"
                  >
                    Talk to us
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div
                  className="animate-fadeUp glass-pill relative overflow-hidden rounded-3xl p-7 sm:p-8"
                  style={{ animationDelay: "0.35s" }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(0,240,255,0.55), transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -left-10 h-60 w-60 rounded-full opacity-60"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(168,85,247,0.55), transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />

                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neon-cyan">
                    Why webify
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white">
                    Built to stand out — built to last.
                  </h2>

                  <ul className="relative mt-6 space-y-4">
                    {about.bullets.map((b, i) => {
                      const Icon = BULLET_ICONS[i % BULLET_ICONS.length];
                      return (
                        <li key={i} className="flex items-start gap-4">
                          <span className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-2xl bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40">
                            <Icon className="h-4 w-4" />
                          </span>
                          <p className="text-sm sm:text-[15px] text-slate-200/90 leading-relaxed">
                            {b}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
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
