import { WaterIntakeLog } from "@/types/waterIntakeLog";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WaterLogInputType, waterLogSchema } from "@/schemas/waterLog/waterLogSchema";
import { format } from "date-fns";
import React, { useEffect } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    View,
} from "react-native";
import waterIntakeApi from "@/api/user/waterIntakeApi";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import { isAxiosError } from "axios";

interface WaterLogModalProps {
    visible: boolean;
    onClose: () => void;
    petId: number;
    reload: () => Promise<void>;
    initialData: WaterIntakeLog | null;
}

function WaterLogModal({ visible, onClose, petId, reload, initialData }: WaterLogModalProps) {
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WaterLogInputType>({
        resolver: zodResolver(waterLogSchema),
        defaultValues: {
            recordDate: format(new Date(), "yyyyMMdd"),
            amount: 0,
            memo: "",
        },
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    recordDate: format(new Date(initialData.recordDate), "yyyyMMdd"),
                    amount: initialData.amount,
                    memo: initialData.memo || "",
                });
            } else {
                reset({
                    recordDate: format(new Date(), "yyyyMMdd"),
                    amount: 0,
                    memo: "",
                });
            }
        }
    }, [visible, reset, initialData]);

    const onSubmit = async (data: WaterLogInputType) => {
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
                await waterIntakeApi.updateWaterLog(initialData.id, payload);
            } else {
                await waterIntakeApi.createWaterLog(petId, payload);
            }

            await reload();
            onClose();
        } catch (error) {
            console.log(error);
            const errorActionText = initialData ? "수정하는" : "등록하는";

            if (Platform.OS === "web") {
                alert(`음수량 기록을 ${errorActionText} 중 오류가 발생했습니다.`);
            } else {
                Alert.alert("오류", `음수량 기록을 ${errorActionText} 중 오류가 발생했습니다.`);
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
                            title={initialData ? "음수량 기록 수정" : "음수량 기록 등록"}
                            className={"h-auto pb-6 mb-6"}
                        />

                        <View className={"gap-2"}>
                            <Controller
                                control={control}
                                name={"recordDate"}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <InputGroup
                                            id={"recordDate"}
                                            label="날짜 (YYYY-MM-DD)"
                                            selectTextOnFocus={true}
                                            maxLength={8}
                                            onBlur={onBlur}
                                            keyboardType={"number-pad"}
                                            onChangeText={text => {
                                                const filteredText = text.replace(/-/g, "");
                                                onChange(filteredText);
                                            }}
                                            value={value}
                                            errorMessage={errors.recordDate?.message}
                                        />
                                    );
                                }}
                            />

                            <Controller
                                control={control}
                                name={"amount"}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <InputGroup
                                            id={"amount"}
                                            label="음수량 (ml)"
                                            onBlur={onBlur}
                                            onChangeText={val => onChange(Number(val))}
                                            errorMessage={errors.amount?.message}
                                            keyboardType="numeric"
                                            placeholder="예: 30"
                                            value={value ? String(value) : ""}
                                        />
                                    );
                                }}
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

export default WaterLogModal;
