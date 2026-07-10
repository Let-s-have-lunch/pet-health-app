import { Stack } from "expo-router";

export default function WeightLogsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* 기본 리스트 페이지 */}
            <Stack.Screen name="index" />
            {/* create 페이지를 모달로 설정 */}
            <Stack.Screen
                name="create/index"
                options={{
                    presentation: "transparentModal", // 투명한 배경의 모달
                    animation: "fade",
                }}
            />
        </Stack>
    );
}
