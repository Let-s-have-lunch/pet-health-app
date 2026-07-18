import { View, ScrollView, Pressable, Image, Alert, Platform } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import TextComponent from "../../../../components/common/text/TextComponent";
import { vetLogApi } from "../../../../api/user/vetLogApi";
import { VetLogState, VetRecord } from "../../../../types/vetRecord";
import Title from "../../../../components/common/title/Title";
import { usePetStore } from "@/stores/pet/usePetStore";
import { useAuthStore } from "@/stores/auth/useAuthStore"; // 💡 AuthStore 임포트
import ContentContainer from "@/components/layouts/common/ContentContainer";
import VetRecordDetailModal from "@/components/common/vetRecord/VetRecordDetailModal";
import VetRecordLogCreateModal from "@/components/common/vetRecord/VetRecordLogCreateModal";
import VetRecordLogUpdateModal from "@/components/common/vetRecord/VetRecordLogUpdateModal";
import { Plus } from "lucide-react-native";
import Button from "@/components/common/button/Button";

export default function VetLogPage() {
    // 💡 로그인 상태 가져오기
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;
    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateRecordId, setUpdateRecordId] = useState<number | null>(null);

    const [data, setData] = useState<VetLogState>({
        upcoming: null,
        history: [],
    });

    const openDetailModal = (id: number) => {
        setSelectedRecordId(id);
        setIsDetailModalOpen(true);
    };

    // 💡 기록 추가 방어 로직 (로그인/펫 체크)
    const handleCreatePress = () => {
        if (!isLoggedIn) {
            if (Platform.OS === "web") {
                alert("로그인이 필요한 서비스입니다.");
                router.push("/auth/login");
            } else {
                Alert.alert("알림", "로그인이 필요한 서비스입니다.", [
                    {
                        text: "확인",
                        onPress: () => router.push("/auth/login"),
                    },
                ]);
            }
            return;
        }
        if (!petId) {
            if (Platform.OS === "web") alert("반려동물을 먼저 등록해주세요.");
            else Alert.alert("알림", "반려동물을 먼저 등록해주세요.");
            return;
        }
        setIsCreateModalOpen(true);
    };

    const openUpdateModal = (id: number) => {
        setUpdateRecordId(id);
        setIsUpdateModalOpen(true);
    };

    const getImageUrl = (path?: string | null) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    const loadData = useCallback(async () => {
        // 💡 로그인 안 했거나 펫이 없으면 API 호출 막고 빈 데이터 세팅
        if (!isLoggedIn || !petId) {
            setData({ upcoming: null, history: [] });
            return;
        }

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
    }, [isLoggedIn, petId]); // 💡 의존성 배열 추가

    useFocusEffect(
        useCallback(() => {
            loadData().then(() => {});
        }, [loadData]),
    );

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
                executeDelete().then(() => {});
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

    const formatLongDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
    };

    const formatShortDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    // 💡 기존에 있던 if (!petId) 반환문을 완전히 제거하여 레이아웃이 항상 렌더링되게 함

    return (
        <View className={twMerge("flex-1 bg-background-default")}>
            <View className={twMerge("bg-background-paper")}>
                {/* 💡 펫이 없으면 기본 텍스트 보여주기 */}
                <Title
                    title={selectedPet ? `${selectedPet.name} 병원방문기록` : "병원방문기록"}
                    showBackButton={true}
                    onBackPress={() => router.push("/")}
                />
            </View>

            <ScrollView className={twMerge("flex-1 bg-background-main")}>
                <ContentContainer className="flex-1 py-5 pb-10 px-5">
                    {/* 1. 상단 카드 */}
                    {data.upcoming ? (
                        <Pressable
                            onPress={() => openDetailModal(data.upcoming!.id)}
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
                                            uri:
                                                getImageUrl(data.upcoming.receiptImage) ||
                                                undefined,
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
                                        <TextComponent
                                            className={twMerge("text-gray-400 text-[12px]")}>
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
                            onPress={handleCreatePress} // 💡 추가 클릭 시 방어 로직 타도록 변경
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
                        <Button
                            size={"small"}
                            onPress={handleCreatePress} // 💡 방어 로직 반영
                            className={"px-0 py-0 w-[48px] h-[48px]"}>
                            <Plus size={20} className={twMerge(["text-text-default"])} />
                        </Button>
                    </View>

                    {data.history?.map(item => (
                        <View
                            key={item.id}
                            className={twMerge(
                                "bg-background-paper rounded-[16px] flex-row items-center px-5 py-4 mb-3 shadow-sm",
                            )}>
                            <Pressable
                                className={twMerge("flex-1 mr-2")}
                                onPress={() => openDetailModal(item.id)}>
                                <TextComponent
                                    className={twMerge("text-[15px] font-bold")}
                                    numberOfLines={1}>
                                    {item.visitPurpose || item.hospitalName}
                                </TextComponent>
                            </Pressable>

                            <View className={twMerge("flex-row items-center gap-1 z-10")}>
                                <TextComponent
                                    className={twMerge("text-[12px] text-gray-500 mr-2")}>
                                    {formatShortDate(item.visitDate)}
                                </TextComponent>

                                <Pressable
                                    className={twMerge("p-2")}
                                    hitSlop={15}
                                    onPress={() => openUpdateModal(item.id)}>
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
                </ContentContainer>
            </ScrollView>

            {/* 기존 상세 모달 */}
            {isDetailModalOpen && (
                <VetRecordDetailModal
                    visible={isDetailModalOpen}
                    recordId={selectedRecordId}
                    onClose={() => setIsDetailModalOpen(false)}
                    onUpdateComplete={loadData}
                />
            )}

            <VetRecordLogCreateModal
                visible={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                petId={petId!} // 💡 TS 에러 방지. 어차피 버튼에서 예외처리 하므로 안전함
                petName={selectedPet?.name}
                reload={loadData}
            />

            <VetRecordLogUpdateModal
                visible={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                logId={updateRecordId ?? undefined}
                petName={selectedPet?.name}
                reload={loadData}
            />
        </View>
    );
}
