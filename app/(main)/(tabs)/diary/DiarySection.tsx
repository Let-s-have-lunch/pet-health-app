import { Image, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

import TextComponent from "@/components/common/text/TextComponent";
import { Diary } from "@/types/diary";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

type Props = {
    diaryList: Diary[];
    date: string;
};

export default function DiarySection({ diaryList = [], date }: Props) {
    const getImageUrl = (path?: string | null) => {
        if (!path) return undefined;
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    const formatLongDate = (dateString: string) => {
        const d = new Date(dateString);
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
    };

    // 일기가 하나도 없는 경우
    if (!diaryList || diaryList.length === 0) {
        return (
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/(main)/(tabs)/diary/create", // 👈 기존의 잘못된 '/diary/create/diary' 경로를 올바른 곳으로 수정!
                        params: { date },
                    })
                }
                className={twMerge(
                    "bg-background-paper",
                    "rounded-[20px]",
                    "border-2",
                    "border-dashed",
                    "border-gray-300",
                    "items-center",
                    "justify-center",
                    "h-[170px]",
                )}>
                <Ionicons name="add" size={38} color="#A8B0BF" />
                <TextComponent className="mt-3 text-[15px] text-gray-500">
                    기록을 추가해주세요
                </TextComponent>
            </Pressable>
        );
    }

    // 일기 목록
    return (
        <View className="gap-4">
            {diaryList.map(diary => (
                <Pressable
                    key={diary.id}
                    onPress={() =>
                        router.push({
                            pathname: "/(main)/(tabs)/diary/create",
                            params: { date },
                        })
                    }
                    className="bg-background-paper rounded-[20px] overflow-hidden">
                    <View className="bg-[#F5C8C7] px-5 py-4">
                        <TextComponent className="text-[17px] font-bold">
                            {formatLongDate(diary.date)}
                        </TextComponent>
                    </View>

                    <View className="p-5">
                        {diary.diaryImage ? (
                            <Image
                                source={{ uri: getImageUrl(diary.diaryImage) }}
                                className="w-full h-[150px] rounded-xl mb-4"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-[150px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 items-center justify-center mb-4">
                                <Ionicons name="image-outline" size={34} color="#A8B0BF" />
                                <TextComponent className="text-gray-400 mt-2">
                                    이미지가 없습니다.
                                </TextComponent>
                            </View>
                        )}

                        <TextComponent className="text-[17px] font-bold mb-2">
                            {diary.title}
                        </TextComponent>

                        <TextComponent className="text-[15px] text-gray-600" numberOfLines={3}>
                            {diary.content}
                        </TextComponent>
                    </View>
                </Pressable>
            ))}
        </View>
    );
}
