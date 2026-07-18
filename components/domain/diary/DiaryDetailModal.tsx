import { Modal, View, Image, Pressable, ScrollView, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Diary } from "@/types/diary";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import diaryApi from "@/api/user/diaryApi";
import { router } from "expo-router";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

type Props = {
    diary: Diary | null;
    visible: boolean;
    onClose: () => void;
    onRefresh: () => void;
    onEdit: (diary: Diary) => void;
};

export default function DiaryDetailModal({ diary, visible, onClose, onRefresh, onEdit, }: Props) {
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

    const handleDelete = async () => {
        const ok =
            Platform.OS === "web"
                ? window.confirm("삭제하시겠습니까?")
                : await new Promise<boolean>(resolve => {
                      Alert.alert("일기 삭제", "삭제하시겠습니까?", [
                          {
                              text: "취소",
                              onPress: () => resolve(false),
                              style: "cancel",
                          },
                          {
                              text: "삭제",
                              onPress: () => resolve(true),
                              style: "destructive",
                          },
                      ]);
                  });

        if (!ok) return;

        try {
            await diaryApi.deleteDiary(diary.id);

            onClose();
            await onRefresh();
        } catch (e) {
            console.error(e);
            Alert.alert("삭제 실패");
        }
    };
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}>
            {/* 배경 */}
            <Pressable
                className="flex-1 bg-black/40 items-center justify-center px-4 py-6"
                onPress={onClose}>
                {/* 모달 */}
                <Pressable
                    onPress={e => e.stopPropagation()}
                    className="w-full max-w-[700px] max-h-[90%] bg-background-paper rounded-[32px] overflow-hidden">
                    {/* 스크롤 영역 */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            padding: 24,
                        }}>
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

                    {/* 하단 버튼 */}
                    <View className="border-t border-gray-100 px-6 py-5">
                        <View className="flex-row gap-3">
                            <Button
                                variant="outlined"
                                className="flex-1"
                                onPress={() => {
                                    console.log("삭제 버튼 클릭");
                                    handleDelete();
                                }}>
                                삭제
                            </Button>

                            <Button
                                className="flex-1"
                                onPress={() => {
                                    onClose();
                                    onEdit(diary);
                                }}>
                                수정
                            </Button>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
