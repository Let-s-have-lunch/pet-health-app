import { create } from "zustand";

type AuthState = {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
};

export const useAuthState = create<AuthState>(set => ({
    isLoggedIn: false,
    setIsLoggedIn: value => set({ isLoggedIn: value }),
}));
