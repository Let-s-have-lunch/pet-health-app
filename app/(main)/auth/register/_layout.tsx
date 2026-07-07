import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

export default function RegisterLayout() {
    const { user, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <LoadingIndicator />;
    }

    if (user) {
        return <Redirect href="/" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}
