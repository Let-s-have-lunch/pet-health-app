import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Plus, Edit2, Trash2 } from "lucide-react-native";
import { format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { useRouter } from "expo-router";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import TextComponent from "@/components/common/text/TextComponent";
import { WalkLog, WalkLogStats } from "@/types/walkLog";
import walkLogApi from "@/api/user/walkLogApi";
import Button from "@/components/common/button/Button";
import WalkLogModal from "@/app/(main)/health/walk-logs/WalkLogModal";

// 💡 차트 설정 객체를 컴포넌트 밖으로 빼서 코드의 가독성을 높였습니다.
const CHART_CONFIG = {
    backgroundColor: "#F8F7F4",
    backgroundGradientFrom: "#F8F7F4",
    backgroundGradientTo: "#F8F7F4",
    decimalPlaces: 0, // 소수점 제거
    color: (opacity = 1) => `rgba(232, 124, 113, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(136, 136, 136, ${opacity})`,
    propsForDots: {
        r: "5",
        strokeWidth: "3",
        stroke: "#e87c71",
        fill: "#F8F7F4",
    },
    propsForBackgroundLines: {
        strokeDasharray: "4 4",
        stroke: "#D1D5DB",
    },
};

function WalkLogListPage() {
    const router = useRouter();
    const petId = 1;
    const [stats, setStats] = useState<WalkLogStats | null>(null);
    const [history, setHistory] = useState<WalkLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [chartWidth, setChartWidth] = useState(300);

    const today = new Date();
    const endDate = format(today, "yyyy-MM-dd");
    const startDate = format(subDays(today, 6), "yyyy-MM-dd");
    const displayDateRange = `${format(subDays(today, 6), "MM/dd")} ~ ${format(today, "MM/dd")}`;

    const [isModalVisible, setIsModalVisible] = useState(false);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        return format(subDays(today, 6 - i), "yyyy-MM-dd");
    });

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
                router.push("/")
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

    // 💡 별도의 변수 선언 없이, 객체 내부에서 map을 돌려 바로 데이터를 생성하도록 변경했습니다.
    const chartData = {
        labels: last7Days.map(dateStr => {
            const [, month, day] = dateStr.split("-");
            return `${parseInt(month, 10)}/${parseInt(day, 10)}`;
        }),
        datasets: [
            {
                // 실제 산책 데이터
                data: last7Days.map(dateStr => {
                    const found = stats?.graphData.find(d => d.date === dateStr);
                    return found ? found.duration : 0;
                }),
                strokeWidth: 4,
            },
            {
                // Y축 300 강제 고정을 위한 투명 더미 데이터
                data: [300],
                withDots: false,
                color: () => "transparent",
                strokeWidth: 0,
            },
        ],
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
                        <View className={twMerge("mb-20")}>
                            <View className={twMerge("flex-row justify-between items-center mb-4")}>
                                <View>
                                    <TextComponent className={twMerge("text-[20px] font-bold")}>
                                        최근 일주일 통계
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge("text-sm text-text-secondary mt-1")}>
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

                            <View
                                className={twMerge("w-full h-[200px] items-center")}
                                onLayout={event => {
                                    const { width } = event.nativeEvent.layout;
                                    setChartWidth(width);
                                }}>
                                <LineChart
                                    data={chartData}
                                    width={chartWidth}
                                    height={220}
                                    fromZero={true}
                                    segments={6}
                                    formatYLabel={yValue => Math.round(Number(yValue)).toString()}
                                    withVerticalLines={false}
                                    withOuterLines={false}
                                    chartConfig={CHART_CONFIG} // 분리된 설정 객체 사용
                                    style={{
                                        paddingRight: 35,
                                        paddingLeft: 30,
                                        marginTop: 10,
                                    }}
                                />
                            </View>
                        </View>

                        <WalkLogModal
                            visible={isModalVisible}
                            onClose={() => setIsModalVisible(false)}
                            petId={petId}
                            reload={fetchWalkLogData}
                        />

                        {/* 히스토리 섹션 */}
                        <View className={twMerge("mb-6")}>
                            <View className={twMerge("flex-row justify-between items-center mb-4")}>
                                <TextComponent className={twMerge("text-lg font-bold")}>
                                    History
                                </TextComponent>
                                <Button size={"small"} onPress={() => setIsModalVisible(true)}>
                                    <Plus size={20} color="#4A5568" />
                                </Button>
                            </View>

                            <View className={twMerge("flex-col gap-3")}>
                                {history.map(log => (
                                    <View
                                        key={log.id}
                                        className={twMerge(
                                            "bg-white p-4 rounded-2xl shadow-sm elevation-1 flex-row justify-between items-center",
                                        )}>
                                        <View className={twMerge("flex-row items-center gap-3")}>
                                            <TextComponent
                                                className={twMerge(
                                                    "text-base font-bold text-gray-800",
                                                )}>
                                                {log.duration}분
                                            </TextComponent>
                                            <View
                                                className={twMerge(
                                                    "bg-[#fceeed] px-2 py-0.5 rounded-full",
                                                )}>
                                                <TextComponent
                                                    className={twMerge(
                                                        "text-[#e87c71] text-xs font-bold",
                                                    )}>
                                                    완료
                                                </TextComponent>
                                            </View>
                                        </View>

                                        <View className={twMerge("flex-row items-center gap-4")}>
                                            <TextComponent
                                                className={twMerge("text-xs text-gray-400")}>
                                                {format(new Date(log.walkDate), "yy.MM.dd")}
                                            </TextComponent>
                                            <View className={twMerge("flex-row gap-2")}>
                                                <TouchableOpacity className={twMerge("p-1")}>
                                                    <Edit2 size={16} color="#718096" />
                                                </TouchableOpacity>
                                                <TouchableOpacity className={twMerge("p-1")}>
                                                    <Trash2 size={16} color="#F56565" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                {history.length === 0 && (
                                    <Text
                                        className={twMerge(
                                            "text-center text-gray-400 py-6 text-sm",
                                        )}>
                                        기록된 산책이 없습니다.
                                    </Text>
                                )}
                            </View>
                        </View>
                    </ContentContainer>
                </ScrollView>
            )}
        </View>
    );
}

export default WalkLogListPage;
