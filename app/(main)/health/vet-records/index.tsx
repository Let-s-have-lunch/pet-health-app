import { View, ScrollView, Pressable, Image, Alert, Platform } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import TextComponent from "../../../../components/common/text/TextComponent";
import { vetLogApi } from "../../../../api/user/vetLogApi";
import { VetLogState, VetRecord } from "../../../../types/vetRecord";
import Title from "../../../../components/common/title/Title";
import { usePetStore } from "@/stores/usePetStore";
import VetRecordDetailModal from "@/components/common/vetRecord/VetRecordDetailModal";

export default function VetLogPage() {
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;
    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

    const [data, setData] = useState<VetLogState>({
        upcoming: null,
        history: [],
    });

    const openModal = (id: number) => {
        setSelectedRecordId(id);
        setIsModalOpen(true);
    };

    const getImageUrl = (path?: string | null) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    const loadData = useCallback(async () => {
        if (!petId) return;
        try {
            const res = await vetLogApi.getByPetId(petId);
            const records: VetRecord[] = res?.data?.data || [];

            const sortedRecords = [...records].sort(
                (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime(),
            );

            setData({
                upcoming: sortedRecords[0] ?? null,
                history: sortedRecords.slice(1),
            });
        } catch (e) {
            console.error("데이터 로딩 중 에러:", e);
        }
    }, [petId]);

    useFocusEffect(
        useCallback(() => {
            loadData().then(() => {});
        }, [loadData]),
    );

    // 삭제 로직: 웹/앱 환경 분기 처리
    const handleDelete = (id: number) => {
        const executeDelete = async () => {
            try {
                await vetLogApi.delete(id);
                await loadData();
            } catch (error) {
                if (Platform.OS === "web") {
                    alert("삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            const confirmed = window.confirm("정말 삭제하시겠습니까?");
            if (confirmed) {
                executeDelete().then(() => {})
            }
        } else {
            Alert.alert("삭제", "정말 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: executeDelete,
                },
            ]);
        }
    };

    // 요일이 포함된 날짜 포맷 (이미지 디자인 반영)
    const formatLongDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
    };

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    if (!petId) return <View className={twMerge("flex-1 bg-background-default")} />;

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <View className={twMerge("bg-background-paper")}>
                <Title
                    title={`${selectedPet?.name} 병원방문기록`}
                    showBackButton={true}
                    onBackPress={() => router.push("/")}
                />
            </View>

            <ScrollView
                className={twMerge("flex-1 bg-background-main")}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                {/* 1. 상단 카드 */}
                {data.upcoming ? (
                    <Pressable
                        onPress={() => openModal(data.upcoming!.id)}
                        className={twMerge(
                            "bg-background-paper rounded-[20px] overflow-hidden mb-8 shadow-sm",
                        )}>
                        <View className={twMerge("bg-[#F2C6C2] px-5 py-4")}>
                            <TextComponent className={twMerge("text-[16px] font-bold")}>
                                {formatLongDate(data.upcoming.visitDate)}
                            </TextComponent>
                        </View>
                        <View className={twMerge("p-5")}>
                            {data.upcoming.receiptImage ? (
                                <Image
                                    source={{
                                        uri: getImageUrl(data.upcoming.receiptImage) || undefined,
                                    }}
                                    className={twMerge("w-full h-32 rounded-xl mb-4")}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View
                                    className={twMerge(
                                        "w-full h-32 rounded-xl mb-4 border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50",
                                    )}>
                                    <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                                    <TextComponent className={twMerge("text-gray-400 mt-2")}>
                                        이미지가 없습니다.
                                    </TextComponent>
                                    <TextComponent className={twMerge("text-gray-400 text-[12px]")}>
                                        이미지를 첨부해주세요.
                                    </TextComponent>
                                </View>
                            )}
                            <TextComponent className={twMerge("text-[16px] font-bold mb-1")}>
                                {data.upcoming.visitPurpose}
                            </TextComponent>
                            {data.upcoming.memo && (
                                <TextComponent
                                    className={twMerge("text-[14px] text-gray-500")}
                                    numberOfLines={2}>
                                    {data.upcoming.memo}
                                </TextComponent>
                            )}
                        </View>
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() => router.push("/(main)/health/vet-records/create")}
                        className={twMerge(
                            "bg-background-paper rounded-[20px] h-[150px] items-center justify-center mb-8 border-2 border-dashed border-gray-300",
                        )}>
                        <Ionicons name="add" size={32} color="#9CA3AF" />
                        <TextComponent>기록을 추가해주세요</TextComponent>
                    </Pressable>
                )}

                {/* 2. 방문기록 리스트 */}
                <View className={twMerge("flex-row items-center justify-between mb-4")}>
                    <TextComponent className={twMerge("text-[18px] font-bold")}>
                        방문기록
                    </TextComponent>
                    <Pressable
                        onPress={() => router.push("/(main)/health/vet-records/create")}
                        className={twMerge("bg-success-point px-3 py-1 rounded-full")}>
                        <TextComponent className={twMerge("text-[12px] font-bold")}>
                            + 추가
                        </TextComponent>
                    </Pressable>
                </View>

                {data.history?.map(item => (
                    <View
                        key={item.id}
                        className={twMerge(
                            "bg-background-paper rounded-[16px] flex-row items-center px-5 py-4 mb-3 shadow-sm",
                        )}>
                        <Pressable
                            className={twMerge("flex-1 mr-2")}
                            onPress={() => openModal(item.id)}>
                            <TextComponent
                                className={twMerge("text-[15px] font-bold")}
                                numberOfLines={1}>
                                {item.visitPurpose || item.hospitalName}
                            </TextComponent>
                        </Pressable>

                        <View className={twMerge("flex-row items-center gap-1 z-10")}>
                            <TextComponent className={twMerge("text-[12px] text-gray-500 mr-2")}>
                                {formatShortDate(item.visitDate)}
                            </TextComponent>

                            <Pressable
                                className={twMerge("p-2")}
                                hitSlop={15}
                                onPress={() =>
                                    router.push({
                                        pathname: "/(main)/health/vet-records/[id]/update",
                                        params: { id: item.id },
                                    })
                                }>
                                <Ionicons name="pencil" size={18} color="#888" />
                            </Pressable>

                            <Pressable
                                className={twMerge("p-2")}
                                hitSlop={20}
                                onPress={() => handleDelete(item.id)}>
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {isModalOpen && (
                <VetRecordDetailModal
                    visible={isModalOpen}
                    recordId={selectedRecordId}
                    onClose={() => setIsModalOpen(false)}
                    onUpdateComplete={loadData}
                />
            )}
        </View>
    );
}