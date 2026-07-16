import React, { useState, useEffect } from "react";
import {
    View,
    Pressable,
    Alert,
    Image,
    ScrollView,
    Platform,
    Modal,
    KeyboardAvoidingView,
    Keyboard,
    ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import { vetLogApi } from "@/api/user/vetLogApi";

interface VetLogUpdateModalProps {
    visible: boolean;
    onClose: () => void;
    logId: number | undefined; // 수정을 위해 선택된 기록의 ID
    petName?: string;
    reload: () => Promise<void>; // 수정 완료 후 목록을 새로고침할 함수
}

export default function VetRecordLogUpdateModal({
                                              visible,
                                              onClose,
                                              logId,
                                              petName,
                                              reload,
                                          }: VetLogUpdateModalProps) {
    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

    // 로딩 및 제출 상태
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 폼 상태
    const [hospitalName, setHospitalName] = useState("");
    const [visitPurpose, setVisitPurpose] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [cost, setCost] = useState("");
    const [memo, setMemo] = useState("");
    const [image, setImage] = useState<string | null>(null);

    // 모달이 열리고 logId가 바뀔 때마다 기존 상세 데이터 조회
    useEffect(() => {
        const loadExistingData = async () => {
            if (!visible || !logId) return;

            setIsLoading(true);
            try {
                const record = await vetLogApi.getById(logId);

                if (!record || typeof record !== "object") {
                    throw new Error("데이터를 찾을 수 없습니다.");
                }

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
                } else {
                    setImage(null);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                if (Platform.OS === "web") {
                    alert("데이터를 불러오는 데 실패했습니다.");
                } else {
                    Alert.alert("오류", "데이터를 불러오는 데 실패했습니다.");
                }
                onClose();
            } finally {
                setIsLoading(false);
            }
        };

        loadExistingData();
    }, [visible, logId]);

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
        if (!logId) return;

        if (!hospitalName.trim() || !visitPurpose.trim() || !visitDate.trim()) {
            Alert.alert("알림", "필수 항목(*)을 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("visitDate", visitDate);
            formData.append("hospitalName", hospitalName);
            formData.append("visitPurpose", visitPurpose);

            if (cost) formData.append("cost", String(Number(cost) || 0));
            // 메모가 빈 칸이면 빈 스트링이나 빈 값을 보낼 수 있게 세팅
            formData.append("memo", memo);

            // 새로 선택한 이미지(local uri)가 있을 때만 업로드
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

            await vetLogApi.update(logId, formData);

            if (Platform.OS === "web") {
                alert("기록이 수정되었습니다.");
            } else {
                Alert.alert("성공", "기록이 수정되었습니다.");
            }

            await reload(); // 리스트 갱신
            onClose(); // 모달 닫기
        } catch (error) {
            console.log("업로드 에러:", error);
            if (Platform.OS === "web") {
                alert("수정에 실패했습니다.");
            } else {
                Alert.alert("오류", "수정에 실패했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <Pressable
                    onPress={Keyboard.dismiss}
                    className="flex-1 justify-center items-center bg-black/50 p-6">
                    <Pressable
                        onPress={e => e.stopPropagation()}
                        className="bg-background-paper w-full max-w-xl rounded-3xl overflow-hidden shadow-xl max-h-[90%]">

                        {isLoading ? (
                            // 로딩 중일 때 모달 내부 레이아웃 유지하며 스피너 표시
                            <View className="p-10 items-center justify-center min-h-[300px]">
                                <ActivityIndicator size="large" color="#7F8C8D" />
                                <TextComponent className="mt-4 text-text-secondary">
                                    기록을 불러오는 중입니다...
                                </TextComponent>
                            </View>
                        ) : (
                            <ScrollView
                                className="p-6"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                <Title
                                    title={`${petName ? petName + " " : ""}병원 기록 수정`}
                                    className={"h-auto pb-6 mb-2"}
                                />

                                <View className={"gap-4"}>
                                    {/* 사진 영역 */}
                                    <View>
                                        <TextComponent className="text-sm mb-2 text-text-primary">
                                            반려동물 사진
                                        </TextComponent>
                                        {image ? (
                                            <View className="relative mb-2">
                                                <Image
                                                    source={{ uri: image }}
                                                    className="w-full h-48 rounded-lg"
                                                />
                                                <Pressable
                                                    className="absolute top-2 right-2 bg-black/50 p-1 rounded-full"
                                                    onPress={() => setImage(null)}>
                                                    <Ionicons name="close" size={20} color="white" />
                                                </Pressable>
                                            </View>
                                        ) : (
                                            <Pressable
                                                className="border border-dashed border-divider p-8 rounded-lg mb-2 items-center"
                                                onPress={pickImage}>
                                                <Ionicons name="camera-outline" size={32} color="#7F8C8D" />
                                                <TextComponent className="text-text-secondary mt-2">
                                                    사진 선택
                                                </TextComponent>
                                            </Pressable>
                                        )}
                                    </View>

                                    <InputGroup
                                        id="hospitalName"
                                        label="병원 이름 *"
                                        placeholder="예) 튼튼 동물병원"
                                        value={hospitalName}
                                        onChangeText={setHospitalName}
                                    />

                                    <InputGroup
                                        id="visitPurpose"
                                        label="방문 목적 *"
                                        placeholder="예) 심장사상충 예방접종"
                                        value={visitPurpose}
                                        onChangeText={setVisitPurpose}
                                    />

                                    <InputGroup
                                        id="visitDate"
                                        label="방문 날짜 *"
                                        placeholder="YYYY-MM-DD"
                                        value={visitDate}
                                        onChangeText={setVisitDate}
                                    />

                                    <InputGroup
                                        id="cost"
                                        label="진료 비용"
                                        placeholder="숫자만 입력"
                                        keyboardType="number-pad"
                                        value={cost}
                                        onChangeText={setCost}
                                    />

                                    <InputGroup
                                        id="memo"
                                        label="메모"
                                        placeholder="의사 선생님의 조언이나 특이사항을 적어주세요."
                                        multiline
                                        value={memo}
                                        onChangeText={setMemo}
                                    />
                                </View>

                                {/* 버튼 영역 */}
                                <View className="flex-row mt-6 gap-3">
                                    <Button
                                        wrap={true}
                                        onPress={onSubmit}
                                        disabled={isSubmitting}>
                                        {isSubmitting ? "수정중..." : "수정"}
                                    </Button>
                                    <Button variant={"outlined"} wrap={true} onPress={onClose}>
                                        취소
                                    </Button>
                                </View>
                            </ScrollView>
                        )}
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}