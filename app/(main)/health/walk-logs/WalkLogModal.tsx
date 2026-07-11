import React, { useEffect } from "react";
import {
    Modal,
    View,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup"; // ✅ 적용
import { WalkLogInputType, walkLogSchema } from "@/schemas/walkLog/walkLogSchema";
import walkLogApi from "@/api/user/walkLogApi";

interface WalkLogModalProps {
    visible: boolean;
    onClose: () => void;
    petId: number;
    reload: () => Promise<void>;
}

function WalkLogModal({ visible, onClose, petId, reload }: WalkLogModalProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WalkLogInputType>({
        resolver: zodResolver(walkLogSchema),
        defaultValues: {
            walkDate: format(new Date(), "yyyy-MM-dd"),
            duration: 0,
            memo: "",
        },
    });

    const onSubmit = async (data: WalkLogInputType) => {
        try {
            await walkLogApi.createWalkLog(petId, data);
            await reload();
            onClose();
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("산책 기록을 등록하는 중 오류가 발생했습니다.")
            } else {
                Alert.alert("오류", "산책기록을 등록하는 중 오류가 발생했습니다.")
            }
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 justify-center items-center bg-black/50 p-6">
                        <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                            <View className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-xl">
                                <TextComponent className="text-xl font-bold mb-6">
                                    산책 기록 등록
                                </TextComponent>

                                <Controller
                                    control={control}
                                    name={"walkDate"}
                                    render={({ field: { onChange, onBlur, value } }) => {
                                        return (
                                            <InputGroup
                                                id={"walkDate"}
                                                label="날짜 (YYYY-MM-DD)"
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
                                            />
                                        );
                                    }}
                                />

                                {/* 2. 시간 입력 */}
                                <Controller
                                    control={control}
                                    name="duration"
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <InputGroup
                                            label="산책 시간 (분)"
                                            value={String(value)}
                                            onChangeText={val => onChange(Number(val))}
                                            errorMessage={error?.message}
                                            keyboardType="numeric"
                                            placeholder="예: 30"
                                        />
                                    )}
                                />

                                {/* 3. 메모 입력 */}
                                <Controller
                                    control={control}
                                    name="memo"
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <InputGroup
                                            label="메모 (선택)"
                                            value={value}
                                            onChangeText={onChange}
                                            errorMessage={error?.message}
                                            placeholder="메모를 입력하세요"
                                        />
                                    )}
                                />

                                <View className="flex-row mt-4 gap-3">
                                    <Button
                                        wrap={true}
                                        onPress={handleSubmit(onSubmit)}
                                        disabled={isSubmitting}>
                                        {isSubmitting ? "등록중..." : "등록"}
                                    </Button>
                                    <Button variant={"outlined"} wrap={true} onPress={onClose}>
                                        취소
                                    </Button>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default WalkLogModal;
