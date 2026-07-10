import {
    Modal,
    View,
    Pressable,
    TextInput,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import TextComponent from "../../../components/common/text/TextComponent";
import { waterIntakeApi } from "../../../api/user/waterIntakeApi";

interface WaterIntakeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // 성공 시 리스트/대시보드 리프레시용 콜백
    logId: number;
    initialData: {
        petId: number;
        amount: number;
        recordDate: string;
        memo?: string;
    };
}

export default function WaterIntakeEditModal({
    isOpen,
    onClose,
    onSuccess,
    logId,
    initialData,
}: WaterIntakeEditModalProps) {
    // 기존 데이터로 초기 상태 세팅
    const [amount, setAmount] = useState<string>(initialData.amount.toString());
    const [memo, setMemo] = useState<string>(initialData.memo || "");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // ➡️ logId가 0이면 등록 모드, 0이 아니면 수정 모드
    const isEditMode = logId !== 0;

    const handleSubmit = async () => {
        const parsedAmount = parseInt(amount, 10);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            const warningMsg = "올바른 음수량을 입력해주세요. (0ml 이상)";
            if (Platform.OS === "web") {
                alert(warningMsg);
            } else {
                Alert.alert("경고", warningMsg);
            }
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                petId: initialData.petId,
                amount: parsedAmount,
                recordDate: initialData.recordDate,
                memo: memo.trim() || undefined,
            };

            if (isEditMode) {
                await waterIntakeApi.update(logId, payload);
            } else {
                await waterIntakeApi.create(payload); // 또는 프로젝트의 등록 API 메서드 명 적용 (예: post)
            }

            const successMsg = isEditMode
                ? "음수량 기록이 수정되었습니다."
                : "음수량 기록이 등록되었습니다.";

            if (Platform.OS === "web") {
                alert(successMsg);
            } else {
                Alert.alert("성공", successMsg);
            }

            onSuccess(); // 홈 화면 대시보드 또는 리스트 새로고침
            onClose(); // 모달 닫기
        } catch (error) {
            console.log(error);

            const errorMsg = isEditMode
                ? "수정에 실패했습니다. 다시 시도해주세요."
                : "등록에 실패했습니다. 다시 시도해주세요.";

            if (Platform.OS === "web") {
                alert(errorMsg);
            } else {
                Alert.alert("오류", errorMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal transparent={true} visible={isOpen} animationType="fade" onRequestClose={onClose}>
            {/* 배경 딤드 처리 */}
            <View className="flex-1 justify-center items-center bg-black/40 px-6">
                {/* 모달 컨텐츠 바디 */}
                <View className="w-full max-w-sm bg-background-paper rounded-[12px] p-5 border border-divider shadow-lg">
                    {/* 헤더 영역 - 타이틀 동적 변경 */}
                    <View className="flex-row justify-between items-center mb-5">
                        <TextComponent className="text-lg font-bold text-text-default">
                            {isEditMode ? "음수량 기록 수정" : "음수량 기록 등록"}
                        </TextComponent>
                        <Pressable onPress={onClose} hitSlop={10}>
                            <FontAwesome name="times" size={18} color="#7F8C8D" />
                        </Pressable>
                    </View>

                    {/* 날짜 표시 정보 (비활성화 상태) */}
                    <View className="bg-background-default p-2 rounded-lg mb-4 border border-divider">
                        <TextComponent className="text-xs text-text-secondary text-center">
                            기록 날짜: {initialData.recordDate}
                        </TextComponent>
                    </View>

                    {/* 1. 음수량 입력 필드 */}
                    <View className="mb-4">
                        <TextComponent className="text-sm font-bold text-text-default mb-2">
                            음수량 (ml)
                        </TextComponent>
                        <TextInput
                            className="bg-background-default border border-divider rounded-[8px] p-3 text-text-default font-medium"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            placeholder="예: 150"
                            placeholderTextColor="#7F8C8D"
                            editable={!isSubmitting}
                        />
                    </View>

                    {/* 2. 메모 입력 필드 */}
                    <View className="mb-6">
                        <TextComponent className="text-sm font-bold text-text-default mb-2">
                            메모
                        </TextComponent>
                        <TextInput
                            className="bg-background-default border border-divider rounded-[8px] p-3 text-text-default text-sm"
                            value={memo}
                            onChangeText={setMemo}
                            placeholder="특이사항을 입력해주세요 (선택)"
                            placeholderTextColor="#7F8C8D"
                            maxLength={40}
                            editable={!isSubmitting}
                        />
                    </View>

                    {/* 하단 버튼 제어 영역 */}
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={onClose}
                            disabled={isSubmitting}
                            className="flex-1 bg-divider py-3 rounded-[8px] items-center">
                            <TextComponent className="text-text-secondary font-bold">
                                취소
                            </TextComponent>
                        </Pressable>

                        <Pressable
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-secondary-main py-3 rounded-[8px] items-center justify-center flex-row">
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#2C2C2C" />
                            ) : (
                                <TextComponent className="text-text-default font-bold">
                                    {isEditMode ? "저장하기" : "등록하기"}
                                </TextComponent>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
