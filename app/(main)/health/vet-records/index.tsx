import { View, ScrollView, Pressable, Image } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "../../../../components/common/text/TextComponent";
import { vetLogApi } from "../../../../api/user/vetLogApi";
import { VetLogState, VetRecord } from "../../../../types/vetRecord";
import Title from "../../../../components/common/title/Title";

export default function VetLogPage() {
    const [data, setData] = useState<VetLogState>({
        upcoming: null,
        history: [],
    });

    // 날짜 파싱 유틸리티
    const parseValidDate = (dateString: string) => {
        if (!dateString) return new Date();
        if (dateString.includes("T")) return new Date(dateString);
        return new Date(dateString.replace(/\./g, "-").replace(/\s/g, ""));
    };

    const loadData = useCallback(async () => {
        try {
            const res = await vetLogApi.getByPetId(1);
            const records: VetRecord[] = res?.data?.data || [];

            if (!Array.isArray(records) || records.length === 0) {
                setData({ upcoming: null, history: [] });
                return;
            }

            // 💡 백엔드가 정렬해준 순서 그대로 사용
            setData({
                upcoming: records[0], // 첫 번째 데이터를 카드용으로
                history: records.slice(1), // 나머지 데이터를 리스트용으로
            });
        } catch (e) {
            console.error("데이터 로딩 중 에러:", e);
        }
    }, []);

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

    return (
        <View className="flex-1 bg-background-default">
            <View className="bg-background-paper">
                <Title
                    title={"초코 병원방문기록"}
                    showBackButton={true}
                    onBackPress={() => router.push("/")}
                />
            </View>

            <ScrollView
                className="flex-1 bg-background-main"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 24,
                    paddingBottom: 40,
                }}>
                {/* 1. 상단 카드 (최신 1개) */}
                {data.upcoming ? (
                    <View className="bg-background-paper rounded-[20px] overflow-hidden mb-8 shadow-sm">
                        <View className="bg-primary-main px-5 py-4">
                            <TextComponent className="text-[16px] font-bold text-text-default">
                                {formatLongDate(data.upcoming.visitDate)}
                            </TextComponent>
                        </View>
                        <View className="p-5">
                            {/* 💡 이미지 영역: 서버에서 imageUrl을 보내준다고 가정. 없으면 placeholder */}
                            <Image
                                source={{
                                    uri:
                                        (data.upcoming as any).imageUrl ||
                                        "https://via.placeholder.com/400x150/89CFF0/FFFFFF?text=No+Image",
                                }}
                                className="w-full h-32 rounded-xl mb-4"
                                resizeMode="cover"
                            />
                            <TextComponent className="text-[16px] font-bold text-text-default mb-2">
                                {data.upcoming.visitPurpose}
                            </TextComponent>
                            <TextComponent className="text-[14px] text-text-secondary leading-5">
                                {data.upcoming.memo ||
                                    `${data.upcoming.hospitalName}에 다녀왔습니다.`}
                            </TextComponent>
                        </View>
                    </View>
                ) : (
                    <Pressable
                        onPress={() => router.push("/(main)/health/vet-records/create")}
                        className="bg-background-paper rounded-[20px] h-[150px] items-center justify-center mb-8 border border-dashed border-gray-300">
                        <TextComponent className="text-text-secondary">
                            기록을 추가해주세요
                        </TextComponent>
                    </Pressable>
                )}

                {/* 2. 하단 방문기록 리스트 (나머지 전부) */}
                <View className="flex-row items-center justify-between mb-4">
                    <TextComponent className="text-[18px] font-bold text-text-default">
                        방문기록
                    </TextComponent>
                    <Pressable
                        onPress={() => router.push("/(main)/health/vet-records/create")}
                        className="bg-secondary-main px-3 py-1 rounded-full">
                        <TextComponent className="text-[12px] font-bold text-text-default">
                            + 추가
                        </TextComponent>
                    </Pressable>
                </View>

                {data.history?.length > 0 ? (
                    data.history.map(item => (
                        <View
                            key={item.id}
                            className="bg-background-paper rounded-[16px] flex-row items-center px-5 py-4 mb-3 shadow-sm">
                            <TextComponent
                                className="flex-1 text-[15px] font-bold text-text-default"
                                numberOfLines={1}>
                                {item.visitPurpose || item.hospitalName}
                            </TextComponent>
                            <View className="flex-row items-center ml-2">
                                <TextComponent className="text-[12px] text-text-secondary mr-3">
                                    {formatShortDate(item.visitDate)}
                                </TextComponent>
                                <Pressable
                                    className="p-1"
                                    onPress={() => console.log("Edit", item.id)}>
                                    <Ionicons name="pencil" size={16} color="#888" />
                                </Pressable>
                                <Pressable
                                    className="p-1"
                                    onPress={() => console.log("Delete", item.id)}>
                                    <Ionicons name="trash" size={16} color="#888" />
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
