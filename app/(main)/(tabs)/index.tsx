import { View } from "react-native";
import PetCardSection from "@/app/(main)/(tabs)/components/PetCardSection";
import MedicalHistorySection from "@/app/(main)/(tabs)/components/MedicalHistorySection";
import Pagination from "@/components/common/pagination/Pagination";
import { router, useLocalSearchParams } from "expo-router";

export default function HomeScreen() {
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;
    return (
        <View>
            <Pagination
                currentPage={currentPage}
                totalPages={17}
                onPageChange={newPage =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
            />
            {/* 🐶 상단: 동물 카드 영역 (더하기 카드까지 이 안에서 처리) */}
            <PetCardSection />

            {/* 🏥 하단: 진료 이력 및 나머지 UI 영역 */}
            <MedicalHistorySection />
        </View>
    );
}
