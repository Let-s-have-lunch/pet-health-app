import { create } from "zustand";
import { Pet } from "../types/pet";
import { createJSONStorage, persist } from "zustand/middleware";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PetState = {
    pets: Pet[];
    selectedPet: Pet | null;
    isAddCardSelected: boolean;

    setPets: (pets: Pet[]) => void;
    setSelectedPet: (pet: Pet | null) => void;
    setIsAddCardSelected: (isSelected: boolean) => void;

    // 💡 1. 로그아웃 시 비워주기 위한 함수 타입 추가
    reset: () => void;
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const usePetStore = create<PetState>()(
    persist(
        set => ({
            pets: [],
            selectedPet: null,
            isAddCardSelected: false,

            setPets: pets => set({ pets }),
            setSelectedPet: pet => set({ selectedPet: pet }),
            setIsAddCardSelected: isSelected => set({ isAddCardSelected: isSelected }),

            reset: () => set({ pets: [], selectedPet: null, isAddCardSelected: false }),
        }),
        {
            name: "pet-health-app-pet-storage",
            storage,
        },
    ),
);
