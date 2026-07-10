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
import TextComponent from "../../../../components/common/text/TextComponent";
import { useCallback, useState } from "react";
import Title from "../../../../components/common/title/Title";
import { weightLogApi } from "@/api/user/weightLogApi";
import { WeightLog } from "@/types/WeightLog";
import WeightLogEditModal from "@/components/common/weight/WeightLogEditModal";


const screenWidth = Dimensions.get("window").width;

export default function WeightLogListPage() {
    const [historyData, setHistoryData] = useState<WeightLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
    const [selectedLogData, setSelectedLogData] = useState<WeightLog | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await weightLogApi.getByPetId(1);
            setHistoryData(response.data.data);
        } catch (error) {
            console.log(error);
            const msg = "데이터를 불러오는데 실패했습니다.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditPress = (log: WeightLog) => {
        setSelectedLogId(log.id);
        setSelectedLogData(log);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const processDelete = async () => {
            try {
                await weightLogApi.delete(id);
                fetchData().then(() => {});
            } catch (error) {
                console.log(error);
                const msg = "삭제에 실패했습니다.";
                Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
            }
        };

        if (Platform.OS === "web") {
            const isConfirmed = confirm("정말 삭제하시겠습니까?");
            if (isConfirmed) processDelete().then(() => {});
        } else {
            Alert.alert("삭제", "정말 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: processDelete },
            ]);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData().then(() => {});
        }, []),
    );

    const chartWidth = Math.max(screenWidth - 80, 200);
    const chartRecords = [...historyData].slice(0, 7).reverse();

    const chartLabels = chartRecords.map(item => {
        const dateParts = item.recordDate.split(/[-/]/);
        if (dateParts.length >= 2) {
            const month = parseInt(dateParts[dateParts.length - 2], 10);
            const day = parseInt(dateParts[dateParts.length - 1], 10);
            return `${month}/${day}`;
        }
        return item.recordDate;
    });

    const chartWeights = chartRecords.map(item => item.weight);

    const getChartDateRangeText = () => {
        if (chartRecords.length === 0) return "DATE -";
        if (chartRecords.length === 1) return `DATE ${chartLabels[0]}`;
        return `DATE ${chartLabels[0]} ~ ${chartLabels[chartLabels.length - 1]}`;
    };

    // @ts-ignore
    return (
        <>
            <Title
                title={"초코의 몸무게"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
            />
            <ScrollView className="flex-1 bg-background-default px-5 pt-12">
                {/* 상단 차트 영역 (기존 로직 100% 유지) */}
                <View className="bg-background-paper p-4 rounded-[10px] border border-divider mb-6 min-h-[260px] justify-center">
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#E95244" />
                    ) : chartWeights.length > 0 ? (
                        <>
                            <TextComponent className="text-sm font-bold text-text-secondary mb-4">
                                {getChartDateRangeText()}
                            </TextComponent>
                            <LineChart
                                data={{
                                    labels: chartLabels,
                                    datasets: [{ data: chartWeights }],
                               }}
                                width={chartWidth}
                                height={200}
                                chartConfig={{
                                    backgroundColor: "#FFFFFF",
                                    backgroundGradientFrom: "#FFFFFF",
                                    backgroundGradientTo: "#FFFFFF",
                                    color: (opacity = 1) => `rgba(233, 82, 68, ${opacity})`,
                                    labelColor: () => "#7F8C8D",
                                    propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffffff" },
                                }}
                                bezier
                            />
                        </>
                    ) : (
                        <View className="items-center justify-center py-10">
                            <TextComponent className="text-sm text-text-secondary">
                                최근 몸무게 기록이 없습니다.
                            </TextComponent>
                        </View>
                    )}
                </View>

                {/* 히스토리 헤더 */}
                <View className="flex-row justify-between items-center mb-4">
                    <TextComponent className="text-lg font-bold text-text-default">
                        History
                    </TextComponent>
                    <Pressable
                        onPress={() => router.push("/(main)/health/weight-logs/create")}
                        className="bg-secondary-main p-2 rounded-lg">
                        <FontAwesome name="plus" size={16} color="white" />
                    </Pressable>
                </View>

                {/* 히스토리 리스트 영역 */}
                {isLoading ? (
                    <ActivityIndicator size="small" color="#7F8C8D" className="mt-5" />
                ) : (
                    historyData.map((item, index) => {
                        let calcChange = item.change;
                        if (calcChange === undefined || calcChange === null) {
                            if (index === 0) {
                                calcChange = 0;
                            } else {
                                calcChange = Number(
                                    (item.weight - historyData[index - 1].weight).toFixed(1),
                                );
                            }
                        }

                        let badgeBg = "bg-divider";
                        let badgeText = "text-text-secondary";
                        let changeLabel = "0";

                        if (calcChange > 0) {
                            badgeBg = "bg-error-main";
                            badgeText = "text-text-default";
                            changeLabel = `+${calcChange}`;
                        } else if (calcChange < 0) {
                            badgeBg = "bg-success-main";
                            badgeText = "text-text-default";
                            changeLabel = `${calcChange}`;
                        }

                        return (
                            <View
                                key={item.id}
                                className="bg-background-paper p-4 rounded-[10px] border border-divider mb-3 flex-row justify-between items-center">
                                <View className="flex-row items-center gap-3">
                                    <TextComponent className="text-lg font-bold text-text-default">
                                        {item.weight}kg
                                    </TextComponent>

                                    <View
                                        className={`${badgeBg} px-2 py-0.5 rounded-[6px] items-center justify-center`}>
                                        <TextComponent className={`${badgeText} text-xs font-bold`}>
                                            {changeLabel}
                                        </TextComponent>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <TextComponent className="text-sm text-text-secondary mr-2">
                                        {item.recordDate}
                                    </TextComponent>

                                    <Pressable
                                        hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
                                        onPress={() => handleEditPress(item)}>
                                        <FontAwesome name="pencil" size={16} color="#7F8C8D" />
                                    </Pressable>

                                    <Pressable
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

            {/* ➡️ [추가] 모달 활성화 조건이 충족됐을 때 띄우는 완전체 모달 바인딩 */}
            {isEditModalOpen && selectedLogId !== null && selectedLogData && (
                <WeightLogEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedLogId(null);
                        setSelectedLogData(null);
                    }}
                    onSuccess={fetchData} // 수정 완료되면 차트와 리스트가 자동으로 다시 호출됨
                    logId={selectedLogId}
                    initialData={{
                        recordDate: selectedLogData.recordDate,
                        weight: selectedLogData.weight,
                        memo: selectedLogData.memo ?? undefined,
                        petId: selectedLogData.petId,
                    }}
                />
            )}
        </>
    );
}
