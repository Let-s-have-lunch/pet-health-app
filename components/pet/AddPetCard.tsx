import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

type Props = {
    onPress: () => void;
};

export default function AddPetCard({ onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="mx-5 h-36 items-center justify-center rounded-[28px] bg-white"
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 20,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                elevation: 6,
            }}>
            <View className="flex-row items-center">
                <View className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-[#F8A69B]">
                    <Ionicons name="add" size={30} color="white" />
                </View>

                <Text className="text-[24px] font-semibold text-[#2F2A28]">
                    새 반려동물 등록하기
                </Text>
            </View>
        </Pressable>
    );
}
