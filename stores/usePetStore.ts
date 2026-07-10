import { Pet } from "@/types/pet";
import { create } from "zustand";

type PetState = {
    pets: Pet[];
    selectedPet: Pet | null;

    setPets: (pets: Pet[]) => void;
    setSelectedPet: (pet: Pet | null) => void;
};

export const usePetStore = create<PetState>(set => ({
    pets: [],
    selectedPet: null,

    setPets: pets => set({ pets }),
    setSelectedPet: pet => set({ selectedPet: pet }),
}));
