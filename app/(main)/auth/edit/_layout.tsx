import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function ProtectedLayout() {
    const { user } = useAuthStore();

    // 유저가 없다면 하위 페이지들을 아예 렌더링하지 않고 로그인 페이지로 튕겨냄
    if (!user) {
        return <Redirect href="/auth/login" />;
    }

    // 유저가 있다면 정상적으로 스택을 렌더링함
    return <Stack />;
}
