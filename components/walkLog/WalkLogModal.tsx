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
import { WalkLogInputType, walkLogSchema } from "@/schemas/walkLog/walkLogSchema";
import walkLogApi from "@/api/user/walkLogApi";
import { WalkLog } from "@/types/walkLog";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";

const WALK_KEYWORDS = [
    "💩 쾌변했어요",
    "👃 노즈워크 킁킁",
    "🐶 친구랑 인사",
    "🏃‍♂️ 컨디션 최상",
    "🥵 금방 지쳐요",
    "🐾 다리/발바닥 불편",
    "⚠️ 켁켁/기침",
    "🤢 구토/설사",
];

interface WalkLogModalProps {
    visible: boolean;
    onClose: () => void;
    petId: number;
    reload: () => Promise<void>;
    initialData: WalkLog | null;
}

function WalkLogModal({ visible, onClose, petId, reload, initialData }: WalkLogModalProps) {
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WalkLogInputType>({
        resolver: zodResolver(walkLogSchema),
        defaultValues: {
            walkDate: format(new Date(), "yyyyMMdd"),
            duration: 0,
            keywords: [],
        },
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    walkDate: format(initialData.walkDate, "yyyyMMdd"),
                    duration: initialData.duration,
                    keywords: initialData.keywords,
                });
            } else {
                reset({
                    walkDate: format(new Date(), "yyyyMMdd"),
                    duration: 0,
                    keywords: [],
                });
            }
        }
    }, [visible, reset, initialData]);

    const onSubmit = async (data: WalkLogInputType) => {
        try {
            const { walkDate, ...submitData } = data;

            const formattedDate =
                data.walkDate.slice(0, 4) +
                "-" +
                data.walkDate.slice(4, 6) +
                "-" +
                data.walkDate.slice(6, 8);

            const payload = {
                ...submitData,
                walkDate: formattedDate,
            };

            if (initialData) {
                await walkLogApi.updateWalkLog(initialData.id, payload);
            } else {
                await walkLogApi.createWalkLog(petId, payload);
            }
            await reload();
            onClose();
        } catch (error) {
            console.log(error);
            const errorActionText = initialData ? "수정하는" : "등록하는";

            if (Platform.OS === "web") {
                alert(`산책 기록을 ${errorActionText} 중 오류가 발생했습니다.`);
            } else {
                Alert.alert("오류", `산책 기록을 ${errorActionText} 중 오류가 발생했습니다.`);
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
                            title={initialData ? "산책 기록 수정" : "산책 기록 등록"}
                            className={"h-auto pb-6 mb-6"}
                        />

                        <View className={"gap-2"}>
                            <Controller
                                control={control}
                                name={"walkDate"}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <InputGroup
                                            id={"walkDate"}
                                            label="날짜 (YYYY-MM-DD)"
                                            selectTextOnFocus={true}
                                            maxLength={8}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            errorMessage={errors.walkDate?.message}
                                        />
                                    );
                                }}
                            />

                            <Controller
                                control={control}
                                name={"duration"}
                                render={({ field: { onChange, onBlur, value } }) => {
                                    return (
                                        <InputGroup
                                            id={"duration"}
                                            label="산책 시간 (분)"
                                            onBlur={onBlur}
                                            onChangeText={val => onChange(Number(val))}
                                            errorMessage={errors.duration?.message}
                                            keyboardType="numeric"
                                            placeholder="예: 30"
                                            value={value ? String(value) : ""}
                                        />
                                    );
                                }}
                            />

                            <Controller
                                control={control}
                                name="keywords"
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <InputGroup
                                        label="오늘의 특징 (최대 3개)"
                                        errorMessage={error?.message}>
                                        <View className="flex-row flex-wrap gap-2 mt-1">
                                            {WALK_KEYWORDS.map(keyword => {
                                                const isSelected = value.includes(keyword);
                                                const isMaxReached =
                                                    value.length >= 3 && !isSelected;

                                                return (
                                                    <Button
                                                        size={"small"}
                                                        key={keyword}
                                                        disabled={isMaxReached}
                                                        onPress={() => {
                                                            if (isSelected) {
                                                                onChange(
                                                                    value.filter(
                                                                        k => k !== keyword,
                                                                    ),
                                                                );
                                                            } else {
                                                                onChange([...value, keyword]);
                                                            }
                                                        }}
                                                        className={twMerge(
                                                            "px-3 py-2 rounded-full border",
                                                            isSelected
                                                                ? "bg-[#e87c71] border-[#e87c71]"
                                                                : isMaxReached
                                                                  ? "bg-gray-100 border-gray-200 opacity-50"
                                                                  : "bg-white border-gray-300",
                                                        )}
                                                        textClassName={
                                                            isSelected
                                                                ? "text-white font-bold"
                                                                : "text-gray-700"
                                                        }>
                                                        {keyword}
                                                    </Button>
                                                );
                                            })}
                                        </View>
                                    </InputGroup>
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

export default WalkLogModal;
