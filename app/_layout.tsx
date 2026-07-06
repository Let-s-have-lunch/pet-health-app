import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/stores/theme/useThemeStore"; // 문법 오류
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    const { theme } = useThemeStore();
    // 앱에서 라이브모드와 다크모를 적용하기 위한  기능을 호출
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        // 앱을 위한것
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
