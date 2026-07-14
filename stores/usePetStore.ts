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
    clearPets: () => void;
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

            // 💡 2. 펫 관련 상태를 모두 초기값으로 덮어씌우는 함수 구현
            clearPets: () => set({ pets: [], selectedPet: null, isAddCardSelected: false }),
        }),
        {
            // 💡 3. [매우 중요] Auth 스토어와 겹치지 않도록 이름을 고유하게 변경했습니다!
            name: "pet-health-app-pet-storage",
            storage,
        },
    ),
);
