import PetCardSection from "@/app/(main)/(tabs)/components/Pet/PetCardSection";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import HistorySection from "./components/History/HistorySection";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { usePetStore } from "@/stores/usePetStore";
import petApi from "@/api/user/petApi";
import { useEffect } from "react";

function HomeScreen() {
    const router = useRouter();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    // const { pets, setPets } = usePetStore();
    const pets = usePetStore(state => state.pets);
    const setPets = usePetStore(state => state.setPets);


    useEffect(() => {
        if (!isLoggedIn) return;
        const loadPets = async () => {
            try {
                const result = await petApi.getMyPetList();
                console.log(result);
                setPets(result);
            } catch (error) {
                console.error(error);
            }
        };

        loadPets().then(()=> {});

    }, [isLoggedIn, setPets]);

    useEffect(() => {
        console.log("Zustand pets:", pets);
    }, [pets]);

    const handleAddPet = () => {
        if (!isLoggedIn) {
            // 로그인 모달 열기
            router.push("/auth/login");
            return;
        }

        router.push("/pets/create");
    };


    return (
        <ScrollView>
            <PetCardSection pets={pets} isLoggedIn={isLoggedIn} onPressAdd={handleAddPet} />
            <HistorySection />
        </ScrollView>
    );
}

export default HomeScreen;
