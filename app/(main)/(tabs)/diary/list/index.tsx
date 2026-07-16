import React, { useState, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import todoApi from "@/api/user/todoApi";
import diaryApi from "@/api/user/diaryApi";
import { Diary } from "@/types/diary";
import { Todo } from "@/types/todo";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import DiarySection from "@/app/(main)/(tabs)/diary/list/DiarySection";
import TodoSection from "@/app/(main)/(tabs)/diary/list/TodoSection";

export default function DailyDetailScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);

    console.log(date);

    const loadDailyData = useCallback(async () => {
        if (!date) return;
        setIsLoading(true);
        
        try {
            const [diaryList, todoList] = await Promise.all([
                diaryApi.getDiaryList(date),
                todoApi.getTodoList(date),
            ]);

            setDiaries(diaryList);
            setTodos(todoList);
        } catch (error) {
            console.error("데이터 로드 실패 상세 원인: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    useFocusEffect(
        useCallback(() => {
            void loadDailyData();
        }, [loadDailyData]),
    );

    if (isLoading) {
        return (
            <View className="py-20">
                <LoadingIndicator />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <ScrollView className={"flex-1"}>
                <ContentContainer className={"p-0"}>
                    <DiarySection diaryList={diaries} date={date} />

                    <TodoSection todos={todos} targetDate={date} onRefresh={loadDailyData}/>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}
