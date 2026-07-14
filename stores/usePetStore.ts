import { Pet } from "@/types/pet";
import { create } from "zustand";

type PetState = {
    pets: Pet[];
    selectedPet: Pet | null;
    isAddCardSelected: boolean;

    setPets: (pets: Pet[]) => void;
    setSelectedPet: (pet: Pet | null) => void;
    setIsAddCardSelected: (isSelected: boolean) => void;

    reset: () => void;
};

export const usePetStore = create<PetState>(set => ({
    pets: [],
    selectedPet: null,
    isAddCardSelected: false,

    setPets: pets => set({ pets }),
    setSelectedPet: pet => set({ selectedPet: pet }),
    setIsAddCardSelected: isSelected => set({ isAddCardSelected: isSelected }),

    reset: () =>
        set({
            pets: [],
            selectedPet: null,
        }),
}));