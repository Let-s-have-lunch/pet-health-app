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
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);

    console.log(date);

    const loadDailyData = useCallback(async () => {
        if (!date) {
            console.warn("⚠️ date 파라미터가 없습니다!");
            return;
        }
        setIsLoading(true);
        try {
            console.log("🚀 API 요청 시작! 보낼 날짜:", date);

            const [diaryList, todoList] = await Promise.all([
                diaryApi.getDiaryList(date),
                todoApi.getTodoList(date),
            ]);

            setDiaries(diaryList);
            setTodos(todoList);
        } catch (error: any) {
            console.error("❌ 데이터 로드 실패 상세 원인:");

            // Axios 등을 쓸 때 서버가 반환한 진짜 500 에러 메시지 출력
            if (error.response) {
                console.error("상태 코드:", error.response.status); // 500
                console.error("서버 에러 데이터:", error.response.data); // 여기에 진짜 이유가 들어있습니다!
            } else {
                console.error("일반 에러:", error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, [date]);


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

                    <TodoSection todoList={todos} targetDate={date} onRefresh={loadDailyData}/>
                </ContentContainer>
            </ScrollView>
        </View>
    );
}
