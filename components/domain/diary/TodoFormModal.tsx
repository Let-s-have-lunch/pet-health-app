import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Pressable,
    Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import Title from "@/components/common/title/Title";
import todoApi from "@/api/user/todoApi";
import { TodoFormInputType, todoFormSchema } from "@/schemas/todo/todoFormSchema";
import { Todo } from "@/types/todo";

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
    const [showPicker, setShowPicker] = useState(false);

    const {
        control,
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TodoFormInputType>({
        resolver: zodResolver(todoFormSchema),
        defaultValues: { title: "", date: new Date() },
    });

    const selectedDate = watch("date");

    useEffect(() => {
        if (visible) {
            reset({
                title: initialData?.title || "",
                date: initialData ? new Date(initialData.date) : new Date(),
            });
        }
    }, [visible, reset, initialData]);

    const onSubmit = async (data: TodoFormInputType) => {
        const [year, month, day] = targetDate.split("-").map(Number);
        const finalDate = new Date(year, month - 1, day);
        finalDate.setHours(data.date.getHours(), data.date.getMinutes(), 0, 0);

        const payload = {
            title: data.title,
            date: finalDate,
        };

        try {
            if (initialData) {
                await todoApi.updateTodo(initialData.id, payload);
            } else {
                await todoApi.createTodo(payload);
            }
            await onRefresh();
            onClose();
        } catch (error) {
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
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

                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="제목"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.title?.message}
                                    placeholder="할 일을 입력해주세요."
                                />
                            )}
                        />

                        {/* 플랫폼별 시간 선택 UI */}
                        <InputGroup label="시간">
                            {Platform.OS === "web" ? (
                                <input
                                    type="time"
                                    value={format(selectedDate, "HH:mm")}
                                    onChange={e => {
                                        const [hours, minutes] = e.target.value
                                            .split(":")
                                            .map(Number);
                                        const newDate = new Date(selectedDate);
                                        newDate.setHours(hours, minutes);
                                        setValue("date", newDate);
                                    }}
                                    className="w-full px-5 py-4 border border-gray-300 rounded-[28px] text-lg"
                                />
                            ) : (
                                <>
                                    <Button variant="outlined" onPress={() => setShowPicker(true)} className="rounded-[28px]">
                                        {format(selectedDate, "a hh:mm")}
                                    </Button>
                                    {showPicker && (
                                        <DateTimePicker
                                            value={selectedDate}
                                            mode="time"
                                            display={Platform.OS === "ios" ? "spinner" : "default"}
                                            onChange={(event, date) => {
                                                if (Platform.OS !== "ios") setShowPicker(false);
                                                if (date) setValue("date", date);
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </InputGroup>

                        <View className="flex-row mt-6 gap-3">
                            <Button variant={"outlined"} wrap={true} onPress={onClose}>
                                취소
                            </Button>
                            <Button
                                wrap={true}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                {isSubmitting ? "처리중..." : initialData ? "수정" : "등록"}
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </KeyboardAvoidingView>
        </Modal>
    );
}
