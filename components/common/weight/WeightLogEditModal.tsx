import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { weightLogApi } from "../../../api/user/weightLogApi";

interface WeightLogEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // 수정 성공 시 목록 새로고침용 콜백
    logId: number; // 수정할 기록의 고유 ID
    initialData: {
        // 부모 컴포넌트에서 넘겨받은 기존 데이터
        recordDate: string;
        weight: number;
        memo?: string;
        petId: number;
    };
}

const WeightLogEditModal: React.FC<WeightLogEditModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    logId,
    initialData,
}) => {
    const [recordDate, setRecordDate] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [memo, setMemo] = useState<string>("");

    useEffect(() => {
        if (isOpen && initialData) {
            const formattedDate = initialData.recordDate.includes("T")
                ? initialData.recordDate.split("T")[0]
                : initialData.recordDate;

            setRecordDate(formattedDate);
            setWeight(String(initialData.weight));
            setMemo(initialData.memo || "");
        }
    }, [isOpen, initialData]);

    // 수정 완료 프로세스
    const handleSubmit = async () => {
        const parsedWeight = parseFloat(weight);
        if (isNaN(parsedWeight) || parsedWeight <= 0) {
            Alert.alert("알림", "올바른 몸무게를 입력해주세요.");
            return;
        }

        const payload = {
            recordDate: recordDate,
            weight: parsedWeight,
            memo: memo.trim() === "" ? undefined : memo,
            petId: initialData.petId,
        };

        try {
            const response = await weightLogApi.update(logId, payload);
            Alert.alert("성공", response.data.message || "몸무게 기록이 수정되었습니다.");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("몸무게 수정 오류:", error);
            const errorMsg = error.response?.data?.message || "수정 중 에러가 발생했습니다.";
            Alert.alert("에러", errorMsg);
        }
    };

    return (
        <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-text-default/70 px-6">
                <View className="w-full max-w-[320px] bg-white p-6 rounded-2xl shadow-xl">
                    <Text className="text-[18px] text-text-default font-bold text-center mb-5">
                        몸무게 기록 수정
                    </Text>

                    {/* 1. 날짜 입력 필드  */}
                    <View className="mb-4 flex-col gap-1.5">
                        <Text className="text-[13px] text-text-secondary font-medium">
                            기록 날짜
                        </Text>
                        <TextInput
                            value={recordDate}
                            onChangeText={setRecordDate}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#7F8C8D"
                            className="p-3 rounded-lg border border-divider text-text-default text-[14px]"
                        />
                    </View>

                    {/* 2. 몸무게 입력 필드 */}
                    <View className="mb-4 flex-col gap-1.5">
                        <Text className="text-[13px] text-text-secondary font-medium">
                            몸무게 (kg)
                        </Text>
                        <TextInput
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor="#7F8C8D"
                            className="p-3 rounded-lg border border-divider text-text-default text-[14px]"
                        />
                    </View>

                    {/* 3. 메모 입력 필드 */}
                    <View className="mb-6 flex-col gap-1.5">
                        <Text className="text-[13px] text-text-secondary font-medium">
                            메모 (선택)
                        </Text>
                        <TextInput
                            value={memo}
                            onChangeText={setMemo}
                            placeholder="특이사항을 입력해주세요."
                            placeholderTextColor="#7F8C8D"
                            className="p-3 rounded-lg border border-divider text-text-default text-[14px]"
                        />
                    </View>

                    {/* 하단 제어 버튼 레이아웃 */}
                    <View className="flex-row gap-2.5">
                        {/* 취소 버튼  */}
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            className="flex-1 p-3.5 rounded-lg bg-error-main justify-center items-center">
                            <Text className="text-text-default font-medium text-[14px]">취소</Text>
                        </TouchableOpacity>

                        {/* 수정 완료 버튼  */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            activeOpacity={0.7}
                            className="flex-1 p-3.5 rounded-lg bg-primary-main justify-center items-center">
                            <Text className="text-text-default font-bold text-[14px]">
                                수정 완료
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default WeightLogEditModal;
