import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_CREDENTIAL_HASH =
  "f539b0eb409da46547ccdcef4173d932b45064248b327c4047e49705cfe2c49b";

async function hashCredentials(username: string, password: string) {
  const data = new TextEncoder().encode(`${username}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

type AuthState = {
  authenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authenticated: false,
      login: async (u, p) => {
        if (!u || !p) {
          return {
            ok: false,
            error: "Invalid username or password.",
          };
        }

        const submittedHash = await hashCredentials(u, p);

        if (submittedHash === ADMIN_CREDENTIAL_HASH) {
          set({ authenticated: true });
          return { ok: true };
        }

        return {
          ok: false,
          error: "Invalid username or password.",
        };
      },
      logout: () => set({ authenticated: false }),
    }),
    { name: "webify.auth.v1" }
  )
);
