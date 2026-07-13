import { View, ScrollView, Platform, Alert } from "react-native";
import {  useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import Title from "../../../../components/common/title/Title";

import { WaterIntakeLog } from "@/types/WaterIntakeLog";
import WaterLogChartSection from "@/app/(main)/health/water-logs/WaterLogChartSection";
import { twMerge } from "tailwind-merge";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import WaterLogModal from "@/app/(main)/health/water-logs/WaterLogModal";
import waterIntakeApi from "@/api/user/waterIntakeApi";
import WaterLogHistorySection from "@/app/(main)/health/water-logs/WaterLogHistorySection";

const getTodayString = () => new Date().toISOString().split("T")[0];

export default function WaterLogListPage() {
    const router = useRouter();
    const petId = 1;

    const [historyData, setHistoryData] = useState<WaterIntakeLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLogData, setSelectedLogData] = useState<WaterIntakeLog | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await waterIntakeApi.getByPetId(1);
            setHistoryData(response);
        } catch (error) {
            console.log(error);
            const msg = "데이터를 불러오는데 실패했습니다.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        } finally {
            setIsLoading(false);
        }
    };

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
        }, []),
    );

    // 하단 History 리스트 렌더링용 정렬
    const sortedHistory = [...historyData].sort((a, b) => {
        const dateCompare = b.recordDate.localeCompare(a.recordDate);
        if (dateCompare !== 0) return dateCompare;
        return b.id - a.id;
    });

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <Title
                title={"초코의 음수량"}
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
