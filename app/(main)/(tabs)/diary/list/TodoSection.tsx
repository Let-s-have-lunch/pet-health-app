import React, { useState } from "react";
import { View, Alert, Platform } from "react-native";
import { Todo } from "@/types/todo";
import todoApi from "@/api/user/todoApi";
import TodoFormModal from "@/app/(main)/(tabs)/diary/list/TodoFormModal";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import TodoHistorySection from "./TodoHistorySection";

interface Props {
    todos: Todo[];
    targetDate: string;
    onRefresh: () => Promise<void>;
}

export default function TodoSection({ todos, targetDate, onRefresh }: Props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

    const handleOpenAddModal = () => {
        setSelectedTodo(null);
        setIsModalVisible(true);
    };

    const handleOpenEditModal = (todo: Todo) => {
        setSelectedTodo(todo);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedTodo(null);
    };

    const handleDelete = (todoId: number) => {
        const executeDelete = async () => {
            try {
                await todoApi.deleteTodo(todoId);
                await onRefresh();
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("일정을 삭제하는 중 오류가 발생했습니다.");
                } else {
                    Alert.alert("오류", "일정을 삭제하는 중 오류가 발생했습니다.");
                }
            }
        }

        if (Platform.OS === "web") {
            if (confirm("정말 이 일정을 삭제 처리 하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("경고", "정말 이 일정을 삭제 처리 하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    const handleToggleStatus = async (todoId: number) => {
        try {

            await todoApi.toggleTodo(todoId);

            await onRefresh();
        } catch (error) {
            console.error("상태 변경 실패:", error);

            if (Platform.OS === "web") {
                alert("상태를 변경하는 중 오류가 발생했습니다.");
            } else {
                Alert.alert("오류", "상태를 변경하는 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <View className="mt-6 w-full ">
            <ContentContainer className={"overflow-hidden flex-1 p-0 rounded-[28px]"}>
                <TodoHistorySection
                    todos={todos}
                    onAddPress={handleOpenAddModal}
                    onEditPress={handleOpenEditModal}
                    onDeletePress={handleDelete}
                    onTogglePress={handleToggleStatus}
                />
                <TodoFormModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                    targetDate={targetDate}
                    initialData={selectedTodo}
                    onRefresh={onRefresh}
                />
            </ContentContainer>
        </View>
    );
}
