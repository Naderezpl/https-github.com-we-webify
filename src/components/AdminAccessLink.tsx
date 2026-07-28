import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

type AdminAccessLinkProps = {
  className?: string;
  children?: ReactNode;
};

export default function AdminAccessLink({
  className,
  children = "admin",
}: AdminAccessLinkProps) {
  const authenticated = useAuthStore((s) => s.authenticated);

  if (!authenticated) return null;

  return (
    <Link to="/webify/dashboard" className={className}>
      {children}
    </Link>
  );
}
