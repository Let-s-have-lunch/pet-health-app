import { useEffect, useState } from "react";
import { Alert, Image, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import diaryApi from "@/api/user/diaryApi";
import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import TextComponent from "@/components/common/text/TextComponent";
import { Diary } from "@/types/diary";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

type Props = {
    visible: boolean;
    diary: Diary | null;
    date: string;
    onClose: () => void;
    onRefresh: () => void;
};

export default function CreateDiaryModal({ visible, diary, date, onClose, onRefresh }: Props) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;

        if (diary) {
            setTitle(diary.title);
            setContent(diary.content);

            if (diary.diaryImage) {
                setImageUri(
                    diary.diaryImage.startsWith("http")
                        ? diary.diaryImage
                        : `${BACKEND_URL}${diary.diaryImage}`,
                );
            } else {
                setImageUri(null);
            }
        } else {
            setTitle("");
            setContent("");
            setImageUri(null);
        }
    }, [visible, diary]);

    const pickImage = async () => {
        if (Platform.OS === "web") {
            Alert.alert("웹에서는 아직 이미지 변경이 지원되지 않습니다.");
            return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("갤러리 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert("제목을 입력해주세요.");
            return;
        }

        if (!content.trim()) {
            Alert.alert("내용을 입력해주세요.");
            return;
        }

        try {
            setLoading(true);

            if (diary) {
                await diaryApi.updateDiary(
                    diary.id,
                    {
                        title,
                        content,
                        date: new Date(diary.date),
                    },
                    imageUri ?? undefined,
                );
            } else {
                await diaryApi.createDiary(
                    {
                        title,
                        content,
                        date: new Date(date),
                    },
                    imageUri ?? undefined,
                );
            }

            onClose();
            onRefresh();
        } catch (e) {
            Alert.alert("저장 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}>
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center p-4"
                onPress={onClose}>
                <Pressable
                    onPress={e => e.stopPropagation()}
                    className="w-full max-w-[720px] max-h-[90%] bg-background-paper rounded-[30px] overflow-hidden">
                    {/* 내용 */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            padding: 28,
                            paddingBottom: 32,
                        }}>
                        <View className="flex-row justify-between items-center">
                            <TextComponent className="text-[28px] font-bold">
                                {diary ? "일기 수정" : "오늘의 일기 작성"}
                            </TextComponent>
                        </View>

                        <TextComponent className="mt-8 text-[18px] font-bold mb-3">
                            오늘의 사진
                        </TextComponent>

                        <Pressable
                            onPress={pickImage}
                            className="h-[230px] rounded-[24px] border border-dashed border-primary-main justify-center items-center overflow-hidden">
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <>
                                    <Ionicons name="image-outline" size={44} color="#999" />
                                    <TextComponent className="mt-4">사진 선택</TextComponent>
                                </>
                            )}
                        </Pressable>

                        <TextComponent className="text-[18px] font-bold mt-8 mb-2">
                            제목
                        </TextComponent>

                        <Input
                            value={title}
                            onChangeText={setTitle}
                            placeholder="예) 초코와 첫 산책"
                        />

                        <TextComponent className="text-[18px] font-bold mt-6 mb-2">
                            날짜
                        </TextComponent>

                        <Input editable={false} value={diary ? diary.date.slice(0, 10) : date} />

                        <TextComponent className="text-[18px] font-bold mt-6 mb-2">
                            오늘의 이야기
                        </TextComponent>

                        <Input
                            multiline
                            numberOfLines={7}
                            value={content}
                            onChangeText={setContent}
                            textAlignVertical="top"
                            className="h-[220px]"
                        />
                    </ScrollView>

                    {/* 하단 버튼 */}
                    <View className="border-t border-gray-100 px-6 py-5">
                        <View className="flex-row gap-4">
                            <Button variant="outlined" className="flex-1" onPress={onClose}>
                                취소
                            </Button>

                            <Button className="flex-1" disabled={loading} onPress={handleSave}>
                                {diary ? "수정" : "등록"}
                            </Button>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
