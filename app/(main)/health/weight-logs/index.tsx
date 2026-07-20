import React, { useCallback, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { useRouter, useFocusEffect } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import { weightLogApi } from "@/api/user/weightLogApi";
import { WeightLog } from "@/types/weightLog";
import WeightLogChartSection from "@/components/domain/weight-logs/WeightLogChartSection";
import WeightLogModal from "@/components/domain/weight-logs/WeightLogModal";
import WeightLogHistorySection from "@/components/domain/weight-logs/WeightLogHistorySection";
import { usePetStore } from "@/stores/pet/usePetStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";

function WeightLogListPage() {
    const router = useRouter();
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;
    const { isLoggedIn } = useAuthStore();

    const [history, setHistory] = useState<WeightLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState<WeightLog | null>(null);


    const fetchWeightLogData = useCallback(async () => {
        if (!isLoggedIn || !petId) {
            setHistory([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await weightLogApi.getByPetId(petId);
            setHistory(response.data.data);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
            } else {
                Alert.alert("오류", "데이터를 불러오는 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn, petId]);

    useFocusEffect(
        useCallback(() => {
            fetchWeightLogData().then();
        }, [fetchWeightLogData]),
    );

    const handleAddPress = () => {
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
            if (Platform.OS === "web") {
                alert("반려동물을 먼저 등록해주세요.");
            } else {
                Alert.alert("알림", "반려동물을 먼저 등록해주세요.");
            }
            return;
        }
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
                title={selectedPet ? `${selectedPet.name}의 몸무게` : "몸무게 기록"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
                className={"bg-background-paper"}
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <ScrollView>
                    <ContentContainer className={"overflow-hidden flex-1"}>
                        <WeightLogChartSection history={history} />

                        <WeightLogModal
                            visible={isModalVisible}
                            onClose={handleCloseModal}
                            petId={petId!}
                            reload={fetchWeightLogData}
                            initialData={selectedLog}
                        />

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
