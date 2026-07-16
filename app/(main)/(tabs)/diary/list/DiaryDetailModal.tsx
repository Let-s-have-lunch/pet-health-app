import { Modal, View, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Diary } from "@/types/diary";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

type Props = {
    diary: Diary | null;
    visible: boolean;
    onClose: () => void;
    onRefresh: () => void;
};

export default function DiaryDetailModal({ diary, visible, onClose }: Props) {
    if (!diary) return null;

    const getImageUrl = (path?: string | null) => {
        if (!path) return undefined;

        return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);

        const days = ["일", "월", "화", "수", "목", "금", "토"];

        return `${d.getFullYear()}년 ${
            d.getMonth() + 1
        }월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}>
            <Pressable
                className="flex-1 bg-black/40 items-center justify-center px-5"
                onPress={onClose}>
                <Pressable
                    onPress={e => e.stopPropagation()}
                    className="w-full max-w-[700px] bg-background-paper rounded-[32px] p-6">
                    {/* 헤더 */}
                    <View className="flex-row items-center justify-between">
                        <TextComponent className="text-[26px] font-bold flex-1 pr-3">
                            {diary.title}
                        </TextComponent>

                        <Pressable onPress={onClose}>
                            <Ionicons name="close" size={28} color="#444" />
                        </Pressable>
                    </View>

                    {/* 날짜 */}
                    <TextComponent className="text-text-secondary mt-3 mb-6">
                        {formatDate(diary.date)}
                    </TextComponent>

                    <ScrollView showsVerticalScrollIndicator={false} className="max-h-[500px]">
                        {/* 사진 */}

                        {diary.diaryImage ? (
                            <Image
                                source={{
                                    uri: getImageUrl(diary.diaryImage),
                                }}
                                className="w-full h-[240px] rounded-[24px]"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-[240px] rounded-[24px] bg-gray-100 items-center justify-center">
                                <Ionicons name="image-outline" size={44} color="#B7B7B7" />

                                <TextComponent className="mt-2 text-text-secondary">
                                    이미지가 없습니다.
                                </TextComponent>
                            </View>
                        )}

                        {/* 내용 */}

                        <View className="mt-7">
                            <TextComponent className="text-[19px] font-bold mb-3">
                                오늘의 일기
                            </TextComponent>

                            <View className="bg-[#F9F9F9] rounded-[20px] p-5">
                                <TextComponent className="text-[16px] leading-7">
                                    {diary.content}
                                </TextComponent>
                            </View>
                        </View>
                    </ScrollView>

                    {/* 버튼 */}

                    <View className="flex-row gap-3 mt-8">
                        <Button
                            className="flex-1 bg-[#F7C9C7]"
                            textClassName="text-red-600 font-bold">
                            삭제
                        </Button>

                        <Button className="flex-1">수정</Button>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
