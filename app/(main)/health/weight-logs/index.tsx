import React, { useCallback, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { useRouter, useFocusEffect } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import { weightLogApi } from "@/api/user/weightLogApi";
import { WeightLog } from "@/types/WeightLog";
import WeightLogChartSection from "@/components/weight/WeightLogChartSection";
import WeightLogModal from "@/components/weight/WeightLogModal";
import WeightLogHistorySection from "@/components/weight/PetHistorySection";

function WeightLogListPage() {
    const router = useRouter();
    const petId = 1;

    const [history, setHistory] = useState<WeightLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState<WeightLog | null>(null);

    // API 데이터 페칭
    const fetchWeightLogData = useCallback(async () => {
        if (!petId) return;
        try {
            setIsLoading(true);
            const response = await weightLogApi.getByPetId(petId);
            setHistory(response.data.data);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
                router.push("/");
            } else {
                Alert.alert("오류", "데이터를 불러오는 중 오류가 발생했습니다.", [
                    { text: "확인", onPress: () => router.push("/") },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [router, petId]);

    useFocusEffect(
        useCallback(() => {
            fetchWeightLogData().then();
        }, [fetchWeightLogData]),
    );

    // 💡 Action Handler Functions
    const handleAddPress = () => {
        setIsModalVisible(true);
    };

    const handleEditLog = (log: WeightLog) => {
        setIsModalVisible(true);
        setSelectedLog(log);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedLog(null);
    };

    const handleDeleteLog = async (logId: number) => {
        const executeDelete = async () => {
            try {
                await weightLogApi.delete(logId);
                await fetchWeightLogData();
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("몸무게 기록을 삭제하는 중 오류가 발생했습니다.");
                } else {
                    Alert.alert("오류", "몸무게 기록을 삭제하는 중 오류가 발생했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 몸무게 기록을 삭제 처리 하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("경고", "정말 이 몸무게 기록을 삭제 처리 하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <Title
                title={"초코의 몸무게"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
                className={"bg-background-paper"}
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <ScrollView>
                    <ContentContainer className={"overflow-hidden flex-1"}>
                        {/* 📊 차트 섹션 */}
                        <WeightLogChartSection history={history} />

                        {/* 모달 팝업 컴포넌트 */}
                        <WeightLogModal
                            visible={isModalVisible}
                            onClose={handleCloseModal}
                            petId={petId}
                            reload={fetchWeightLogData}
                            initialData={selectedLog}
                        />

                        {/* 히스토리 섹션 */}
                        <WeightLogHistorySection
                            history={history}
                            onAddPress={handleAddPress}
                            onEditPress={handleEditLog}
                            onDeletePress={handleDeleteLog}
                        />
                    </ContentContainer>
                </ScrollView>
            )}
        </View>
    );
}

export default WeightLogListPage;
