import PetCardSection from "@/app/(main)/(tabs)/components/Pet/PetCardSection";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import HistorySection from "./components/History/HistorySection";
import { useAuthState } from "@/app/(main)/(tabs)/components/stores/authStore";

function HomeScreen() {
    const isLoggedIn = useAuthState(state => state.isLoggedIn);
    const handleAddPet = () => {
        if (!isLoggedIn) {
            // 로그인 모달 열기
            return;
        }
        router.push("/pets/create");
    };

    return (
        <ScrollView>
            <PetCardSection isLoggedIn={isLoggedIn} onPressAdd={handleAddPet} />
            <HistorySection />
        </ScrollView>
    );
}
export default HomeScreen;
