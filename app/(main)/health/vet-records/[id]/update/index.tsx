import {
    View,
    Pressable,
    Alert,
    Image,
    ScrollView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { vetLogApi } from "@/api/user/vetLogApi";
import { usePetStore } from "@/stores/usePetStore";
import InputGroup from "@/components/common/input/InputGroup";
import TextComponent from "@/components/common/text/TextComponent";

export default function VetLogUpdatePage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const selectedPet = usePetStore(state => state.selectedPet);
    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    const [isLoading, setIsLoading] = useState(true);
    const [hospitalName, setHospitalName] = useState("");
    const [visitPurpose, setVisitPurpose] = useState("");
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
    const [cost, setCost] = useState("");
    const [memo, setMemo] = useState("");
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const loadExistingData = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                const result = await vetLogApi.getById(Number(id));

                // [수정] result 객체가 바로 데이터이므로 .data를 붙이지 않습니다.
                const record = result;

                if (!record || typeof record !== "object") {
                    throw new Error("데이터를 찾을 수 없습니다.");
                }

                // 값 할당 (record가 곧 데이터입니다)
                setHospitalName(record.hospitalName || "");
                setVisitPurpose(record.visitPurpose || "");
                setVisitDate(
                    record.visitDate
                        ? record.visitDate.split("T")[0]
                        : new Date().toISOString().split("T")[0],
                );
                setCost(record.cost ? String(record.cost) : "");
                setMemo(record.memo || "");

                if (record.receiptImage) {
                    setImage(
                        record.receiptImage.startsWith("http")
                            ? record.receiptImage
                            : `${BACKEND_URL}${record.receiptImage}`,
                    );
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [id]);

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
        if (!id) return;

        if (!hospitalName.trim() || !visitPurpose.trim() || !visitDate.trim()) {
            Alert.alert("알림", "필수 항목(*)을 모두 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("visitDate", visitDate);
            formData.append("hospitalName", hospitalName);
            formData.append("visitPurpose", visitPurpose);
            if (cost) formData.append("cost", String(Number(cost) || 0));
            if (memo) formData.append("memo", memo);

            if (image && !image.startsWith("http")) {
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

            await vetLogApi.update(Number(id), formData);

            Alert.alert("성공", "기록이 수정되었습니다.");
            router.back();
        } catch (error) {
            console.log("업로드 에러:", error);
            Alert.alert("오류", "수정에 실패했습니다.");
        }
    };

    if (isLoading) {
        return (
            <View className={twMerge("flex-1 justify-center items-center bg-black/50")}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <View className={twMerge("flex-1 justify-center items-center bg-black/50 p-5")}>
            <ScrollView
                className={twMerge("w-full bg-background-paper p-6 rounded-2xl flex-grow-0")}>
                <TextComponent className={twMerge("text-lg font-bold mb-4")}>
                    {selectedPet?.name} 병원 기록 수정
                </TextComponent>

                <TextComponent className={twMerge("text-sm mb-2")}>반려동물 사진</TextComponent>
                {image ? (
                    <View className={twMerge("relative mb-4")}>
                        <Image
                            source={{ uri: image }}
                            className={twMerge("w-full h-48 rounded-lg")}
                        />
                        <Pressable
                            className={twMerge(
                                "absolute top-2 right-2 bg-black/50 p-1 rounded-full",
                            )}
                            onPress={() => setImage(null)}>
                            <Ionicons name="close" size={20} color="white" />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        className={twMerge(
                            "border border-dashed border-divider p-8 rounded-lg mb-4 items-center",
                        )}
                        onPress={pickImage}>
                        <Ionicons name="camera-outline" size={32} color="#7F8C8D" />
                        <TextComponent className={twMerge("text-text-secondary mt-2")}>
                            사진 선택
                        </TextComponent>
                    </Pressable>
                )}

                <InputGroup
                    label="병원 이름 *"
                    placeholder="예) 튼튼 동물병원"
                    value={hospitalName}
                    onChangeText={setHospitalName}
                />
                <InputGroup
                    label="방문 목적 *"
                    placeholder="예) 심장사상충 예방접종"
                    value={visitPurpose}
                    onChangeText={setVisitPurpose}
                />
                <InputGroup
                    label="방문 날짜 *"
                    placeholder="YYYY-MM-DD"
                    value={visitDate}
                    onChangeText={setVisitDate}
                />
                <InputGroup
                    label="진료 비용"
                    placeholder="숫자만 입력"
                    keyboardType="number-pad"
                    value={cost}
                    onChangeText={setCost}
                />
                <InputGroup
                    label="메모"
                    placeholder="의사 선생님의 조언이나 특이사항을 적어주세요."
                    multiline
                    value={memo}
                    onChangeText={setMemo}
                />

                <View className={twMerge("flex-row gap-3 mt-4")}>
                    <Pressable
                        className={twMerge("flex-1 p-3 border border-divider rounded-lg")}
                        onPress={() => router.back()}>
                        <TextComponent className={twMerge("text-center")}>취소</TextComponent>
                    </Pressable>
                    <Pressable
                        className={twMerge("flex-1 p-3 bg-secondary-main rounded-lg")}
                        onPress={onSubmit}>
                        <TextComponent className={twMerge("text-center text-white font-bold")}>
                            수정
                        </TextComponent>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
