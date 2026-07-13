import { View, TextInput, Pressable, Alert, Image, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "../../../../../components/common/text/TextComponent";
import { vetLogApi } from "@/api/user/vetLogApi";
import { usePetStore } from "@/stores/usePetStore"; // 💡 전역 스토어 추가

export default function VetLogCreatePage() {
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;

    const [hospitalName, setHospitalName] = useState("");
    const [visitPurpose, setVisitPurpose] = useState("");
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);

    const [diagnosis, setDiagnosis] = useState("");
    const [treatment, setTreatment] = useState("");
    const [cost, setCost] = useState("");
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

        try {
            await vetLogApi.create({
                petId: petId,
                visitDate: visitDate,
                hospitalName,
                visitPurpose: visitPurpose,
                diagnosis,
                treatment,
                cost: Number(cost || 0),
                memo,
            });

            Alert.alert("성공", "기록이 등록되었습니다.");
            router.back();
        } catch (error) {
            console.log(error);
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

                <TextComponent className="text-sm mb-1">병원 이름</TextComponent>

                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={hospitalName}
                    onChangeText={setHospitalName}
                />

                <TextComponent className="text-sm mb-1">방문 목적</TextComponent>

                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={visitPurpose}
                    onChangeText={setVisitPurpose}
                />

                <TextComponent className="text-sm mb-1">방문 날짜</TextComponent>

                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={visitDate}
                    onChangeText={setVisitDate}
                />

                <TextComponent className="text-sm mb-1">진단 내용</TextComponent>

                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={diagnosis}
                    onChangeText={setDiagnosis}
                />

                <TextComponent className="text-sm mb-1">치료 내용</TextComponent>

                <TextInput
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={treatment}
                    onChangeText={setTreatment}
                />

                <TextComponent className="text-sm mb-1">진료 비용</TextComponent>

                <TextInput
                    keyboardType="numeric"
                    className="border border-divider p-3 rounded-lg mb-3"
                    value={cost}
                    onChangeText={setCost}
                />

                <TextComponent className="text-sm mb-1">메모</TextComponent>

                <TextInput
                    multiline
                    className="border border-divider p-3 rounded-lg mb-6"
                    value={memo}
                    onChangeText={setMemo}
                />

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
