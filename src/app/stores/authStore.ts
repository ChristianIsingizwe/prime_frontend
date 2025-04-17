import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string; // Database-generated ID
  workId: string; // User-provided work ID
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  name: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  expiresIn: number | null;
  setAuth: (auth: {
    token: string;
    refreshToken: string;
    user: User;
    isAuthenticated: boolean;
    expiresIn: number;
  }) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      expiresIn: null,
      setAuth: (auth) => set({ ...auth }),
      updateTokens: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          expiresIn: null,
        }),
      hasRole: (role) => {
        const state = get();
        return state.user?.role === role || false;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        expiresIn: state.expiresIn,
      }),
    }
  )
);
