import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import BackgroundAtmosphere from "@/components/BackgroundAtmosphere";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn, User } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const authenticated = useAuthStore((s) => s.authenticated);
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    if (authenticated) navigate("/webify/dashboard", { replace: true });
  }, [authenticated, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(async () => {
      const r = await login(username.trim(), password);
      setLoading(false);
      if (!r.ok) {
        setError(r.error ?? "Sign in failed");
      } else {
        navigate("/webify/dashboard", { replace: true });
      }
    }, 350);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <BackgroundAtmosphere />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-[39px] py-6 sm:p-6">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="group mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-neon-cyan"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to website
          </Link>

          <div className="glass-pill animate-fadeUp rounded-3xl p-7 sm:p-9 shadow-[0_30px_120px_-30px_rgba(0,240,255,0.35)]">
            <div className="flex items-center gap-3">
              <span
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,240,255,0.2) 0%, rgba(168,85,247,0.2) 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(0,240,255,0.35), 0 10px 40px rgba(0,240,255,0.25)",
                }}
              >
                <svg
                  viewBox="0 0 48 48"
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <linearGradient id="webifyG" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <g stroke="url(#webifyG)" strokeWidth="2.2" opacity="0.7">
                    <ellipse cx="23" cy="23" rx="16.5" ry="16.5" />
                    <ellipse cx="23" cy="23" rx="16.5" ry="7" />
                    <ellipse cx="23" cy="23" rx="16.5" ry="7" transform="rotate(60 23 23)" />
                    <ellipse cx="23" cy="23" rx="16.5" ry="7" transform="rotate(-60 23 23)" />
                    <line x1="6.5" y1="23" x2="39.5" y2="23" />
                    <line x1="23" y1="6.5" x2="23" y2="39.5" />
                  </g>
                  <circle cx="23" cy="32" r="2" fill="url(#webifyG)" />
                  <circle cx="14" cy="18.5" r="1.6" fill="url(#webifyG)" />
                  <circle cx="32" cy="15" r="1.6" fill="url(#webifyG)" />
                  <g fill="url(#webifyG)">
                    <path d="M30 10 L36 14 L40 11 L43 16 L40 21 L35 18 L31 23 Z" />
                  </g>
                </svg>
              </span>
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-neon-cyan">
                  webify · Admin
                </p>
                <h1 className="font-display text-2xl font-black tracking-tight">
                  Sign in to continue
                </h1>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <User className="h-3.5 w-3.5 text-neon-cyan" /> Username
                </span>
                <div className="relative">
                  <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pl-11 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                  />
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <LockKeyhole className="h-3.5 w-3.5 text-neon-cyan" /> Password
                </span>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-neon-cyan/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.12)]"
                  />
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition-colors hover:text-neon-cyan"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error && (
                <div className="animate-fadeUp rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neon-cyan px-5 py-3.5 text-sm font-bold text-ink-950 shadow-neon transition-all hover:shadow-neonLg disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
                <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <p className="text-center text-xs text-slate-500">
                Authorized users only.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
