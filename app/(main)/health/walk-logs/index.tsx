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
                                    padding={{ top: 20, bottom: 30, left: 35, right: 20 }}>
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
                                            tickLabels: { fill: "#888", fontSize: 12, padding: 15 },
                                            grid: { stroke: "#D1D5DB", strokeDasharray: "4, 4" },
                                        }}
                                    />

                                    {/* 하단 연분홍 영역 (곡선 적용) */}
                                    <VictoryArea
                                        data={chartData}
                                        interpolation="catmullRom"
                                        style={{
                                            data: {
                                                fill: "rgba(232, 124, 113, 0.15)",
                                            },
                                        }}
                                    />

                                    {/* 두꺼운 반투명 배경 선 (Halo 효과) */}
                                    <VictoryLine
                                        data={chartData}
                                        interpolation="catmullRom"
                                        style={{
                                            data: {
                                                stroke: "rgba(232, 124, 113, 0.3)",
                                                strokeWidth: 14,
                                            },
                                        }}
                                    />

                                    {/* 얇고 진한 뼈대 메인 선 */}
                                    <VictoryLine
                                        data={chartData}
                                        interpolation="catmullRom"
                                        style={{
                                            data: {
                                                stroke: "#e87c71",
                                                strokeWidth: 2,
                                            },
                                        }}
                                    />

                                    {/* 꽉 차고 큼직한 점 */}
                                    <VictoryScatter
                                        data={chartData}
                                        size={6}
                                        style={{
                                            data: {
                                                fill: "#e87c71",
                                            },
                                        }}
                                    />
                                </VictoryChart>
                            </Card>
                        </View>

                        {/* 모달 팝업 컴포넌트 */}
                        <WalkLogModal
                            visible={isModalVisible}
                            onClose={handleCloseModal}
                            petId={petId}
                            reload={fetchWalkLogData}
                            initialData={selectedLog}
                        />

                        {/* 히스토리 섹션 */}
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
