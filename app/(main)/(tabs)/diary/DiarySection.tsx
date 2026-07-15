import { Image, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

import TextComponent from "@/components/common/text/TextComponent";
import { Diary } from "@/types/diary";

type Props = {
    diary: Diary | null;
    date: string;
};

const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

export default function DiarySection({ diary, date }: Props) {
    const getImageUrl = (path?: string | null) => {
        if (!path) return undefined;
        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    const formatLongDate = (dateString: string) => {
        const d = new Date(dateString);

        const days = ["일", "월", "화", "수", "목", "금", "토"];

        return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;
    };

    if (!diary) {
        return (
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: "/(main)/(tabs)/diary/create",
                        params: {
                            date,
                        },
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

                <TextComponent className={twMerge("mt-3", "text-[15px]", "text-gray-500")}>
                    기록을 추가해주세요
                </TextComponent>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/(main)/(tabs)/diary/update",
                    params: {
                        diaryId: diary.id,
                    },
                })
            }
            className={twMerge("bg-background-paper", "rounded-[20px]", "overflow-hidden")}>
            <View className={twMerge("bg-[#F5C8C7]", "px-5", "py-4")}>
                <TextComponent className={twMerge("text-[17px]", "font-bold")}>
                    {formatLongDate(diary.date)}
                </TextComponent>
            </View>

            <View className={twMerge("p-5")}>
                {diary.diaryImage ? (
                    <Image
                        source={{
                            uri: getImageUrl(diary.diaryImage),
                        }}
                        className={twMerge("w-full", "h-[150px]", "rounded-xl", "mb-4")}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        className={twMerge(
                            "w-full",
                            "h-[150px]",
                            "rounded-xl",
                            "border-2",
                            "border-dashed",
                            "border-gray-300",
                            "bg-gray-50",
                            "items-center",
                            "justify-center",
                            "mb-4",
                        )}>
                        <Ionicons name="image-outline" size={34} color="#A8B0BF" />

                        <TextComponent className={twMerge("text-gray-400", "mt-2")}>
                            이미지가 없습니다.
                        </TextComponent>
                    </View>
                )}

                <TextComponent className={twMerge("text-[17px]", "font-bold", "mb-2")}>
                    {diary.title}
                </TextComponent>

                <TextComponent
                    className={twMerge("text-[15px]", "text-gray-600")}
                    numberOfLines={3}>
                    {diary.content}
                </TextComponent>
            </View>
        </Pressable>
    );
}
