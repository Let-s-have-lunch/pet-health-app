import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import todoApi from "@/api/user/todoApi";
import diaryApi from "@/api/user/diaryApi";
import { Diary } from "@/types/diary";
import { Todo } from "@/types/todo";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ContentContainer from "@/components/layouts/common/ContentContainer";
import TodoSection from "@/app/(main)/(tabs)/diary/list/TodoSection";

export default function DailyDetailScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [diary, setDiary] = useState<Diary[]>([]);
    const [todo, setTodo] = useState<Todo[]>([]);


    const fetchDailyData = useCallback(async () => {
        try {
            const [diaries, todos] = await Promise.all([
                diaryApi.getDiaryList(date),
                todoApi.getTodoList(date),
            ]);

            setDiary(diaries);
            setTodo(todos);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    useEffect(() => {
        if (date) fetchDailyData().then(() => {});
    }, [date, fetchDailyData]);

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
                    {/*<DiaryComponent diaries={diary} />*/}
                    <TodoSection todos={todo} targetDate={date} onRefresh={fetchDailyData} />
                </ContentContainer>
            </ScrollView>
        </View>
    );
}
