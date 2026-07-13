import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DashboardData, getHomeDashboard } from "@/api/home";
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

    const [data, setData] = useState<DashboardData | null>(null);

    const loadDashboard = useCallback(async () => {
        const petId = 1;

        try {
            const dashboardResult = await getHomeDashboard(petId, todayDate);

            if (dashboardResult.success) {
                setData(dashboardResult.data);
            }
        } catch (error) {
            console.error(error);
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
        <ScrollView className="flex-1 pt-1.8 bg-background-default">
            <View className="flex-row flex-wrap justify-between mt-6">
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
                            "border border-none rounded-[10px]",
                            "rounded-[28px]",
                            "bg-background-paper",
                            "rounded-[28px]"
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
