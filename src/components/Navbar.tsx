import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import { buildQuoteLink } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Sample Projects", to: "/sample-projects" },
  { label: "Contact", to: "/contact" },
];

function NavLink({ item: { label, to, href } }: { item: { label: string; to?: string; href?: string } }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (to) {
    return (
      <Link
        to={to}
        className="relative text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors duration-200 hover:text-neon-cyan"
      >
        {label}
        <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-neon-cyan transition-all duration-300 hover:w-full" />
      </Link>
    );
  }

  const resolvedHref = isHome ? href : `/${href}`;
  return (
    <a
      href={resolvedHref}
      className="relative text-[13px] font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors duration-200 hover:text-neon-cyan"
    >
      {label}
      <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-neon-cyan transition-all duration-300 hover:w-full" />
    </a>
  );
}

export default function Navbar() {
  const authenticated = useAuthStore((s) => s.authenticated);
  const adminTo = authenticated ? "/webify/dashboard" : "/webify";
  const adminLabel = authenticated ? "Admin" : "Admin";

  return (
    <header className="relative z-30">
      <div className="container">
        <nav className="flex items-center justify-between py-5 sm:py-6">
          <Link
            to="/"
            className="group flex items-center gap-2 font-display text-lg sm:text-xl font-extrabold tracking-wide text-white"
          >
            <span className="font-black tracking-[-0.01em]">
              web<span className="text-gradient-cyber">ify</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink item={link} />
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 sm:inline-flex">
            <Link
              to={adminTo}
              aria-label="Admin access"
              title={authenticated ? "Open Admin Dashboard" : "Admin Login (or press 333)"}
              className="glass-pill inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              <Shield className="h-3.5 w-3.5 text-neon-cyan/80" />
              {adminLabel}
            </Link>
            <a
              href={buildQuoteLink("navbar")}
              target="_blank"
              rel="noreferrer"
              className="glass-pill inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-all hover:border-neon-cyan/60 hover:text-neon-cyan"
            >
              Get a Quote
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
