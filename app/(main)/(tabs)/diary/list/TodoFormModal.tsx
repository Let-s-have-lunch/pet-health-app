import React, { useEffect } from "react";
import {
    Modal,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Pressable,
    Keyboard,
} from "react-native";
import { Todo } from "@/types/todo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TodoFormInputType, todoFormSchema } from "@/schemas/todo/todoFormSchema";
import todoApi from "@/api/user/todoApi";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";

interface Props {
    visible: boolean;
    onClose: () => void;
    targetDate: string;
    initialData: Todo | null;
    onRefresh: () => Promise<void>;
}

export default function TodoFormModal({
    visible,
    onClose,
    targetDate,
    initialData,
    onRefresh,
}: Props) {
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TodoFormInputType>({
        resolver: zodResolver(todoFormSchema),
        defaultValues: {
            title: ""
        },
    });

    useEffect(() => {
        if (visible) {
            if (initialData) {
                reset({
                    title: initialData?.title,
                });
            } else {
                reset({
                    title: ""
                });
            }
        }
    }, [visible, reset, initialData]);

    const onSubmit = async (data: TodoFormInputType) => {
        try {
            if (initialData) {
                await todoApi.updateTodo(initialData.id, targetDate, data);
            } else {
                await todoApi.createTodo(targetDate, data);
            }

            await onRefresh();
            onClose();
        } catch (error) {
            console.log(error);
            const errorActionText = initialData ? "수정하는" : "등록하는";

            if (Platform.OS === "web") {
                alert(`일정을 ${errorActionText} 중 오류가 발생했습니다.`);
            } else {
                Alert.alert("오류", `일정을 ${errorActionText} 중 오류가 발생했습니다.`);
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
                            title={initialData ? "일정 수정" : "일정 등록"}
                            className={"h-auto pb-6 mb-6"}
                        />

                        <View className={"gap-2"}>
                            <Controller
                                control={control}
                                name={"title"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        id={"title"}
                                        label="제목"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.title?.message}
                                        maxLength={20}
                                        placeholder={"제목은 20자 이내로 작성해주세요."}
                                    />
                                )}
                            />
                        </View>

                        <View className="flex-row mt-4 gap-3">
                            <Button variant={"outlined"} wrap={true} onPress={onClose}>
                                취소
                            </Button>
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
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}
