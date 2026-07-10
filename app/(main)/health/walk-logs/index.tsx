import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import {
    VictoryChart,
    VictoryLine,
    VictoryAxis,
    VictoryScatter,
    VictoryArea,
} from "victory-native";
import { format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import TextComponent from "@/components/common/text/TextComponent";
import { WalkLog, WalkLogStats } from "@/types/walkLog";
import walkLogApi from "@/api/user/walkLogApi";
import Card from "@/components/common/card/Card";
import WalkLogModal from "@/app/(main)/health/walk-logs/components/WalkLogModal";
import HistorySection from "@/app/(main)/health/walk-logs/components/HistorySection";

function WalkLogListPage() {
    const router = useRouter();

    // ⚠️ 실무 적용 시 useLocalSearchParams() 등으로 동적 처리 필요
    const petId = 1;

    const [stats, setStats] = useState<WalkLogStats | null>(null);
    const [history, setHistory] = useState<WalkLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [chartWidth, setChartWidth] = useState(300);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 날짜 관련 기준 계산
    const today = new Date();
    const endDate = format(today, "yyyy-MM-dd");
    const startDate = format(subDays(today, 6), "yyyy-MM-dd");
    const displayDateRange = `${format(subDays(today, 6), "MM/dd")} ~ ${format(today, "MM/dd")}`;

    const last7Days = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => format(subDays(today, 6 - i), "yyyy-MM-dd"));
    }, []);

    // API 데이터 페칭
    const fetchWalkLogData = useCallback(async () => {
        if (!petId) return;
        try {
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
    }, [startDate, endDate, router, petId]);

    useEffect(() => {
        fetchWalkLogData().then();
    }, [fetchWalkLogData]);

    // 💡 차트 데이터 및 Y축 눈금 최적화 연산 (리렌더링 시 재계산 방지)
    const { chartData, yMax, yTickValues } = useMemo(() => {
        const data = last7Days.map(dateStr => {
            const [, month, day] = dateStr.split("-");
            const label = `${parseInt(month, 10)}/${parseInt(day, 10)}`;
            const found = stats?.graphData.find(d => d.date?.startsWith(dateStr));
            return { x: label, y: found ? found.duration : 0 };
        });

        const actualMax = Math.max(...data.map(d => d.y), 0);
        const max = Math.max(150, Math.ceil(actualMax / 30) * 30); // 최소 150분 보장
        const ticks = Array.from({ length: max / 30 + 1 }, (_, i) => i * 30);

        return { chartData: data, yMax: max, yTickValues: ticks };
    }, [stats, last7Days]);

    // 💡 HistorySection용 액션 핸들러 함수들
    const handleAddPress = () => {
        setIsModalVisible(true);
    };

    const handleEditLog = (id: number) => {
        // 수정 팝업 오픈 혹은 페이지 이동 로직 작성부
        console.log(`Edit walk log ID: ${id}`);
    };

    const handleDeleteLog = async (id: number) => {
        // 삭제 확인 컨펌 및 API 호출 로직 작성부
        console.log(`Delete walk log ID: ${id}`);
    };

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <Title
                title={"초코의 산책 기록"}
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
                        <View className={twMerge("mb-10")}>
                            <Card
                                shadow={"sm"}
                                className={twMerge("w-full items-center")}
                                onLayout={event => {
                                    const { width } = event.nativeEvent.layout;
                                    setChartWidth(width - 40); // 내부 패딩 여백 차감
                                }}>
                                <View
                                    className={twMerge(
                                        "w-full flex-row justify-between items-center mb-0",
                                    )}>
                                    <View>
                                        <TextComponent className={twMerge("text-[20px] font-bold")}>
                                            최근 일주일 통계
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(
                                                "text-[12px] text-text-secondary mt-1",
                                            )}>
                                            DATE {displayDateRange}
                                        </TextComponent>
                                    </View>
                                    <View className={twMerge("items-end")}>
                                        <TextComponent
                                            className={twMerge("text-sm font-bold text-[#e87c71]")}>
                                            총 {stats?.summary.totalWalks || 0}회
                                        </TextComponent>
                                        <TextComponent
                                            className={twMerge(
                                                "text-sm font-bold text-success-contrast mt-1",
                                            )}>
                                            총 {stats?.summary.totalDuration || 0}분
                                        </TextComponent>
                                    </View>
                                </View>

                                <VictoryChart
                                    width={chartWidth}
                                    height={220}
                                    domain={{ y: [0, yMax] }}
                                    padding={{ top: 20, bottom: 30, left: 35, right: 20 }} // 왼쪽 숫자 간격 확보용 패딩 수정
                                >
                                    <VictoryAxis
                                        style={{
                                            axis: { stroke: "#D1D5DB" },
                                            tickLabels: { fill: "#888", fontSize: 12, padding: 10 },
                                            grid: { stroke: "transparent" },
                                        }}
                                    />
                                    <VictoryAxis
                                        dependentAxis
                                        tickValues={yTickValues}
                                        style={{
                                            axis: { stroke: "transparent" },
                                            tickLabels: { fill: "#888", fontSize: 12, padding: 15 }, // 💡 그래프 선과 숫자 간격 수정 반영
                                            grid: { stroke: "#D1D5DB", strokeDasharray: "4, 4" },
                                        }}
                                    />

                                    {/* 그래프 하단 연분홍 채우기 영역 */}
                                    <VictoryArea
                                        data={chartData}
                                        style={{
                                            data: {
                                                fill: "rgba(232, 124, 113, 0.15)",
                                            },
                                        }}
                                    />

                                    <VictoryLine
                                        data={chartData}
                                        style={{
                                            data: { stroke: "#e87c71", strokeWidth: 3 },
                                        }}
                                    />
                                    <VictoryScatter
                                        data={chartData}
                                        size={4}
                                        style={{
                                            data: {
                                                fill: "#FFF",
                                                stroke: "#e87c71",
                                                strokeWidth: 2,
                                            },
                                        }}
                                    />
                                </VictoryChart>
                            </Card>
                        </View>

                        {/* 모달 팝업 컴포넌트 */}
                        <WalkLogModal
                            visible={isModalVisible}
                            onClose={() => setIsModalVisible(false)}
                            petId={petId}
                            reload={fetchWalkLogData}
                        />

                        {/* 💡 분리 및 인터페이스 개선 완료된 히스토리 섹션 */}
                        <HistorySection
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

// TODO: 메모는 어떻게 써먹을지, 수정/삭제 기능추가. 그리고 이에 앞서 전체코드 이해하기. 특히 컴포넌트 전달 부분. 
