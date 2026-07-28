import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import AdminAccessLink from "@/components/AdminAccessLink";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useSiteContentStore } from "@/store/siteContent";
import { SocialIcon, SOCIAL_LABELS } from "@/components/Social";
import {
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const contact = useSiteContentStore((s) => s.content.contact);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState(
    contact.projectOptions[0] ?? ""
  );
  const [message, setMessage] = useState("");

  function buildWhatsAppLink() {
    const lines = [
      `*New webify inquiry*`,
      ``,
      `*Name:* ${name || "—"}`,
      `*Phone:* ${phone || "—"}`,
      `*Email:* ${email || "—"}`,
      `*Project Type:* ${eventType || "—"}`,
      ``,
      `*Message:*`,
      message || "",
    ].join("\n");
    return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
      lines
    )}`;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <section className="container py-16 sm:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <p
                className="animate-fadeUp inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-neon-cyan"
                style={{ animationDelay: "0.05s" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-cyan" />
                </span>
                {contact.eyebrow}
              </p>
              <h1
                className="animate-fadeUp mt-6 font-display font-black leading-[1.02] tracking-tight text-white"
                style={{
                  animationDelay: "0.15s",
                  fontSize: "clamp(2.2rem, 5.4vw, 4.2rem)",
                  textShadow: "0 0 60px rgba(0,240,255,0.1)",
                }}
              >
                Let's build your <span className="text-gradient-cyber">next website</span>
              </h1>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-5">
              {/* Contact Information card */}
              <div
                className="animate-fadeUp glass-pill relative overflow-hidden rounded-3xl p-7 sm:p-9 lg:col-span-2"
                style={{ animationDelay: "0.3s" }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full opacity-70"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(0,240,255,0.55), transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 rounded-full opacity-60"
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(168,85,247,0.55), transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />

                <h2 className="relative font-display text-3xl font-black tracking-tight text-white">
                  {contact.introTitle}
                </h2>
                <p className="relative mt-4 text-[15px] leading-relaxed text-slate-300/90">
                  {contact.intro}
                </p>

                <ul className="relative mt-8 space-y-6">
                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-neon-cyan/15 text-neon-cyan ring-1 ring-neon-cyan/40">
                      <Phone className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        {contact.phoneLabel}
                      </p>
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                        className="mt-1 block text-lg font-bold text-white transition-colors hover:text-neon-cyan"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-neon-purple/15 text-neon-purple ring-1 ring-neon-purple/40">
                      <Mail className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        {contact.emailLabel}
                      </p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="mt-1 block text-lg font-bold text-white transition-colors hover:text-neon-purple"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </li>
                </ul>

                <div className="relative mt-10">
                  <p className="font-display text-lg font-extrabold tracking-tight text-white">
                    {contact.followTitle}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    {contact.socials.map((s) => (
                      <a
                        key={s.id}
                        href={s.href || "#"}
                        target="_blank"
                        rel="noreferrer"
                        title={SOCIAL_LABELS[s.platform]}
                        className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-all hover:-translate-y-0.5 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 hover:text-neon-cyan"
                      >
                        <SocialIcon platform={s.platform} className="h-5 w-5" />
                      </a>
                    ))}
                    {contact.socials.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No socials added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Send a Message form */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="animate-fadeUp glass-pill rounded-3xl p-7 sm:p-9 lg:col-span-3"
                style={{ animationDelay: "0.4s" }}
              >
                <h2 className="font-display text-3xl font-black tracking-tight text-white">
                  {contact.formTitle}
                </h2>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Name
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base text-white placeholder:text-slate-500 outline-none transition-all focus:border-neon-cyan/50 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Phone
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your Phone"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base text-white placeholder:text-slate-500 outline-none transition-all focus:border-neon-cyan/50 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Email
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base text-white placeholder:text-slate-500 outline-none transition-all focus:border-neon-cyan/50 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                    />
                  </label>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Project Type
                    </span>
                    <div className="relative">
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-white/10 bg-black/30 px-4 py-4 pr-12 text-base text-white outline-none transition-all focus:border-neon-cyan/50 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                      >
                        {contact.projectOptions.length === 0 && (
                          <option value="">—</option>
                        )}
                        {contact.projectOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-ink-900">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </label>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Message
                    </span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      placeholder="Tell us about your website..."
                      className="w-full resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base text-white placeholder:text-slate-500 outline-none transition-all focus:border-neon-cyan/50 focus:bg-black/40 focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                    />
                  </label>
                </div>

                <div className="mt-8">
                  <a
                    href={buildWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-neon-cyan px-6 py-4 text-[15px] font-extrabold text-ink-950 shadow-neon transition-all hover:-translate-y-0.5 hover:shadow-neonLg"
                  >
                    <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
                    Send Message via WhatsApp
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
                  </a>
                  <p className="mt-3 text-center text-xs text-slate-500">
                    We'll reply within 1 business day · {contact.phone}
                  </p>
                </div>
              </form>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/5 py-8">
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
