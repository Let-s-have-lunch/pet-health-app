import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DashboardData, getHomeDashboard } from "@/api/user/dashboardApi";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { format } from "date-fns";
import { usePetStore } from "@/stores/pet/usePetStore";

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
    const { selectedPet, isAddCardSelected } = usePetStore();
    const petId = selectedPet?.id;
    const [data, setData] = useState<DashboardData | null>(null);

    const loadDashboard = useCallback(async () => {
        if (!petId) {
            setIsLoading(false);
            return;
        }

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
    }, [petId, todayDate]); // 의존성 배열도 깔끔하게 유지

    useEffect(() => {
        if (isAddCardSelected) {
            setData(null);
            return;
        }

        if (!selectedPet) return;

        void loadDashboard();
    }, [isAddCardSelected, selectedPet, loadDashboard]);

    useFocusEffect(
        useCallback(() => {
            loadDashboard().then(() => {});
        }, [loadDashboard]),
    );

    // 🎨 카드 설정 데이터
    const cardConfig = [
        {
            id: "walk",
            title: "오늘의 산책",
            dateLabel: data ? data.walk.date : "-",
            onPress: () => router.push("/health/walk-logs"),
            renderBottom: () => (
                <View className="flex-row justify-end items-center gap-3">
                    <Ionicons name="paw" size={22} color="#BACFCD" />
                    <TextComponent className="font-bold text-2xl text-text-default">
                        {data?.walk.count ?? 0}회
                    </TextComponent>
                </View>
            ),
        },
        {
            id: "weight",
            title: "최근 몸무게",
            dateLabel: data?.weight?.date ? format(new Date(data.weight.date), "yyyy-MM-dd") : "-",
            onPress: () => router.push("/(main)/health/weight-logs"),
            renderBottom: () =>
                data?.weight?.value ? (
                    // 💡 기록이 있을 때 (원래 스타일)
                    <View className="flex-row justify-end items-center gap-1">
                        <Ionicons name="fitness" size={22} color="#D9A05B" />
                        <TextComponent className="font-bold text-2xl text-text-default">
                            {data.weight.value}kg
                        </TextComponent>
                    </View>
                ) : (
                    // 💡 기록이 없을 때 (병원 '기록 없음'과 완벽히 동일한 스타일)
                    <View className="flex-row justify-end items-center gap-1">
                        <Ionicons name="fitness" size={20} color="#D1D1D1" />
                        <TextComponent className="text-xs" style={{ color: "#7F8C8D" }}>
                            등록된 몸무게 기록이 없습니다.
                        </TextComponent>
                    </View>
                ),
        },
        {
            id: "water",
            title: "오늘의 음수량",
            dateLabel: data ? data.water.date : "-",
            onPress: () => router.push("/(main)/health/water-logs"),
            renderBottom: () => (
                <View className={twMerge("flex-row", "justify-end", "items-center", "gap-1.5")}>
                    <Ionicons name={"water"} size={22} color={"#A9C6D9"} />
                    <TextComponent
                        className={twMerge(["font-bold text-2xl text-right text-text-default"])}>
                        {data?.water.totalAmount ?? 0}ml
                    </TextComponent>
                </View>
            ),
        },
        {
            id: "vet",
            title: "병원 예약",
            dateLabel: data?.vetRecord?.time
                ? format(new Date(data.vetRecord.time), "yyyy-MM-dd")
                : "-",
            onPress: () => router.push("/(main)/health/vet-records"),
            renderBottom: () =>
                data?.vetRecord ? (
                    <View className="flex-row justify-end items-center gap-1.5">
                        <Ionicons name="medkit" size={20} color="#E8A7A1" />
                        <View className="items-end">
                            <TextComponent
                                className={twMerge(["text-sm font-semibold", "text-text-default"])}>
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
                        <TextComponent className="text-xs" style={{ color: "#7F8C8D" }}>
                            다가오는 예약이 없습니다.
                        </TextComponent>
                    </View>
                ),
        },
    ];

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <ScrollView className="flex-1 pt-1.8 bg-background-default">
            <View className="flex-row flex-wrap justify-between mt-2">
                {cardConfig.map(card => (
                    <Pressable
                        key={card.id}
                        onPress={card.onPress}
                        disabled={!card.onPress}
                        className={twMerge([
                            "w-[48%]",
                            "h-40",
                            "p-5",
                            "mt-4",
                            "justify-between",
                            "rounded-[28px]",
                            "bg-background-paper",
                        ])}>
                        <View>
                            <TextComponent className="font-bold text-base text-text-default">
                                {card.title}
                            </TextComponent>
                            <TextComponent className="text-xs mt-1 text-text-secondary">
                                {card.dateLabel}
                            </TextComponent>
                        </View>

                        {card.renderBottom()}
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}
