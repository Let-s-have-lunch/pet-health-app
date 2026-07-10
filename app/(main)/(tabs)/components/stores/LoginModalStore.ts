import { create } from "zustand";

type LoginModalState = {
    visible: boolean;
    open: () => void;
    close: () => void;
};

export const useLoginModalStore = create<LoginModalState>(set => ({
    visible: false,
    open: () => set({ visible: true }),
    close: () => set({ visible: false }),
}));
