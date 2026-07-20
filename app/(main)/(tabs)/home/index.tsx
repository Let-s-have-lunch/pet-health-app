import PetCardSection from "@/components/domain/pet/PetCardSection";
import { useFocusEffect, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { usePetStore } from "@/stores/pet/usePetStore";
import petApi from "@/api/user/petApi";
import { useCallback, useState } from "react";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import HistorySection from "@/components/domain/history/HistorySection";
import { twMerge } from "tailwind-merge";

function HomeScreen() {
    const router = useRouter();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    const pets = usePetStore(state => state.pets);
    const selectedPet = usePetStore(state => state.selectedPet);

    const setPets = usePetStore(state => state.setPets);
    const setSelectedPet = usePetStore(state => state.setSelectedPet);

    const [loading, setLoading] = useState(true);


    const loadPets = useCallback(async () => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        try {
            const result = await petApi.getMyPetList();

            setPets(result);

            if (!selectedPet && result.length > 0) {
                setSelectedPet(result[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, selectedPet, setPets, setSelectedPet]);

    useFocusEffect(
        useCallback(() => {
            void loadPets();
        }, [loadPets]),
    );

    const handleAddPet = () => {
        if (!isLoggedIn) {
            router.push("/auth/login");
            return;
        }


        router.push("/pets/create");
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View>
                <PetCardSection pets={pets} isLoggedIn={isLoggedIn} onPressAdd={handleAddPet} />

                <HistorySection />
        </View>
    );
}

export default HomeScreen;
