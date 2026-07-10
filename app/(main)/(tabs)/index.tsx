import PetCardSection from "@/app/(main)/(tabs)/components/Pet/PetCardSection";
import AddPetCard from "@/app/(main)/(tabs)/components/Pet/AddPetCard";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import HistorySection from "./components/History/HistorySection";
import { useAuthState } from "@/app/(main)/(tabs)/components/stores/authStore";
import { useState } from "react";

function HomeScreen() {
    const [loginModal, setLoginModal] = useState(false);

    const isLoggedIn = useAuthState((state) => state.isLoggedIn);
    const handleAddPet = () => {
        if (!isLoggedIn) {
            setLoginModal(true);
            return;
        }

        router.push("/pets/create");
    };

    return (
        <ScrollView>

                <HistorySection />
        </ScrollView>
    );
}

export default HomeScreen;
