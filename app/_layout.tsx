import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/stores/theme/useThemeStore"; // 문법 오류
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    const { theme } = useThemeStore();
    const { setColorScheme } = useColorScheme();

    useEffect(() => {

        setColorScheme(theme);
    }, [theme, setColorScheme]);

    return (
        <SafeAreaProvider>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <SafeAreaView className={"flex-1 "}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
