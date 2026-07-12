import PetCardSection from "@/components/pet/PetCardSection";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { usePetStore } from "@/stores/usePetStore";
import petApi from "@/api/user/petApi";
import { useEffect, useState } from "react";
import PetHistorySection from "@/components/weight/PetHistorySection";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function HomeScreen() {
    const router = useRouter();
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    // const { pets, setPets } = usePetStore();
    const pets = usePetStore(state => state.pets);
    const setPets = usePetStore(state => state.setPets);
    const [ loading, setLoading ] = useState(true);


    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }
        const loadPets = async () => {
            try {
                const result = await petApi.getMyPetList();
                console.log(result);
                setPets(result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadPets().then(() => {});

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

    if (loading) {
        return <LoadingIndicator />;
    }


    return (
        <ScrollView  showsVerticalScrollIndicator={false}>
            <PetCardSection pets={pets} isLoggedIn={isLoggedIn} onPressAdd={handleAddPet} />
            <PetHistorySection />
        </ScrollView>
    );
}

export default HomeScreen;
