import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import todoApi from "@/api/user/todoApi";
import diaryApi from "@/api/user/diaryApi";
import { Diary } from "@/types/diary";
import { Todo } from "@/types/todo";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import DiarySection from "@/app/(main)/(tabs)/diary/DiarySection";
import TodoSection from "@/app/(main)/(tabs)/diary/TodoSection";

export default function DailyDetailScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [diaryData, setDiaryData] = useState<Diary[]>([]);
    const [todoData, setTodoData] = useState<Todo[]>([]);

    const dailyData = useCallback(async () => {
        try {
            const [diaryList, todoList] = await Promise.all([
                diaryApi.getDiaryList(date),
                todoApi.getTodoList(date),
            ]);

            setDiaryData(diaryList);
            setTodoData(todoList);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    // useEffect(() => {
    //     if (date) fetchDailyData().then(() => {});
    // }, [date, fetchDailyData]);
    useFocusEffect(
        useCallback(() => {
            void dailyData();
        }, [dailyData]),
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
                    <DiarySection diaryList={diaryData}/>
                    <TodoSection todoList={todoData} targetDate={date}/>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}
