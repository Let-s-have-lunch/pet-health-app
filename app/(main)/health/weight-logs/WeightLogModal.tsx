import React, { useEffect } from "react";
import {
    Modal,
    View,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    Pressable,
} from "react-native";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import Title from "@/components/common/title/Title";
import { weightLogApi } from "@/api/user/weightLogApi";
import { WeightLog } from "@/types/weightLog";
import { WeightLogInputType, weightLogSchema } from "@/schemas/weightLog/weightLogSchema";
import { isAxiosError } from "axios";

interface WeightLogModalProps {
    visible: boolean;
    onClose: () => void;
    petId: number;
    reload: () => Promise<void>;
    initialData: WeightLog | null;
}

function WeightLogModal({ visible, onClose, petId, reload, initialData }: WeightLogModalProps) {
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WeightLogInputType>({
        resolver: zodResolver(weightLogSchema),
        defaultValues: {
            recordDate: format(new Date(), "yyyyMMdd"),
            weight: "", // 💡 0 대신 빈 문자열로 변경
            memo: "",
        },
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    recordDate: format(new Date(initialData.recordDate), "yyyyMMdd"),
                    weight: initialData.weight, // 수정 모드일 때는 기존 몸무게 표시
                    memo: initialData.memo || "",
                });
            } else {
                reset({
                    recordDate: format(new Date(), "yyyyMMdd"),
                    weight: "", // 💡 등록 모드일 때는 깔끔하게 비워두기
                    memo: "",
                });
            }
        }
    }, [visible, reset, initialData]);

    const onSubmit = async (data: WeightLogInputType) => {
        try {
            const { recordDate, memo, ...submitData } = data;

            const formattedDate =
                data.recordDate.slice(0, 4) +
                "-" +
                data.recordDate.slice(4, 6) +
                "-" +
                data.recordDate.slice(6, 8);

            const payload = {
                ...submitData,
                recordDate: formattedDate,
                memo: memo?.trim() === "" ? undefined : memo,
            };

            if (initialData) {
                await weightLogApi.update(initialData.id, petId, payload);
            } else {
                await weightLogApi.create(petId, payload);
            }

            await reload();
            onClose();
        } catch (error) {
            console.log(error);
            const errorActionText = initialData ? "수정하는" : "등록하는";

            // 💡 몸무게는 1일 1기록이므로 409 에러 처리를 반드시 해야 합니다!
            if (isAxiosError(error)) {
                if (error?.response?.status === 409) {
                    const msg =
                        "이미 해당 날짜에 기록된 몸무게가 있습니다. 리스트에서 기존 기록을 수정해 주세요.";
                    Platform.OS === "web" ? alert(msg) : Alert.alert("등록 실패", msg);
                    return; // 에러 띄우고 종료
                }
            }

            if (Platform.OS === "web") {
                alert(`몸무게 기록을 ${errorActionText} 중 오류가 발생했습니다.`);
            } else {
                Alert.alert("오류", `몸무게 기록을 ${errorActionText} 중 오류가 발생했습니다.`);
            }
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
                        className="bg-background-paper w-full max-w-xl rounded-3xl p-6 shadow-xl">
                        <Title
                            title={initialData ? "몸무게 기록 수정" : "몸무게 기록 등록"}
                            className={"h-auto pb-6 mb-6"}
                        />

                        <View className={"gap-2"}>
                            <Controller
                                control={control}
                                name={"recordDate"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        id={"recordDate"}
                                        label="날짜 (YYYY-MM-DD)"
                                        selectTextOnFocus={true}
                                        maxLength={8}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.recordDate?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name={"weight"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        id={"weight"}
                                        label="몸무게 (kg)"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        errorMessage={errors.weight?.message}
                                        keyboardType="numeric"

                                        // 💡 터치 시 한 번에 전체 선택! (여러 번 지울 필요 없음)
                                        selectTextOnFocus={true}

                                        // 💡 예시를 보여주어 사용자에게 입력 가이드 제공
                                        placeholder="예: 4.5"

                                        value={value?.toString() ?? ""}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name={"memo"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        id={"memo"}
                                        label="메모 (선택)"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.memo?.message}
                                        maxLength={20}
                                        placeholder={"메모는 20자 이내로 작성해주세요."}
                                    />
                                )}
                            />
                        </View>

                        <View className="flex-row mt-4 gap-3">
                            <Button
                                wrap={true}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                {initialData
                                    ? isSubmitting
                                        ? "수정중..."
                                        : "수정"
                                    : isSubmitting
                                      ? "등록중..."
                                      : "등록"}
                            </Button>
                            <Button variant={"outlined"} wrap={true} onPress={onClose}>
                                취소
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default WeightLogModal;
