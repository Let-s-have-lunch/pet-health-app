import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import { WalkLog, WalkLogStats } from "@/types/walkLog";
import walkLogApi from "@/api/user/walkLogApi";
import WalkLogModal from "@/app/(main)/health/walk-logs/WalkLogModal";
import WalkLogHistorySection from "@/app/(main)/health/walk-logs/WalkLogHistorySection";
import WalkLogChartSection from "@/app/(main)/health/walk-logs/WalkLogChartSection";
import { usePetStore } from "@/stores/usePetStore";
// 💡 1. Auth 스토어 임포트
import { useAuthStore } from "@/stores/auth/useAuthStore";

function WalkLogListPage() {
    const router = useRouter();
    // 💡 2. 로그인 여부 가져오기
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const { selectedPet } = usePetStore();
    const petId = selectedPet?.id;

    const [stats, setStats] = useState<WalkLogStats | null>(null);
    const [history, setHistory] = useState<WalkLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState<WalkLog | null>(null);

    // 날짜 관련 기준 계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const today = new Date();
    const endDate = format(today, "yyyy-MM-dd");
    const startDate = format(subDays(today, 6), "yyyy-MM-dd");
    const displayDateRange = `${format(subDays(today, 6), "MM/dd")} ~ ${format(today, "MM/dd")}`;

    const last7Days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), "yyyy-MM-dd"));
    }, [today]);

    // API 데이터 페칭
    const fetchWalkLogData = useCallback(async () => {
        // 💡 3. 핵심 방어막! 로그인을 안 했거나 펫이 없으면 API 호출 막기
        if (!isLoggedIn || !petId) {
            setStats(null); // 통계 빈 데이터 처리
            setHistory([]); // 히스토리 빈 배열 처리
            setIsLoading(false); // 로딩 해제 (빈 화면 렌더링)
            return;
        }

        try {
            setIsLoading(true); // 💡 다시 로딩 시작 (새로고침 등 펫이 바뀔 때를 대비)
            const statsData = await walkLogApi.getWalkLogStats(petId, startDate, endDate);
            const historyData = await walkLogApi.getWalkLogs(petId);
            setStats(statsData);
            setHistory(historyData);
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
    }, [isLoggedIn, petId, startDate, endDate, router]); // 💡 의존성 배열에 isLoggedIn 추가

    useEffect(() => {
        fetchWalkLogData().then();
    }, [fetchWalkLogData]);

    // 💡 4. 추가 버튼 클릭 시 방어 로직
    const handleAddPress = () => {
        if (!isLoggedIn) {
            if (Platform.OS === "web") alert("로그인이 필요한 서비스입니다.");
            else Alert.alert("알림", "로그인이 필요한 서비스입니다.");
            return;
        }
        if (!petId) {
            if (Platform.OS === "web") alert("반려동물을 먼저 등록해주세요.");
            else Alert.alert("알림", "반려동물을 먼저 등록해주세요.");
            return;
        }
        setIsModalVisible(true);
    };

    const handleEditLog = (walkLogId: number) => {
        const targetLog = history.find(log => log.id === walkLogId);
        if (targetLog) {
            setIsModalVisible(true);
            setSelectedLog(targetLog);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedLog(null);
    };

    const handleDeleteLog = async (walkLogId: number) => {
        const executeDelete = async () => {
            try {
                await walkLogApi.deleteWalkLog(walkLogId);
                await fetchWalkLogData();
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("산책기록을 삭제하는 중 오류가 발생했습니다.");
                } else {
                    Alert.alert("오류", "산책기록을 삭제하는 중 오류가 발생했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 산책기록을 삭제 처리 하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("경고", "정말 이 산책기록을 삭제 처리 하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <Title
                title={selectedPet ? `${selectedPet.name}의 산책 기록` : "산책 기록"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
                className={"bg-background-paper"}
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <ScrollView>
                    <ContentContainer className={"overflow-hidden flex-1"}>
                        {/* 📊 통계 섹션 */}
                        <WalkLogChartSection
                            stats={stats}
                            last7Days={last7Days}
                            displayDateRange={displayDateRange}
                        />

                        {/* 모달 팝업 컴포넌트 */}
                        <WalkLogModal
                            visible={isModalVisible}
                            onClose={handleCloseModal}
                            petId={petId!} // 💡 TS 에러 방지용 '!' 추가
                            reload={fetchWalkLogData}
                            initialData={selectedLog}
                        />

                        {/* 히스토리 섹션 */}
                        <WalkLogHistorySection
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

export default WalkLogListPage;
