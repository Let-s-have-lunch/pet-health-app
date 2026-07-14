import { View, ScrollView, Platform, Alert } from "react-native";
import {  useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import Title from "../../../../components/common/title/Title";

import { WaterIntakeLog } from "@/types/waterIntakeLog";
import WaterLogChartSection from "@/app/(main)/health/water-logs/WaterLogChartSection";
import { twMerge } from "tailwind-merge";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import WaterLogModal from "@/app/(main)/health/water-logs/WaterLogModal";
import waterIntakeApi from "@/api/user/waterIntakeApi";
import WaterLogHistorySection from "@/app/(main)/health/water-logs/WaterLogHistorySection";
import { usePetStore } from "@/stores/usePetStore";


export default function WaterLogListPage() {
    const router = useRouter();
    const { selectedPet } = usePetStore();
    const petId = selectedPet?.id;

    const [historyData, setHistoryData] = useState<WaterIntakeLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLogData, setSelectedLogData] = useState<WaterIntakeLog | null>(null);

    const fetchData = useCallback(async () => {
        if (!petId) return;
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
    }, [petId])

    const handleCreatePress = () => {
        setSelectedLogData(null); // 신규 작성이므로 비워줍니다.
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
                            petId={petId}
                            reload={fetchData}
                            initialData={selectedLogData}
                        />

                        <WaterLogHistorySection history={historyData} onAddPress={handleCreatePress} onEditPress={handleEditPress} onDeletePress={handleDelete}/>
                    </ContentContainer>
                </ScrollView>
            )}
        </View>
    );
}
