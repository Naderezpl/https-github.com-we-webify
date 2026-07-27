import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { buildQuoteLink } from "@/lib/utils";

export default function Hero() {
  return (
    <section id="home" className="relative z-20 flex min-h-[calc(100vh-88px)] items-center">
      <div className="container py-12 sm:py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p
            className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-neon-cyan"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
            </span>
            Professional Websites
          </p>

          <h1
            className="animate-fadeUp mt-6 sm:mt-8 font-display font-black leading-[0.95] tracking-tight text-white"
            style={{
              animationDelay: "0.15s",
              fontSize: "clamp(2.6rem, 7.2vw, 5.6rem)",
              textShadow: "0 0 60px rgba(0,240,255,0.12)",
            }}
          >
            Where You Trust
            <br className="hidden sm:block" />
            <span className="text-gradient-cyber">Professionals</span>
          </h1>

          <p
            className="animate-fadeUp mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg text-slate-300/90"
            style={{ animationDelay: "0.3s" }}
          >
            Custom-designed websites, lightning-fast landing pages, and
            polished UI for startups, agencies, and e-commerce. Experience the
            webify Standard.
          </p>

          <div
            className="animate-fadeUp mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
            style={{ animationDelay: "0.45s" }}
          >
            <a
              href={buildQuoteLink("hero")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon-cyan px-7 py-4 text-[15px] font-bold text-ink-950 shadow-neon transition-all duration-300 hover:-translate-y-0.5 hover:shadow-neonLg sm:w-auto"
            >
              Get a Quote
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2.8}
              />
            </a>

            <Link
              to="/pricing"
              className="group glass-pill inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:text-neon-cyan sm:w-auto"
            >
              Pricing
            </Link>
          </div>
        </div>

        <div className="animate-fadeUp pointer-events-none mt-16 sm:mt-24 flex justify-center" style={{ animationDelay: "0.7s" }}>
          <div className="relative flex h-10 w-6 items-start justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-md">
            <span className="mt-2 block h-1.5 w-1 rounded-full bg-neon-cyan animate-scrollHint" />
            <ChevronDown className="absolute -bottom-6 h-4 w-4 text-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
