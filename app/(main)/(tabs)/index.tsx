import { View, StyleSheet } from "react-native";
import PetCardSection from "@/app/(main)/(tabs)/components/PetCardSection";
import MedicalHistorySection from "@/app/(main)/(tabs)/components/MedicalHistorySection";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            {/* 🐶 상단: 동물 카드 영역 (더하기 카드까지 이 안에서 처리) */}
            <PetCardSection />

            {/* 🏥 하단: 진료 이력 및 나머지 UI 영역 */}
            <MedicalHistorySection />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
});
