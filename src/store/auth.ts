import { create } from "zustand";
import { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (data: { user: User; accessToken: string }) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: ({ user, accessToken }) =>
    set({ user, accessToken, isAuthenticated: true }),

  logout: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}));
