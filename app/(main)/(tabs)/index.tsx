import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, View } from "react-native";
import PetCardSection from "../../(main)/(tabs)/components/PetCardSection";
import MedicalHistorySection from "../../(main)/(tabs)/components/MedicalHistorySection";
import { useCallback, useEffect, useState } from "react";
import { DashboardData, getHomeDashboard } from "../../../api/home";
import { twMerge } from "tailwind-merge";
import TextComponent from "../../../components/common/text/TextComponent";
import { router } from "expo-router";

// 📅 오늘 날짜를 "YYYY-MM-DD" 형식으로 반환하는 헬퍼 함수
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState(true);

    // ✨ 초기 날짜를 오늘 날짜로 동적 설정!
    const todayDate = getTodayString();

    const [data, setData] = useState<DashboardData | null>({
        date: todayDate, // 기본값도 오늘 날짜로 세팅
        walk: { count: 0 },
        weight: { value: 0 },
        water: { totalAmount: 0 },
        vetRecord: null,
    });

    const loadDashboard = useCallback(async () => {
        try {
            setIsLoading(true);

            //  petId는 예시로 1을 넣었습니다. 실제로는 유저가 선택한 펫 ID 변수가 들어가야 합니다.
            const result = await getHomeDashboard(1, todayDate);

            if (result.success) {
                setData(result.data); // 주석을 풀고 백엔드 데이터를 상태에 반영합니다.
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
    }, [todayDate]); // 의존성 배열에 오늘 날짜 추가

    useEffect(() => {
        loadDashboard().then(() => {});
    }, [loadDashboard]);

    // ✨ map을 돌리기 위한 카드 설정 데이터
    const cardConfig = [
        {
            id: "walk",
            title: "산책",
            renderBottom: () => (
                <TextComponent
                    className="font-bold text-2xl text-right"
                    style={{ color: "#2C2C2C" }}>
                    {data?.walk.count ?? 0}회
                </TextComponent>
            ),
        },
        {
            id: "weight",
            title: "몸무게",
            onPress: () => router.push("/(main)/health/weight-logs"),
            renderBottom: () => (
                <TextComponent
                    className="font-bold text-2xl text-right"
                    style={{ color: "#2C2C2C" }}>
                    {data?.weight.value ?? 0}kg
                </TextComponent>
            ),
        },
        {
            id: "water",
            title: "물",
            // onPress: () => router.push("/water-detail"), 수정 상세페이지로 이동 임시주석처리
            renderBottom: () => (
                <TextComponent
                    className="font-bold text-2xl text-right"
                    style={{ color: "#2C2C2C" }}>
                    {data?.water.totalAmount ?? 0}ml
                </TextComponent>
            ),
        },
        {
            id: "vet",
            title: "병원",
            showBadge: !!data?.vetRecord,
            renderBottom: () =>
                data?.vetRecord ? (
                    <View className="items-end">
                        <TextComponent
                            className="text-sm font-semibold"
                            style={{ color: "#2C2C2C" }}>
                            {data.vetRecord.purpose}
                        </TextComponent>
                        <TextComponent className="text-xs" style={{ color: "#7F8C8D" }}>
                            {data.vetRecord.hospitalName}
                        </TextComponent>
                    </View>
                ) : (
                    <TextComponent className="text-sm text-right" style={{ color: "#7F8C8D" }}>
                        기록 없음
                    </TextComponent>
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
        <ScrollView className="flex-1 pt-12 bg-background-default">
            <PetCardSection />

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

                            {card.showBadge && (
                                <View className="px-2 py-0.5 rounded bg-success-main">
                                    <TextComponent className="text-[10px] font-bold text-success-contrast">
                                        예약
                                    </TextComponent>
                                </View>
                            )}
                        </View>

                        {card.renderBottom()}
                    </Pressable>
                ))}
            </View>

            <MedicalHistorySection />
        </ScrollView>
    );
}
