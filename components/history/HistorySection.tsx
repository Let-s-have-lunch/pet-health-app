import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DashboardData, getHomeDashboard } from "@/api/home";
import { waterIntakeApi } from "@/api/user/waterIntakeApi";
import { weightLogApi } from "@/api/user/weightLogApi";
import TextComponent from "@/components/common/text/TextComponent";

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function HistorySection() {
    const [isLoading, setIsLoading] = useState(true);
    const todayDate = getTodayString();

    const [data, setData] = useState<DashboardData | null>({
        date: todayDate,
        walk: { count: 0 },
        weight: { value: 0 }, // 🐶 여기에 최신 몸무게가 담길 예정
        water: { totalAmount: 0 },
        vetRecord: null,
    });

    const loadDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            const petId = 1; // 실제 선택된 펫 ID 변수로 대체 가능

            // 1. 기존 대시보드 데이터 호출
            const dashboardResult = await getHomeDashboard(petId, todayDate);
            // 2. 💧 펫의 전체 음수량 기록 리스트 호출
            const waterLogsResult = await waterIntakeApi.getByPetId(petId);
            // 3. 🐶 펫의 전체 몸무게 기록 리스트 호출
            const weightLogsResult = await weightLogApi.getByPetId(petId);

            if (dashboardResult.success) {
                let latestWaterAmount = 0;
                let latestWeightValue = 0; // 🐶 최신 몸무게 변수 초기화

                // 💧 전체 리스트 중 가장 최근(배열의 마지막)에 등록된 음수량 기록 찾기
                if (waterLogsResult?.data?.data && waterLogsResult.data.data.length > 0) {
                    const logs = waterLogsResult.data.data;
                    latestWaterAmount = logs[logs.length - 1].amount;
                }

                // 🐶 전체 리스트 중 가장 최근(배열의 첫 번째)에 등록된 몸무게 기록 찾기
                if (weightLogsResult?.data?.data && weightLogsResult.data.data.length > 0) {
                    const weightLogs = weightLogsResult.data.data;
                    latestWeightValue = weightLogs[0].weight;
                }

                // 대시보드 상태 세팅할 때 물, 몸무게 최신 데이터로 변경해 주기
                setData({
                    ...dashboardResult.data,
                    water: {
                        totalAmount: latestWaterAmount,
                    },
                    weight: {
                        value: latestWeightValue,
                    },
                });
            }
        } catch (error) {
            console.log(error);
            const msg = "대시보드 데이터를 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [todayDate]);

    // 🐶 useEffect 대신 useFocusEffect 적용 (화면으로 돌아올 때 즉시 새로고침)
    useFocusEffect(
        useCallback(() => {
            loadDashboard().then(() => {});
        }, [loadDashboard]),
    );

    // 🎨 카드 설정 데이터
    const cardConfig = [
        {
            id: "walk",
            title: "산책",
            onPress: () => router.push("/health/walk-logs"),
            renderBottom: () => (
                <View className="flex-row justify-end items-center gap-3">
                    <Ionicons name="paw" size={22} color="#BACFCD" />
                    <TextComponent className="font-bold text-2xl" style={{ color: "#2C2C2C" }}>
                        {data?.walk.count ?? 0}회
                    </TextComponent>
                </View>
            ),
        },
        {
            id: "weight",
            title: "몸무게",
            onPress: () => router.push("/(main)/health/weight-logs"),
            renderBottom: () => (
                <View className="flex-row justify-end items-center gap-1">
                    <Ionicons name="fitness" size={22} color="#D9A05B" />
                    <TextComponent className="font-bold text-2xl" style={{ color: "#2C2C2C" }}>
                        {data?.weight.value ?? 0}kg
                    </TextComponent>
                </View>
            ),
        },
        {
            id: "water",
            title: "물",
            // 🚀 [기획 수정] 모달 대신 몸무게처럼 그래프/리스트가 있는 상세 페이지로 이동!
            onPress: () => router.push("/(main)/health/water-logs"),
            renderBottom: () => (
                <View className={twMerge("flex-row", "justify-end", "items-center", "gap-1.5")}>
                    <Ionicons name={"water"} size={22} color={"#A9C6D9"} />
                    <TextComponent
                        className="font-bold text-2xl text-right"
                        style={{ color: "#2C2C2C" }}>
                        {data?.water.totalAmount ?? 0}ml
                    </TextComponent>
                </View>
            ),
        },
        {
            id: "vet",
            title: "병원",
            onPress: () => router.push("/(main)/health/vet-records"),
            renderBottom: () =>
                data?.vetRecord ? (
                    <View className="flex-row justify-end items-center gap-1.5">
                        <Ionicons name="medkit" size={20} color="#E8A7A1" />
                        <View className="items-end">
                            <TextComponent
                                className="text-sm font-semibold"
                                style={{ color: "#2C2C2C" }}>
                                {data.vetRecord.purpose}
                            </TextComponent>
                            <TextComponent className="text-xs" style={{ color: "#7F8F8D" }}>
                                {data.vetRecord.hospitalName}
                            </TextComponent>
                        </View>
                    </View>
                ) : (
                    <View className="flex-row justify-end items-center gap-1">
                        <Ionicons name="medkit" size={20} color="#D1D1D1" />
                        <TextComponent className="text-sm" style={{ color: "#7F8C8D" }}>
                            기록 없음
                        </TextComponent>
                    </View>
                ),
        },
    ];

    if (isLoading) {
        return (
            <View
                className={twMerge(["flex-1", "justify-center", "items-center"])}
                style={{ backgroundColor: "#F1EBE4" }}>
                <ActivityIndicator size={"large"} color={"#BACFCD"} />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 pt-7 bg-background-default">
            <View className="flex-row flex-wrap justify-between px-5 mt-6">
                {cardConfig.map(card => (
                    <Pressable
                        key={card.id}
                        onPress={card.onPress}
                        disabled={!card.onPress}
                        className={twMerge([
                            "w-[48%]",
                            "h-40",
                            "p-5",
                            "mb-4",
                            "justify-between",
                            "border border-divider rounded-[10px]",
                            "bg-background-paper",
                        ])}>
                        <View className="flex-row justify-between items-start">
                            <View>
                                <TextComponent className="font-bold text-base text-text-default">
                                    {card.title}
                                </TextComponent>
                                <TextComponent className="text-xs mt-1 text-text-secondary">
                                    {data?.date}
                                </TextComponent>
                            </View>
                        </View>

                        {card.renderBottom()}
                    </Pressable>
                ))}
            </View>

            {/*<MedicalHistorySection />*/}
        </ScrollView>
    );
}
