import { View, Pressable, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import TextComponent from "@/components/common/text/TextComponent";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import diaryApi from "@/api/user/diaryApi";

export default function CreateDiaryScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("권한 필요", "사진을 선택하려면 갤러리 접근 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            console.log("선택한 이미지:", result.assets[0].uri);
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            if (!title.trim()) {
                Alert.alert("알림", "제목을 입력해주세요.");
                return;
            }

            if (!content.trim()) {
                Alert.alert("알림", "내용을 입력해주세요.");
                return;
            }

            if (!date) {
                Alert.alert("알림", "날짜가 없습니다.");
                return;
            }

            await diaryApi.createDiary(
                {
                    title,
                    content,
                    date: new Date(date),
                },
                imageUri ?? undefined,
            );

            Alert.alert("완료", "일기가 등록되었습니다.");

            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("오류", "일기 등록에 실패했습니다.");
        }
    };

    const handleBack = () => {
        router.dismiss();
    };


    return (
        <ContentContainer>
            <TextComponent className="text-[30px] font-bold mb-8">오늘의 일기 작성</TextComponent>

            {/* 사진 */}
            <TextComponent className="text-[20px] font-bold mb-3"> 오늘의 사진</TextComponent>

            <Pressable
                onPress={pickImage}
                className="
                rounded-[28px]
                border-2
                border-dashed
                border-primary-main
                items-center
                justify-center
                h-[220px]
                bg-background-paper
                overflow-hidden
                ">
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <>
                        <Ionicons name="image-outline" size={48} color="#BACFCD" />

                        <TextComponent className="mt-4 text-lg font-semibold">
                            사진 선택하기
                        </TextComponent>

                        <TextComponent className="mt-2 text-text-secondary">
                            추억을 사진으로 남겨보세요.
                        </TextComponent>
                    </>
                )}
            </Pressable>

            <TextComponent className="text-[20px] font-bold mt-8 mb-3"> 제목 *</TextComponent>
            <Input value={title} onChangeText={setTitle} placeholder="예) 초코와 첫 산책" />

            <TextComponent className="text-[20px] font-bold mt-6 mb-3"> 날짜 *</TextComponent>

            <Input editable={false} value={date} />

            <TextComponent className="text-[20px] font-bold mt-6 mb-3">
                오늘의 이야기 *
            </TextComponent>

            <Input
                multiline
                numberOfLines={7}
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
                placeholder="오늘 있었던 일을 자유롭게 기록해보세요."
                className="h-[220px]"
            />

            <View className="flex-row gap-4 mt-10">
                <Button variant="outlined" className="flex-1" onPress={handleBack}>
                    취소
                </Button>

                <Button className="flex-1" onPress={handleSave}>등록</Button>
            </View>
        </ContentContainer>
    );
}
