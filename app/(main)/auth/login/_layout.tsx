import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function LoginLayout() {
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

export default LoginLayout;
