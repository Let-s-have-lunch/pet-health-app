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
