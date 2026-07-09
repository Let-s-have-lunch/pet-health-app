import { View, TextInput, Pressable, Platform, Alert } from "react-native"; // Modal 제거
import { router } from "expo-router";
import { useState } from "react";
import TextComponent from "../../../../../components/common/text/TextComponent";
import { weightLogApi } from "../../../../../api/user/weightLogApi";

export default function WeightLogCreatePage() {
    const [date, setDate] = useState("2026-07-07");
    const [weight, setWeight] = useState("");

    const onSubmit = async () => {
        try {
            // 백엔드로 데이터 전송
            await weightLogApi.create({
                petId: 1,
                weight: parseFloat(weight),
                recordDate: date,
            });

            // 성공 시 페이지 뒤로가기 (이러면 리스트 페이지로 돌아가며 데이터가 갱신됩니다)
            router.back();
        } catch (error) {
            console.log(error);
            const msg = "몸무게 기록에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        }
    };




    return (
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
            <View className="w-full bg-background-paper p-6 rounded-2xl border border-divider">
                <TextComponent className="text-lg font-bold text-text-default mb-4">
                    몸무게 등록
                </TextComponent>

                <TextComponent className="text-sm text-text-secondary mb-1">날짜</TextComponent>
                <TextInput
                    className="border border-divider p-3 rounded-lg mb-4 text-text-default"
                    value={date}
                    onChangeText={setDate}
                />

                <TextComponent className="text-sm text-text-secondary mb-1">몸무게</TextComponent>
                <TextInput
                    className="border border-divider p-3 rounded-lg mb-6 text-text-default"
                    placeholder="10.6kg"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                />

                <View className="flex-row gap-3">
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        className="flex-1 p-3 border border-divider rounded-lg">
                        <TextComponent className="text-center text-text-secondary font-bold">
                            취소
                        </TextComponent>
                    </Pressable>

                    <Pressable
                        onPress={onSubmit}
                        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        className="flex-1 p-3 bg-secondary-main rounded-lg">
                        <TextComponent className="text-center text-white font-bold">
                            등록
                        </TextComponent>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
