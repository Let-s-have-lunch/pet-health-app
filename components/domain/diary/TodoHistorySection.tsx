import React from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Check, CheckSquare, Edit2, Plus, Square, SquareCheck, Trash2 } from "lucide-react-native";

import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";
import { Todo } from "@/types/todo";

interface Props {
    todos: Todo[];
    onAddPress: () => void;
    onEditPress: (todo: Todo) => void;
    onDeletePress: (id: number) => void;
    onTogglePress: (todoId: number) => void;
}

function TodoHistorySection({
    todos,
    onAddPress,
    onEditPress,
    onDeletePress,
    onTogglePress,
}: Props) {
    return (
        <View className={twMerge("mb-6 mt-2")}>
            <View className={twMerge("flex-row justify-between items-center mb-2")}>
                <TextComponent className={twMerge("text-xl font-bold")}>할일 등록</TextComponent>
                <Button
                    size={"small"}
                    onPress={onAddPress}
                    className={"px-0 py-0 w-[48px] h-[48px]"}>
                    <Plus size={20} color="#2D3748" />
                </Button>
            </View>

            <View className={twMerge("gap-3", "pt-2")}>
                {todos.length > 0 ? (
                    todos.map(todo => {
                        const isCompleted = todo.isCompleted;

                        return (
                            <Card
                                key={todo.id}
                                className={twMerge("elevation-1 flex-row items-center p-4 gap-4")}>
                                {/* 1. 체크 아이콘 (완료 여부에 따라 색상 변경) */}
                                <Button
                                    variant={"icon"}
                                    className="mr-1 p-0"
                                    onPress={() => onTogglePress(todo.id)}>
                                    {isCompleted ? (
                                        <SquareCheck size={22} color="#F2C6C2" />
                                    ) : (
                                        <Square size={22} color="#AEB8B6" />
                                    )}
                                </Button>

                                {/* 2. 내용 및 날짜/시간 */}
                                <View className="flex-1">
                                    <TextComponent
                                        className={twMerge(
                                            "font-semibold text-[15px] mb-1",
                                            // 완료 시 회색 텍스트 & 취소선 적용
                                            isCompleted
                                                ? "text-text-secondary line-through"
                                                : "text-text-default",
                                        )}>
                                        {todo.title}
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge("text-xs text-text-secondary")}>
                                        {/* date-fns 포맷 적용 (소문자 am/pm 출력을 위해 toLowerCase() 체이닝) */}
                                        {format(
                                            new Date(todo.date),
                                            "yy.MM.dd a hh:mm",
                                        ).toLowerCase()}
                                    </TextComponent>
                                </View>

                                {/* 3. 액션 버튼 (수정, 삭제) */}
                                <View className={twMerge("flex-row items-center ml-2")}>
                                    {/* 완료된 항목은 사진 디자인처럼 수정(Edit2) 버튼을 숨김 */}
                                    {!isCompleted && (
                                        <Button variant={"icon"} onPress={() => onEditPress(todo)}>
                                            <Edit2 size={16} color="#000000" />
                                        </Button>
                                    )}
                                    <Button variant={"icon"} onPress={() => onDeletePress(todo.id)}>
                                        <Trash2 size={16} color="#000000" />
                                    </Button>
                                </View>
                            </Card>
                        );
                    })
                ) : (
                    <Card
                        shadow={"sm"}
                        className={twMerge("text-center text-text-secondary py-6 text-sm")}>
                        등록된 일정이 없습니다.
                    </Card>
                )}
            </View>
        </View>
    );
}

export default TodoHistorySection;
