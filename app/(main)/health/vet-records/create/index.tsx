import { View, TextInput, Pressable, Alert, Image, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "../../../../../components/common/text/TextComponent";
import { vetLogApi } from "@/api/user/vetLogApi";
import { usePetStore } from "@/stores/usePetStore";

export default function VetLogCreatePage() {
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;

    const [hospitalName, setHospitalName] = useState("");
    const [visitPurpose, setVisitPurpose] = useState("");
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
    const [cost, setCost] = useState(""); // 💡 진료 비용 상태 복구
    const [memo, setMemo] = useState("");
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!petId) {
            if (Platform.OS === "web") {
                alert("선택된 반려동물이 없습니다.");
            } else {
                Alert.alert("알림", "선택된 반려동물이 없습니다.");
            }
            router.back();
        }
    }, [petId]);

    // 사진 선택
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onSubmit = async () => {
        if (!petId) {
            Alert.alert("오류", "선택된 반려동물이 없습니다.");
            return;
        }

        // 필수 값 검증
        if (!hospitalName.trim() || !visitPurpose.trim() || !visitDate.trim()) {
            Alert.alert("알림", "필수 항목(* 표시)을 모두 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("petId", String(petId));
            formData.append("visitDate", visitDate);
            formData.append("hospitalName", hospitalName);
            formData.append("visitPurpose", visitPurpose);

            // 💡 진료 비용 값 추가 (입력값이 있으면 숫자로 변환해서 전송, 없으면 "0" 또는 생략 가능)
            if (cost) formData.append("cost", String(Number(cost) || 0));
            if (memo) formData.append("memo", memo);

            if (image) {
                if (Platform.OS === "web") {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    const file = new File([blob], "receipt.jpg", { type: "image/jpeg" });
                    formData.append("image", file);
                } else {
                    const file = {
                        uri: image,
                        name: "receipt.jpg",
                        type: "image/jpeg",
                    };
                    formData.append("image", file as any);
                }
            }

            await vetLogApi.create(formData);

            Alert.alert("성공", "기록이 등록되었습니다.");
            router.back();
        } catch (error) {
            console.log("업로드 에러:", error);
            Alert.alert("오류", "등록에 실패했습니다.");
        }
    };

    if (!petId) {
        return <View className="flex-1 bg-black/50" />;
    }

    return (
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
            <ScrollView className="w-full bg-background-paper p-6 rounded-2xl flex-grow-0">
                <TextComponent className="text-lg font-bold mb-4">
                    {selectedPet?.name} 병원 기록 등록
                </TextComponent>

                <TextComponent className="text-sm mb-1">반려동물 사진</TextComponent>

                {image ? (
                    <View className="relative mb-3">
                        <Image source={{ uri: image }} className="w-full h-48 rounded-lg" />
                        <Pressable
                            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full"
                            onPress={() => setImage(null)}>
                            <Ionicons name="close" size={20} color="white" />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        className="border border-dashed border-divider p-8 rounded-lg mb-3 items-center"
                        onPress={pickImage}>
                        <Ionicons name="camera-outline" size={32} color="#7F8C8D" />
                        <TextComponent className="text-text-secondary mt-2">
                            사진 선택
                        </TextComponent>
                    </Pressable>
                )}

                <TextComponent className="text-sm mb-1">
                    병원 이름 <TextComponent className="text-error-main">*</TextComponent>
                </TextComponent>
                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={hospitalName}
                    onChangeText={setHospitalName}
                    placeholder="예) 튼튼 동물병원"
                />

                <TextComponent className="text-sm mb-1">
                    방문 목적 <TextComponent className="text-error-main">*</TextComponent>
                </TextComponent>
                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={visitPurpose}
                    onChangeText={setVisitPurpose}
                    placeholder="예) 심장사상충 예방접종"
                />

                <TextComponent className="text-sm mb-1">
                    방문 날짜 <TextComponent className="text-error-main">*</TextComponent>
                </TextComponent>
                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={visitDate}
                    onChangeText={setVisitDate}
                />

                {/* 💡 진료 비용 입력창 복구 (선택 입력) */}
                <TextComponent className="text-sm mb-1">진료 비용</TextComponent>
                <TextInput
                    keyboardType="numeric"
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={cost}
                    onChangeText={setCost}
                    placeholder="예) 15000 (숫자만 입력)"
                />

                <TextComponent className="text-sm mb-1">메모</TextComponent>
                <TextInput
                    multiline
                    className="border border-divider p-3 rounded-lg mb-6 min-h-[80px]"
                    value={memo}
                    onChangeText={setMemo}
                    placeholder="의사 선생님의 조언이나 특이사항을 적어주세요."
                    textAlignVertical="top"
                />

                {/* 하단 버튼 */}
                <View className="flex-row gap-3">
                    <Pressable
                        className="flex-1 p-3 border border-divider rounded-lg"
                        onPress={() => router.back()}>
                        <TextComponent className="text-center">취소</TextComponent>
                    </Pressable>

                    <Pressable
                        className="flex-1 p-3 bg-secondary-main rounded-lg"
                        onPress={onSubmit}>
                        <TextComponent className="text-center text-white font-bold">
                            등록
                        </TextComponent>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
