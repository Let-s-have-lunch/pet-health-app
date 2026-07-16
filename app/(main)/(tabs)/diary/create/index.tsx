import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ContentContainer from "@/components/layouts/common/ContentContainer";
import TextComponent from "@/components/common/text/TextComponent";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";

export default function CreateDiaryScreen() {
    return (
        <ContentContainer>
            <TextComponent className="text-[30px] font-bold mb-8">오늘의 일기 작성</TextComponent>

            {/* 사진 */}
            <TextComponent className="text-[20px] font-bold mb-3">오늘의 사진</TextComponent>

            <Pressable                className="
                rounded-[28px]
                border-2
                border-dashed
                border-primary-main
                items-center
                justify-center
                h-[220px]
                bg-background-paper
                ">
                <Ionicons name="image-outline" size={48} color="#BACFCD" />

                <TextComponent className="mt-4 text-lg font-semibold">사진 선택하기</TextComponent>

                <TextComponent className="mt-2 text-text-secondary">
                    추억을 사진으로 남겨보세요.
                </TextComponent>
            </Pressable>

            {/* 제목 */}

            <TextComponent className="text-[20px] font-bold mt-8 mb-3">제목 *</TextComponent>

            <Input placeholder="예) 로제와 첫 산책" />

            {/* 날짜 */}

            <TextComponent className="text-[20px] font-bold mt-6 mb-3">날짜 *</TextComponent>

            <Input editable={false} value="2026-07-15" />

            {/* 내용 */}

            <TextComponent className="text-[20px] font-bold mt-6 mb-3">
                오늘의 이야기 *
            </TextComponent>

            <Input
                multiline
                numberOfLines={7}
                textAlignVertical="top"
                placeholder="오늘 있었던 일을 자유롭게 기록해보세요."
                className="h-[220px]"
            />

            {/* 버튼 */}

            <View className="flex-row gap-4 mt-10">
                <Button variant="outline" className="flex-1">
                    취소
                </Button>

                <Button className="flex-1">저장</Button>
            </View>
        </ContentContainer>
    );
}
