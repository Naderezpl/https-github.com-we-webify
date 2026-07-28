import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const ADMIN_CODE = "333";
const REVEAL_DURATION_MS = 6000;

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

export default function SecretAdminTrigger() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = useAuthStore((s) => s.authenticated);
  const [typedKeys, setTypedKeys] = useState("");
  const [revealed, setRevealed] = useState(false);

  const destination = useMemo(
    () => (authenticated ? "/webify/dashboard" : "/webify"),
    [authenticated]
  );

  useEffect(() => {
    if (location.pathname.startsWith("/webify")) {
      setTypedKeys("");
      setRevealed(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!revealed) return;

    const timeout = window.setTimeout(() => {
      setRevealed(false);
    }, REVEAL_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [revealed]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (location.pathname.startsWith("/webify")) return;
      if (isEditableTarget(event.target)) return;

      if (event.key === "Escape") {
        setRevealed(false);
        setTypedKeys("");
        return;
      }

      if (!/^\d$/.test(event.key)) {
        setTypedKeys("");
        return;
      }

      setTypedKeys((current) => {
        const next = `${current}${event.key}`.slice(-ADMIN_CODE.length);

        if (next === ADMIN_CODE) {
          setRevealed(true);
          return "";
        }

        return next;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location.pathname]);

  if (location.pathname.startsWith("/webify") || !revealed) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70]">
      <button
        type="button"
        onClick={() => navigate(destination)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-ink-950/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all hover:border-neon-cyan hover:text-neon-cyan"
      >
        <Shield className="h-4 w-4 text-neon-cyan" />
        {authenticated ? "Open Admin" : "Admin Login"}
      </button>
    </div>
  );
}
