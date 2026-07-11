import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextComponent from "@/components/common/text/TextComponent";

type Props = {
    onPress: () => void;
};

export default function AddPetCard({ onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="items-center justify-center rounded-[28px] bg-white p-8"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 20,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                elevation: 6,
                minHeight: 255,
            }}>
            <View className="h-20 w-20 items-center justify-center rounded-full bg-[#F8A69B]">
                <Ionicons name="add" size={46} color="white" />
            </View>

            <TextComponent className="mt-7 text-[28px] font-bold text-[#2F2A28]">
                새 반려동물 등록하기
            </TextComponent>

            <TextComponent className="mt-3 text-center text-[#777]">
                새로운 가족을 등록하고{"\n"}
                건강 기록을 시작해보세요.
            </TextComponent>
        </Pressable>
    );
}
