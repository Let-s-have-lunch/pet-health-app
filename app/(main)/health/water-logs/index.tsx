import {
    View,
    ScrollView,
    Dimensions,
    Pressable,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { router, useFocusEffect } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import TextComponent from "../../../../components/common/text/TextComponent";
import Title from "../../../../components/common/title/Title";
import WaterIntakeEditModal from "@/components/common/water/WaterIntakeEditModal";

import { waterIntakeApi } from "@/api/user/waterIntakeApi";
import { WaterIntakeLog } from "@/types/WaterIntakeLog";

const screenWidth = Dimensions.get("window").width;

const getTodayString = () => new Date().toISOString().split("T")[0];

export default function WaterLogListPage() {
    const [historyData, setHistoryData] = useState<WaterIntakeLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState<number>(0);
    const [selectedLogData, setSelectedLogData] = useState<WaterIntakeLog | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await waterIntakeApi.getByPetId(1);
            setHistoryData(response.data.data || []);
        } catch (error) {
            console.log(error);
            const msg = "데이터를 불러오는데 실패했습니다.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePress = () => {
        setSelectedLogId(0);
        setSelectedLogData(null);
        setIsEditModalOpen(true);
    };

    const handleEditPress = (log: WaterIntakeLog) => {
        setSelectedLogId(log.id);
        setSelectedLogData(log);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const processDelete = async () => {
            try {
                await waterIntakeApi.delete(id);
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

    // 최신 날짜가 맨 앞(index 0)으로 오도록 정렬 (증감량 계산용)
    const sortedHistory = [...historyData].sort((a, b) => {
        const dateCompare = b.recordDate.localeCompare(a.recordDate);
        if (dateCompare !== 0) return dateCompare;
        return b.id - a.id;
    });

    const chartWidth = Math.max(screenWidth - 72, 200);

    // 차트용 데이터는 왼쪽이 과거, 오른쪽이 최신이 되도록 뒤집기
    const chartRecords = [...sortedHistory].slice(0, 7).reverse();

    const chartLabels = chartRecords.map(item => {
        const parts = item.recordDate.split(/[-/]/);
        return parts.length >= 2 ? `${parseInt(parts[1])}/${parseInt(parts[2])}` : item.recordDate;
    });

    const chartAmounts = chartRecords.map(item => item.amount);

    const dateRangeText =
        chartLabels.length > 0
            ? `DATE ${chartLabels[0]} ~ ${chartLabels[chartLabels.length - 1]}`
            : "DATE -";

    return (
        <>
            <Title
                title={"초코의 음수량"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
            />
            <ScrollView className="flex-1 bg-background-default px-5 pt-12">
                {/* 상단 차트 영역 */}
                <View className="bg-background-paper p-4 rounded-[10px] border border-divider mb-6 min-h-[260px] justify-center">
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#A9C6D9" />
                    ) : chartAmounts.length > 0 ? (
                        <>
                            <TextComponent className="text-sm font-bold text-text-secondary mb-2 px-2">
                                {dateRangeText}
                            </TextComponent>

                            <View className="items-center">
                                <LineChart
                                    data={{
                                        labels: chartLabels,
                                        datasets: [
                                            {
                                                data: chartAmounts,
                                            },
                                        ],
                                    }}
                                    width={chartWidth}
                                    height={200}
                                    fromZero={true}
                                    segments={4}
                                    chartConfig={{
                                        backgroundColor: "transparent",
                                        backgroundGradientFrom: "transparent",
                                        backgroundGradientTo: "transparent",
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientToOpacity: 0,

                                        // 💡 [핵심 수정] 기존에 쓰셨던 음수량 파란색상(#A9C6D9) 적용
                                        color: (opacity = 1) => `rgba(169, 198, 217, ${opacity})`,
                                        fillShadowGradient: `rgba(169, 198, 217, 1)`,
                                        fillShadowGradientOpacity: 0.25, // 물처럼 부드럽게 채워지는 투명도

                                        labelColor: () => "#7F8C8D",
                                        propsForDots: {
                                            r: "5",
                                            strokeWidth: "2",
                                            stroke: "#ffffff",
                                        },
                                        paddingRight: 16,
                                        formatYLabel: yValue =>
                                            Math.round(Number(yValue)).toString(),
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 10,
                                    }}
                                    bezier
                                />
                            </View>
                        </>
                    ) : (
                        <TextComponent className="text-center text-text-secondary">
                            기록이 없습니다.
                        </TextComponent>
                    )}
                </View>

                {/* 히스토리 헤더 */}
                <View className="flex-row justify-between items-center mb-4">
                    <TextComponent className="text-lg font-bold text-text-default">
                        History
                    </TextComponent>
                    <Pressable
                        onPress={handleCreatePress}
                        className="bg-secondary-main p-2 rounded-lg">
                        <FontAwesome name="plus" size={16} color="white" />
                    </Pressable>
                </View>

                {/* 리스트 영역 */}
                {isLoading ? (
                    <ActivityIndicator size="small" color="#7F8C8D" />
                ) : (
                    sortedHistory.map((item, index) => {
                        const previous =
                            index < sortedHistory.length - 1 ? sortedHistory[index + 1] : null;
                        const calcChange = previous ? item.amount - previous.amount : 0;
                        const cleanDate = item.recordDate.split("T")[0];

                        const isFirstRegistration = !previous;

                        return (
                            <View
                                key={item.id}
                                className="bg-background-paper p-4 rounded-[10px] border border-divider mb-3 flex-row justify-between items-center pr-3">
                                <View className="flex-row items-center gap-3">
                                    <View>
                                        <TextComponent className="text-lg font-bold text-text-default">
                                            {item.amount}ml
                                        </TextComponent>
                                    </View>

                                    <View
                                        className={`${
                                            isFirstRegistration
                                                ? "bg-gray-400"
                                                : calcChange > 0
                                                  ? "bg-success-main"
                                                  : calcChange < 0
                                                    ? "bg-error-main"
                                                    : "bg-divider"
                                        } px-2 py-0.5 rounded-[6px] items-center min-w-[45px]`}>
                                        <TextComponent className="text-xs font-bold text-white">
                                            {isFirstRegistration
                                                ? "시작"
                                                : calcChange > 0
                                                  ? `+${calcChange}`
                                                  : `${calcChange}`}
                                        </TextComponent>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-1">
                                    <TextComponent className="text-xs text-text-secondary mr-2">
                                        {cleanDate}
                                    </TextComponent>
                                    <Pressable
                                        className="w-8 h-8 items-center justify-center"
                                        onPress={() => handleEditPress(item)}>
                                        <FontAwesome name="pencil" size={16} color="#7F8C8D" />
                                    </Pressable>
                                    <Pressable
                                        className="w-8 h-8 items-center justify-center"
                                        hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
                                        onPress={() => handleDelete(item.id)}>
                                        <FontAwesome name="trash" size={16} color="#7F8C8D" />
                                    </Pressable>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {isEditModalOpen && (
                <WaterIntakeEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        void fetchData();
                        setIsEditModalOpen(false);
                    }}
                    logId={selectedLogId}
                    initialData={{
                        recordDate: selectedLogData?.recordDate ?? getTodayString(),
                        amount: selectedLogData?.amount ?? 0,
                        memo: selectedLogData?.memo ?? undefined,
                        petId: selectedLogData?.petId ?? 1,
                    }}
                />
            )}
        </>
    );
}
