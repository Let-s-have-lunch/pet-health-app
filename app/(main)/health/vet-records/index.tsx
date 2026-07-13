import { View, ScrollView, Pressable, Image, Platform, Alert } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "../../../../components/common/text/TextComponent";
import { vetLogApi } from "../../../../api/user/vetLogApi";
import { VetLogState, VetRecord } from "../../../../types/vetRecord";
import Title from "../../../../components/common/title/Title";
import { usePetStore } from "@/stores/usePetStore";

export default function VetLogPage() {
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;
    const BACKEND_URL = "http://10.0.2.2:4000";

    const [data, setData] = useState<VetLogState>({
        upcoming: null,
        history: [],
    });

    useEffect(() => {
        if (!petId) {
            Alert.alert("알림", "선택된 반려동물이 없습니다.");
            router.push("/");
        }
    }, [petId]);

    const parseValidDate = (dateString: string) => {
        if (!dateString) return new Date();
        if (dateString.includes("T")) return new Date(dateString);
        return new Date(dateString.replace(/\./g, "-").replace(/\s/g, ""));
    };

    const loadData = useCallback(async () => {
        if (!petId) return;
        try {
            const res = await vetLogApi.getByPetId(petId);
            const records: VetRecord[] = res?.data?.data || [];

            if (!Array.isArray(records) || records.length === 0) {
                setData({ upcoming: null, history: [] });
                return;
            }

            setData({
                upcoming: records[0] ?? null,
                history: records.slice(1),
            });
        } catch (e) {
            console.error("데이터 로딩 중 에러:", e);
        }
    }, [petId]);

    useFocusEffect(
        useCallback(() => {
            loadData().then(() => {})
        }, [loadData]),
    );

    const formatLongDate = (dateString: string) => {
        const date = parseValidDate(dateString);
        if (isNaN(date.getTime())) return "날짜 정보 없음";
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
    };

    const formatShortDate = (dateString: string) => {
        const date = parseValidDate(dateString);
        if (isNaN(date.getTime())) return "";
        const year = String(date.getFullYear()).slice(2);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
    };

    // 이미지 경로 처리: 전달된 경로를 그대로 반환하거나 플레이스홀더를 반환
    const getImageUrl = (path?: string | null) => {
        // 1. 이미지가 없으면 플레이스홀더 반환
        if (!path) return "https://via.placeholder.com/400x150/89CFF0/FFFFFF?text=No+Image";

        // 2. 경로가 http로 시작하면(이미 전체 주소면) 그대로 반환
        if (path.startsWith("http")) return path;

        // 3. 상대 경로인 경우 서버 주소를 붙여서 반환 (이게 핵심!)
        return `${BACKEND_URL}${path}`;
    };

    if (!petId) return <View className="flex-1 bg-background-default" />;

    return (
        <View className="flex-1 bg-background-default">
            <View className="bg-background-paper">
                <Title
                    title={selectedPet ? `${selectedPet.name} 병원방문기록` : "병원방문기록"}
                    showBackButton={true}
                    onBackPress={() => router.push("/")}
                />
            </View>

            <ScrollView className="flex-1 bg-background-main" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
                {/* 1. 상단 카드 */}
                {data.upcoming ? (
                    <View className="bg-background-paper rounded-[20px] overflow-hidden mb-8 shadow-sm">
                        <View className="bg-primary-main px-5 py-4">
                            <TextComponent className="text-[16px] font-bold text-text-default">
                                {formatLongDate(data.upcoming.visitDate)}
                            </TextComponent>
                        </View>
                        <View className="p-5">

                            <Image
                                source={{ uri: getImageUrl(data.upcoming.receiptImage) }}
                                className="w-full h-32 rounded-xl mb-4"
                                resizeMode="cover"
                            />
                            <TextComponent className="text-[16px] font-bold text-text-default mb-2">
                                {data.upcoming.visitPurpose}
                            </TextComponent>
                            <TextComponent className="text-[14px] text-text-secondary leading-5">
                                {data.upcoming.memo || `${data.upcoming.hospitalName}에 다녀왔습니다.`}
                            </TextComponent>
                        </View>
                    </View>
                ) : (
                    <Pressable
                        onPress={() => router.push("/(main)/health/vet-records/create")}
                        className="bg-background-paper rounded-[20px] h-[150px] items-center justify-center mb-8 border border-dashed border-gray-300">
                        <TextComponent className="text-text-secondary">기록을 추가해주세요</TextComponent>
                    </Pressable>
                )}

                {/* 2. 방문기록 리스트 */}
                <View className="flex-row items-center justify-between mb-4">
                    <TextComponent className="text-[18px] font-bold text-text-default">방문기록</TextComponent>
                    <Pressable
                        onPress={() => router.push("/(main)/health/vet-records/create")}
                        className="bg-secondary-main px-3 py-1 rounded-full">
                        <TextComponent className="text-[12px] font-bold text-text-default">+ 추가</TextComponent>
                    </Pressable>
                </View>

                {data.history?.length > 0 ? (
                    data.history.map(item => (
                        <View key={item.id} className="bg-background-paper rounded-[16px] flex-row items-center px-5 py-4 mb-3 shadow-sm">
                            <TextComponent className="flex-1 text-[15px] font-bold text-text-default" numberOfLines={1}>
                                {item.visitPurpose || item.hospitalName}
                            </TextComponent>
                            <View className="flex-row items-center ml-2">
                                <TextComponent className="text-[12px] text-text-secondary mr-3">
                                    {formatShortDate(item.visitDate)}
                                </TextComponent>
                                <Pressable
                                    className="p-1"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(main)/health/vet-records/create",
                                            params: {
                                                id: item.id,
                                                hospitalName: item.hospitalName,
                                                visitPurpose: item.visitPurpose,
                                                visitDate: item.visitDate,
                                                diagnosis: item.diagnosis,
                                                treatment: item.treatment,
                                                cost: item.cost,
                                                memo: item.memo,
                                                receiptImage: item.receiptImage,
                                            },
                                        })
                                    }>
                                    <Ionicons name="pencil" size={16} color="#888" />
                                </Pressable>
                            </View>
                        </View>
                    ))
                ) : (
                    <TextComponent className="text-center text-text-secondary mt-10">
                        지난 기록이 없습니다.
                    </TextComponent>
                )}
            </ScrollView>
        </View>
    );
}