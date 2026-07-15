import React, { useCallback, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { useRouter, useFocusEffect } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import { weightLogApi } from "@/api/user/weightLogApi";
import { WeightLog } from "@/types/weightLog";
import WeightLogChartSection from "@/app/(main)/health/weight-logs/WeightLogChartSection";
import WeightLogModal from "@/app/(main)/health/weight-logs/WeightLogModal";
import WeightLogHistorySection from "@/app/(main)/health/weight-logs/WeightLogHistorySection";
import { usePetStore } from "@/stores/usePetStore";
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

    // API 데이터 페칭
    const fetchWeightLogData = useCallback(async () => {
        // 💡 펫이 없으면 빈 배열 상태로 두고 로딩만 종료 (빈 화면 렌더링)
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
        // 💡 펫이 없는데 추가 버튼을 누를 경우 방어 로직
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
                        {/* 💡 history가 빈 배열([])로 넘어가므로 자식 컴포넌트들에서 '기록이 없습니다' 등의 UI를 보여주게 됩니다. */}
                        <WeightLogChartSection history={history} />

                        {/* 모달 팝업 컴포넌트 (petId가 undefined일 경우를 대비해 Number() 또는 as number 처리 가능, 여기선 모달이 안 열리게 막아둠) */}
                        <WeightLogModal
                            visible={isModalVisible}
                            onClose={handleCloseModal}
                            petId={petId!} // ! (Non-null assertion) 사용: 어차피 petId 없으면 열리지 않음
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
