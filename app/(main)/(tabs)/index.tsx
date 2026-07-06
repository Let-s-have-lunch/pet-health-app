import { ActivityIndicator, Alert, Platform, ScrollView, View } from "react-native";
import PetCardSection from "../../(main)/(tabs)/components/PetCardSection";
import MedicalHistorySection from "../../(main)/(tabs)/components/MedicalHistorySection";
import { useCallback, useEffect, useState } from "react";
import { DashboardData, getHomeDashboard } from "@/api/home";
import { twMerge } from "tailwind-merge";
import TextComponent from "../../../components/common/text/TextComponent";
import { View } from "react-native";
import PetCardSection from "@/app/(main)/(tabs)/components/PetCardSection";
import MedicalHistorySection from "@/app/(main)/(tabs)/components/MedicalHistorySection";

export default function HomeScreen() {
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState<DashboardData | null>({
        date: "2026-07-01",
        walk: { count: 3 },          // 산책 카드에 3회로 표시됨
        weight: { value: 5.4 },      // 몸무게 카드에 5.4kg으로 표시됨
        water: { totalAmount: 250 }, //  물 카드에 250ml로 표시됨
        vetRecord: {                 //  병원 카드에 예약 배지와 함께 표시됨
            purpose: "정기 예방접종",
            hospitalName: "튼튼동물병원"
        }
    });

    const loadDashboard = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await getHomeDashboard(1, "2026-07-01");
            if (result.success) {
                // setData(result.data);
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
    }, []);

    useEffect(() => {
        loadDashboard().then(() => {});
    }, [loadDashboard]);

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
        // 1. 전체 배경색: 소프트 밀크 크림 (#F1EBE4)
        <ScrollView className={twMerge(["flex-1", "pt-12"])} style={{ backgroundColor: "#F1EBE4" }}>
            {/* 🐶 상단: 동물 카드 영역 (팀원 원본) */}
            <PetCardSection />

            {/* 🏥 하단 대시보드: 2x2 카드 그리드 */}
            <View className={twMerge(["flex-row", "flex-wrap", "justify-between", "px-5", "mt-6"])}>
                {/* 👟 산책 카드 */}
                <View
                    className={twMerge([
                        "w-[48%]",
                        "h-40",
                        "p-5",
                        "mb-4",
                        "justify-between",
                        "border",
                        "rounded-[10px]",
                    ])}
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D4CD" }}>
                    <View>
                        <TextComponent className="font-bold text-base" style={{ color: "#2C2C2C" }}>
                            산책
                        </TextComponent>
                        <TextComponent className="text-xs mt-1" style={{ color: "#7F8C8D" }}>
                            {data?.date}
                        </TextComponent>
                    </View>
                    <TextComponent
                        className="font-bold text-2xl text-right"
                        style={{ color: "#2C2C2C" }}>
                        {data?.walk.count ?? 0}회
                    </TextComponent>
                </View>

                {/* ⚖️ 몸무게 카드 */}
                <View
                    className={twMerge([
                        "w-[48%]",
                        "h-40",
                        "p-5",
                        "mb-4",
                        "justify-between",
                        "border",
                        "rounded-[10px]",
                    ])}
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D4CD" }}>
                    <View>
                        <TextComponent className="font-bold text-base" style={{ color: "#2C2C2C" }}>
                            몸무게
                        </TextComponent>
                        <TextComponent className="text-xs mt-1" style={{ color: "#7F8C8D" }}>
                            {data?.date}
                        </TextComponent>
                    </View>
                    <TextComponent
                        className="font-bold text-2xl text-right"
                        style={{ color: "#2C2C2C" }}>
                        {data?.weight.value ?? 0}kg
                    </TextComponent>
                </View>

                {/* 💧 물 카드 */}
                <View
                    className={twMerge([
                        "w-[48%]",
                        "h-40",
                        "p-5",
                        "mb-4",
                        "justify-between",
                        "border",
                        "rounded-[10px]",
                    ])}
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D4CD" }}>
                    <View>
                        <TextComponent className="font-bold text-base" style={{ color: "#2C2C2C" }}>
                            물
                        </TextComponent>
                        <TextComponent className="text-xs mt-1" style={{ color: "#7F8C8D" }}>
                            {data?.date}
                        </TextComponent>
                    </View>
                    <TextComponent
                        className="font-bold text-2xl text-right"
                        style={{ color: "#2C2C2C" }}>
                        {data?.water.totalAmount ?? 0}ml
                    </TextComponent>
                </View>

                {/* 🏥 병원 카드 */}
                <View
                    className={twMerge([
                        "w-[48%]",
                        "h-40",
                        "p-5",
                        "mb-4",
                        "justify-between",
                        "border",
                        "rounded-[10px]",
                    ])}
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E5D4CD" }}>
                    <View className={twMerge(["flex-row", "justify-between", "items-start"])}>
                        <View>
                            <TextComponent
                                className="font-bold text-base"
                                style={{ color: "#2C2C2C" }}>
                                병원
                            </TextComponent>
                            <TextComponent className="text-xs mt-1" style={{ color: "#7F8C8D" }}>
                                {data?.date}
                            </TextComponent>
                        </View>
                        {data?.vetRecord && (
                            <View
                                className={twMerge(["px-2", "py-0.5", "rounded"])}
                                style={{ backgroundColor: "#A3D9C9" }}>
                                <TextComponent
                                    className="text-[10px] font-bold"
                                    style={{ color: "#2C2C2C" }}>
                                    예약
                                </TextComponent>
                            </View>
                        )}
                    </View>

                    {data?.vetRecord ? (
                        <View className={twMerge(["items-end"])}>
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
                    )}
                </View>
            </View>

            {/* 🏥 하단: 진료 이력 및 나머지 UI 영역 (팀원 원본) */}
            <MedicalHistorySection />
        </ScrollView>
    );
}
// Todo: 몸무게 부터 detail 페이지 랑 그래프 작성