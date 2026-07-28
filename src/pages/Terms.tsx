import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import AdminAccessLink from "@/components/AdminAccessLink";
import Navbar from "@/components/Navbar";
import { useSiteContentStore } from "@/store/siteContent";
import { Link } from "react-router-dom";

export default function Terms() {
  const terms = useSiteContentStore((s) => s.content.terms);

  const paragraphs = terms.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <section className="container py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <p className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-neon-cyan" style={{ animationDelay: "0.05s" }}>
                {terms.eyebrow}
              </p>
              <h1 className="animate-fadeUp mt-6 font-display font-black leading-[1.02] tracking-tight text-white" style={{ animationDelay: "0.15s", fontSize: "clamp(2.2rem, 5.4vw, 4.2rem)" }}>
                {terms.title}{" "}
                <span className="text-gradient-cyber">{terms.titleHighlight}</span>
              </h1>
              <p className="animate-fadeUp mt-6 text-base sm:text-lg text-slate-300/90" style={{ animationDelay: "0.25s" }}>
                {terms.intro}
              </p>
            </div>

            <div className="animate-fadeUp mx-auto mt-12 max-w-3xl glass-pill rounded-3xl p-6 sm:p-10" style={{ animationDelay: "0.4s" }}>
              <div className="space-y-6 text-sm leading-7 text-slate-300 sm:text-base">
                {paragraphs.map((p, i) => (
                  <p key={i}>
                    {p.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < p.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
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
