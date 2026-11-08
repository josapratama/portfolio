import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  admin: { id: string; email: string; name: string } | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAccessToken: (token: string) => void;
  setAdmin: (admin: { id: string; email: string; name: string }) => void;
  setInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      admin: null,
      isAuthenticated: false,
      isInitialized: false,
      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: true }),
      setAdmin: (admin) => set({ admin }),
      setInitialized: () => set({ isInitialized: true }),
      logout: () =>
        set({ accessToken: null, admin: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
