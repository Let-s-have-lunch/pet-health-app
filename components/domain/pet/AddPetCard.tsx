import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { Pressable, View, useWindowDimensions } from "react-native";
import { SMALL_CARD_HEIGHT, LARGE_CARD_HEIGHT } from "@/components/constants/petCardHeight";
type Props = {
    onPress: () => void;
};

export default function AddPetCard({ onPress }: Props) {
    const { width } = useWindowDimensions();
    const isSmall = width < 450;
    
    return (
        <Card
            className={"rounded-[28px]"}
            style={{
                width: "100%",
                minHeight: isSmall ? SMALL_CARD_HEIGHT : LARGE_CARD_HEIGHT,
                flex: 1,
            }}>
            <View style={{ flex: 1 }}>
                <Pressable
                    onPress={onPress}
                    style={{ flex: 1 }}
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
            </View>
        </Card>
    );
}
