import { View, ScrollView, Dimensions, Pressable, Platform, Alert } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { router, useFocusEffect } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import TextComponent from "../../../../components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import { useCallback, useState } from "react";
import Title from "../../../../components/common/title/Title";
import { weightLogApi } from ".././../../../api/user/weightLogApi";
import { WeightLog } from "@/types/WeightLog";

const screenWidth = Dimensions.get("window").width;

export default function WeightLogListPage() {
    const [historyData, setHistoryData] = useState<WeightLog[]>([]);

    const getChangeColor = (change: number) => {
        return change > 0.5 ? "bg-error-main" : "bg-success-main";
    };

    const fetchData = async () => {
        try {
            // API 응답 구조가 { data: WeightLog[] } 라고 가정
            const response = await weightLogApi.getByPetId(1);
            setHistoryData(response.data.data);
        } catch (error) {
            console.log(error);
            const msg = "데이터를 불러오는데 실패했습니다.";
            // eslint-disable-next-line no-unused-expressions
            Platform.OS === "web" ? alert(msg) : Alert.alert("오류", msg);
        }
    };
    // [추가: handleDelete 함수 (삭제 로직)]
    const handleDelete = async (id: number) => {
        Alert.alert("삭제", "정말 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        await weightLogApi.delete(id);
                        fetchData().then(() => {})
                    } catch (error) {
                        console.log(error);
                        Alert.alert("오류", "삭제에 실패했습니다.");
                    }
                },
            },
        ]);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData().then(() => {});
        }, []),
    );

    const chartWidth = Math.max(screenWidth - 80, 200);

    return (
        <>
            <Title
                title={"초코의 몸무게"}
                showBackButton={true}
                onBackPress={() => router.push("/")}
            />
            <ScrollView className="flex-1 bg-background-default px-5 pt-12">
                <View className="bg-background-paper p-4 rounded-[10px] border border-divider mb-6">
                    <TextComponent className="text-sm font-bold text-text-secondary mb-4">
                        DATE 07/01 ~ 07/07
                    </TextComponent>
                    <LineChart
                        data={{
                            labels: ["7/1", "7/2", "7/3", "7/4", "7/5", "7/6", "7/7"],
                            datasets: [{ data: [10.1, 10.3, 10.4, 10.5, 10.4, 10.3, 10.4] }],
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
                </View>

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

                {historyData.map(item => (
                    <View
                        key={item.id}
                        className="bg-background-paper p-4 rounded-[10px] border border-divider mb-3 flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <TextComponent className="text-lg font-bold text-text-default mr-3">
                                {item.weight}kg
                            </TextComponent>

                            <View
                                className={twMerge(
                                    "px-2 py-0.5 rounded",
                                    getChangeColor(item.change),
                                )}>
                                <TextComponent className="text-xs font-bold text-text-default">
                                    {item.change > 0 ? `+${item.change}` : item.change}
                                </TextComponent>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <TextComponent className="text-sm text-text-secondary mr-2">
                                {item.recordDate}
                            </TextComponent>
                            // Todo: 내일은 수정 기능 처리와 음수량 그래프 작성
                            <Pressable
                                onPress={() => {
                                    /* 수정 버튼 */
                                }}>
                                <FontAwesome name="pencil" size={16} color="#7F8C8D" />
                            </Pressable>
                            <Pressable onPress={() => handleDelete(item.id)}>
                                <FontAwesome name="trash" size={16} color="#7F8C8D" />
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </>
    );
}
