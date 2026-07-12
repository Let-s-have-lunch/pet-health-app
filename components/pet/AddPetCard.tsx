import Card from "@/components/common/card/Card";
import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";

type Props = {
    onPress: () => void;
};

export default function AddPetCard({ onPress }: Props) {
    return (
        <Card shadow="md" style={{ width: "100%", minHeight: 320 }}>
            <Pressable
                onPress={onPress}
                className={twMerge(["items-center", "justify-center"], ["py-5"])}>
                <View
                    className={twMerge(
                        ["items-center", "justify-center"],
                        ["mt-5", "h-20", "w-20"],
                        ["rounded-full"],
                        ["bg-[#F8A69B]"],
                    )}>
                    <Ionicons name="add" size={44} color="white" />
                </View>
                <TextComponent
                    className={twMerge(
                        ["mt-6"],
                        ["text-[26px]", "font-bold", "text-text-default"],
                    )}>
                    새 반려동물 등록하기
                </TextComponent>
                <TextComponent
                    className={twMerge(
                        ["mt-3"],
                        ["text-center", "text-[16px]"],
                        ["text-text-secondary"],
                        ["leading-6"],
                    )}>
                    새로운 가족을 등록하고{"\n"}
                    건강 기록을 시작해보세요.
                </TextComponent>
            </Pressable>
        </Card>
    );
}
