import { Stack, Redirect, usePathname } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

export default function ProfileLayout() {
    const { user, isInitialized } = useAuthStore();
    const pathname = usePathname();

    if (!isInitialized) {
        return <LoadingIndicator />;
    }

    if (!user) {
        // 원래 가려던 경로(pathname)를 returnUrl이라는 파라미터로 로그인 페이지에 전달합니다.
        return <Redirect href={{ pathname: "/auth/login", params: { returnUrl: pathname } }} />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        />
    );
}
