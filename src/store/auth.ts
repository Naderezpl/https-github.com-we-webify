import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ADMIN_CREDENTIALS = {
  username: "adminwebify",
  password: "Naderezzy@7",
} as const;

type AuthState = {
  authenticated: boolean;
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authenticated: false,
      login: (u, p) => {
        if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
          set({ authenticated: true });
          return { ok: true };
        }
        return {
          ok: false,
          error: "Invalid credentials. Try adminwebify / Naderezzy@7",
        };
      },
      logout: () => set({ authenticated: false }),
    }),
    { name: "webify.auth.v1" }
  )
);
