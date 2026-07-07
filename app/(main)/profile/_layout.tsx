import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

export default function ProfileLayout() {
    const { user, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <LoadingIndicator />;
    }

    if (!user) {
        return <Redirect href="/auth/login" />;
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
