import { View, ScrollView, Platform, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import Title from "../../../../components/common/title/Title";

import { WaterIntakeLog } from "@/types/waterIntakeLog";
import WaterLogChartSection from "@/components/domain/water-logs/WaterLogChartSection";
import { twMerge } from "tailwind-merge";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import WaterLogModal from "@/components/domain/water-logs/WaterLogModal";
import waterIntakeApi from "@/api/user/waterIntakeApi";
import WaterLogHistorySection from "@/components/domain/water-logs/WaterLogHistorySection";
import { usePetStore } from "@/stores/pet/usePetStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function WaterLogListPage() {
    const router = useRouter();

    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const { selectedPet } = usePetStore();
    const petId = selectedPet?.id;

    const [historyData, setHistoryData] = useState<WaterIntakeLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLogData, setSelectedLogData] = useState<WaterIntakeLog | null>(null);

    const fetchData = useCallback(async () => {
        if (!isLoggedIn || !petId) {
            setHistoryData([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await waterIntakeApi.getByPetId(petId);
            setHistoryData(response);
        } catch (error) {
            console.log(error);
            const msg = "데이터를 불러오는데 실패했습니다.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn, petId]);


    const handleCreatePress = () => {
        if (!isLoggedIn) {
            if (Platform.OS === "web") {
                alert("로그인이 필요한 서비스입니다.");
                router.push("/auth/login");
            } else {
                Alert.alert("알림", "로그인이 필요한 서비스입니다.", [
                    {
                        text: "확인",
                        onPress: () => router.push("/auth/login"),
                    },
                ]);
            }
            return;
        }
        if (!petId) {
            if (Platform.OS === "web") alert("반려동물을 먼저 등록해주세요.");
            else Alert.alert("알림", "반려동물을 먼저 등록해주세요.");
            return;
        }

        setSelectedLogData(null);
        setIsModalOpen(true);
    };

    const handleEditPress = (log: WaterIntakeLog) => {
        setSelectedLogData(log);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLogData(null);
    };

    const handleDelete = async (id: number) => {
        const processDelete = async () => {
            try {
                await waterIntakeApi.deleteWaterLog(id);
                await fetchData();
            } catch (error) {
                console.log(error);
                Platform.OS === "web"
                    ? alert("삭제에 실패했습니다.")
                    : Alert.alert("오류", "삭제에 실패했습니다.");
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 삭제하시겠습니까?")) {
                await processDelete();
            }
        } else {
            Alert.alert("삭제", "정말 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: processDelete },
            ]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            void fetchData();
        }, [fetchData]),
    );

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <Title
                title={selectedPet ? `${selectedPet.name}의 음수량` : "음수량 기록"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
                className={"bg-background-paper"}
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <ScrollView>
                    <ContentContainer className={"overflow-hidden flex-1"}>
                        <WaterLogChartSection historyData={historyData} />

                        <WaterLogModal
                            visible={isModalOpen}
                            onClose={handleCloseModal}
                            petId={petId!} // 💡 TS 에러 방지용 '!' 추가
                            reload={fetchData}
                            initialData={selectedLogData}
                        />

                        <WaterLogHistorySection
                            history={historyData}
                            onAddPress={handleCreatePress}
                            onEditPress={handleEditPress}
                            onDeletePress={handleDelete}
                        />
                    </ContentContainer>
                </ScrollView>
            )}
        </View>
    );
}
