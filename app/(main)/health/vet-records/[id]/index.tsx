import { View, TextInput, Pressable, Alert, Image, ScrollView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "../../../../../components/common/text/TextComponent";
import { vetLogApi } from "@/api/user/vetLogApi";
import { usePetStore } from "@/stores/usePetStore";

export default function VetLogUpdatePage() {
    const selectedPet = usePetStore(state => state.selectedPet);
    const petId = selectedPet?.id;

    const params = useLocalSearchParams();
    const id = params.id as string;

    const [hospitalName, setHospitalName] = useState((params.hospitalName as string) || "");
    const [visitPurpose, setVisitPurpose] = useState((params.visitPurpose as string) || "");
    const [visitDate, setVisitDate] = useState(
        (params.visitDate as string) || new Date().toISOString().split("T")[0],
    );

    const [diagnosis, setDiagnosis] = useState((params.diagnosis as string) || "");
    const [treatment, setTreatment] = useState((params.treatment as string) || "");
    const [cost, setCost] = useState((params.cost as string) || "");
    const [memo, setMemo] = useState((params.memo as string) || "");
    const [image, setImage] = useState<string | null>((params.receiptImage as string) || null);

    useEffect(() => {
        if (!petId || !id) {
            const message = !petId ? "선택된 반려동물이 없습니다." : "수정할 기록의 ID가 없습니다.";
            if (Platform.OS === "web") {
                alert(message);
            } else {
                Alert.alert("알림", message);
            }
            router.back();
        }
    }, [petId, id]);

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
        // 💡 수정 페이지이므로 record id(id)만 확실히 있으면 됩니다.
        if (!id) {
            Alert.alert("오류", "수정할 기록의 정보가 없습니다.");
            return;
        }

        try {
            const payload = {
                visitDate,
                hospitalName,
                visitPurpose,
                diagnosis,
                treatment,
                cost: Number(cost || 0),
                memo,
            };

            await vetLogApi.update(Number(id), payload);

            if (Platform.OS === "web") {
                alert("기록이 수정되었습니다.");
            } else {
                Alert.alert("성공", "기록이 수정되었습니다.");
            }

            router.back();
        } catch (error) {
            console.log("수정 에러:", error);

            if (Platform.OS === "web") {
                alert("수정에 실패했습니다.");
            } else {
                Alert.alert("오류", "수정에 실패했습니다.");
            }
        }
    };

    if (!petId || !id) {
        return <View className="flex-1 bg-black/50" />;
    }

    return (
        <View className="flex-1 justify-center items-center bg-black/50 p-5">
            <ScrollView
                className="w-full bg-background-paper p-6 rounded-2xl flex-grow-0"
                keyboardShouldPersistTaps="handled">
                <TextComponent className="text-lg font-bold mb-4">
                    {selectedPet?.name} 병원 기록 수정
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
                            수정
                        </TextComponent>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
