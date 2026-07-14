import React, { useState, useEffect, useCallback } from "react";
import { View, Image, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { vetLogApi } from "@/api/user/vetLogApi";
import { VetRecord } from "@/types/vetRecord";
import TextComponent from "@/components/common/text/TextComponent";
import axiosInstance from "@/api/axiosInstance";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import { usePetStore } from "@/stores/usePetStore";

export default function RecordDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    const [record, setRecord] = useState<VetRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const selectedPet = usePetStore(state => state.selectedPet);

    const fetchRecord = useCallback(async () => {
        const recordId = Array.isArray(id) ? id[0] : id;
        if (!recordId) return;

        try {
            setLoading(true);
            const numericId = Number(recordId);

            const res = await axiosInstance.get(`/vet-records/${numericId}`, {
                data: { id: numericId },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${useAuthStore.getState().token}`,
                },
            });

            const recordData = res?.data?.data || res?.data;
            setRecord(recordData);
        } catch (error: any) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecord();
    }, [fetchRecord]);

    const getImageUrl = (path?: string | null) => {
        if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
        if (path.startsWith("http")) return path;
        return `${BACKEND_URL}${path}`;
    };

    const formatLongDate = (dateString?: string) => {
        if (!dateString) return "날짜 정보 없음";

        let date = new Date(dateString);

        if (isNaN(date.getTime())) {
            date = new Date(dateString.replace(/\./g, "-"));
        }

        if (isNaN(date.getTime())) return "날짜 정보 없음";

        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
    };

    const handleDelete = async () => {
        try {
            await vetLogApi.delete(Number(id));
            router.back();
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background-default">
                <ActivityIndicator size="large" color="#BACFCD" />
            </View>
        );
    }

    if (!record) {
        return (
            <View className="flex-1 justify-center items-center bg-background-default">
                <TextComponent>데이터를 찾을 수 없습니다.</TextComponent>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-default">
            <Title
                title={selectedPet ? `${selectedPet.name} 병원방문기록` : "병원방문기록"}
                showBackButton={true}
                onBackPress={() => router.back()}
                className={twMerge("bg-background-paper")}
            />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 24,
                    paddingBottom: 40,
                }}>
                <View className="bg-background-paper p-6 rounded-[20px] shadow-sm">
                    <TextComponent className="text-[20px] font-bold text-text-default">
                        {record.visitPurpose}
                    </TextComponent>

                    <TextComponent className="text-[14px] text-text-secondary mt-1 mb-6 text-right">
                        {formatLongDate(record.visitDate)}
                    </TextComponent>

                    <Image
                        source={{ uri: getImageUrl(record.receiptImage) }}
                        className="w-full h-[220px] rounded-[16px] mb-6"
                        resizeMode="cover"
                    />

                    <TextComponent className="text-[16px] text-text-default leading-6 mb-10">
                        {record.memo || "기록된 내용이 없습니다."}
                    </TextComponent>

                    <View className="flex-row justify-between gap-3">
                        <Pressable
                            className={twMerge(
                                "flex-1 items-center justify-center h-12 rounded-[12px] bg-error-main"
                            )}
                            onPress={handleDelete}
                        >
                            <TextComponent className={twMerge("font-semibold text-error-contrast")}>
                                삭제
                            </TextComponent>
                        </Pressable>

                        <Pressable
                            className="flex-1 items-center justify-center h-12 rounded-[12px] bg-success-main"
                            onPress={() =>
                                router.push({
                                    pathname: "/(main)/health/vet-records/[id]/update",
                                    params: {
                                        id: record.id,
                                        hospitalName: record.hospitalName,
                                        visitPurpose: record.visitPurpose,
                                        visitDate: record.visitDate,
                                        cost: String(record.cost),
                                        memo: record.memo || "",
                                        receiptImage: record.receiptImage || "",
                                    },
                                })
                            }
                        >
                            <TextComponent className={twMerge("font-semibold text-primary-contrast")}>
                                수정
                            </TextComponent>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}